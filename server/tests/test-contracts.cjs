/* Exhaustive method/path contract smoke test. Optional BASELINE_URL compares
 * every registered endpoint with the pre-migration server, without saving
 * cookies, reset links or personal data in the report. Run on demo/test DB. */
const assert=require('node:assert/strict');
const {isDeepStrictEqual}=require('node:util');
const {randomUUID}=require('node:crypto');
const {writeFileSync}=require('node:fs');
const target=process.env.TEST_URL || 'http://127.0.0.1:4000';
const baseline=process.env.BASELINE_URL || '';
const tag=randomUUID().slice(0,8);
const ip=`198.18.${parseInt(tag.slice(0,2),16)}.${parseInt(tag.slice(2,4),16)}`;
if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) throw Error('Set ADMIN_EMAIL and ADMIN_PASSWORD before contract QA.');
async function request(base,path,{method='GET',body,cookie='',form}={}) {
  const headers={'X-Forwarded-For':ip,...(cookie?{Cookie:cookie}:{}),...(body!==undefined?{'Content-Type':'application/json'}:{})};
  const res=await fetch(base+path,{method,headers,body:body===undefined?form:JSON.stringify(body),signal:AbortSignal.timeout(20000),redirect:'manual'});
  const data=await res.json().catch(()=>({}));
  return {status:res.status,data,cookie:res.headers.get('set-cookie')?.split(';')[0] || ''};
}
(async()=>{
  const loginBody={email:process.env.ADMIN_EMAIL,password:process.env.ADMIN_PASSWORD};
  const owner=await request(target,'/api/auth/login',{method:'POST',body:loginBody});
  assert.equal(owner.status,200,'Candidate owner login');assert.equal(owner.data.user.role,'admin');
  let oldOwner=owner;
  if (baseline) {
    oldOwner=await request(baseline,'/api/auth/login',{method:'POST',body:loginBody});
    assert.equal(oldOwner.status,200,'Baseline owner login');
    const cross=await request(baseline,'/api/auth/me',{cookie:owner.cookie});
    const reverse=await request(target,'/api/auth/me',{cookie:oldOwner.cookie});
    assert.equal(cross.data.user?.role,'admin','Candidate cookie must authenticate on baseline');
    assert.equal(reverse.data.user?.role,'admin','Baseline cookie must authenticate on candidate');
  }
  const customerBody={name:'Contract QA Customer',email:`contract-${tag}@jmtyres.test`,phone:'918300000000',password:'ContractStrong-123!'};
  const customer=await request(target,'/api/auth/register',{method:'POST',body:customerBody});
  assert.equal(customer.status,201,'Candidate customer registration');
  if (baseline) assert.equal((await request(baseline,'/api/auth/me',{cookie:customer.cookie})).data.user?.role,'customer');
  const prod=(await request(target,'/api/products?limit=1')).data.items[0];assert(prod?.slug,'Seed DEMO catalogue first');
  const owned=(await request(target,'/api/admin/products?limit=1',{cookie:owner.cookie})).data.items[0];assert(owned?.id);
  const shopRequest=(await request(target,'/api/admin/requests?limit=1',{cookie:owner.cookie})).data.items[0];assert(shopRequest?.requestId,'Need at least one demo QA purchase request');
  const customerId=customer.data.user.id;
  const missing='JM-DOES-NOT-EXIST';
  const emptyForm=()=>new FormData();
  // Each row corresponds to a distinct existing HTTP method/path. Inputs for
  // mutations are intentionally invalid/non-destructive, except idempotent seed.
  const tests=[
    ['GET','/api/health',200],
    ['GET','/api/auth/me',200],
    ['POST','/api/auth/register',400,{body:{}}],
    ['POST','/api/auth/login',401,{body:{email:'no-such-account@example.test',password:'wrong'}}],
    ['POST','/api/auth/logout',200],
    ['PATCH','/api/auth/profile',400,{role:'customer',body:{}}],
    ['POST','/api/auth/forgot-password',400,{body:{}}],
    ['POST','/api/auth/reset-password',400,{body:{}}],
    ['GET','/api/products?limit=3',200],
    ['GET','/api/products/search?limit=3',200],
    ['GET',`/api/products/${prod.slug}`,200],
    ['GET','/api/categories',200],
    ['GET','/api/brands',200],
    ['GET','/api/content/home',200],
    ['POST','/api/tyre-finder/search',200,{body:{method:'size',width:205,aspectRatio:55,rimDiameter:16}}],
    ['GET','/api/tyre-finder/vehicle-options',200],
    ['POST','/api/enquiries',400,{body:{}}],
    ['GET','/api/requests/my',200,{role:'customer'}],
    ['POST','/api/requests',400,{role:'customer',body:{}}],
    ['GET',`/api/requests/${missing}`,404,{role:'customer'}],
    ['POST',`/api/requests/${missing}/payment`,404,{role:'customer'}],
    ['GET','/api/payments/config',200],
    ['POST','/api/payments/webhook',503,{body:{}}],
    ['POST','/api/payments/create-order',404,{role:'customer',body:{requestId:missing}}],
    ['POST','/api/payments/verify',503,{role:'customer',body:{}}],
    ['POST','/api/payments/demo/accept',404,{role:'customer',body:{paymentId:'000000000000000000000000'}}],
    ['POST','/api/payments/demo/verify',404,{role:'customer',body:{paymentId:'000000000000000000000000'}}],
    ['POST','/api/payments/demo/fail',404,{role:'customer',body:{paymentId:'000000000000000000000000'}}],
    ['GET','/api/admin/settings',200,{role:'admin'}],
    ['GET','/api/admin/dashboard',200,{role:'admin'}],
    ['GET','/api/admin/content/home',200,{role:'admin'}],
    ['PUT','/api/admin/content/home',400,{role:'admin',body:{}}],
    ['POST','/api/admin/products/images',400,{role:'admin',form:emptyForm}],
    ['DELETE','/api/admin/products/images?url=not-an-upload',400,{role:'admin'}],
    ['GET','/api/admin/products?limit=3',200,{role:'admin'}],
    ['POST','/api/admin/products',400,{role:'admin',body:{}}],
    ['GET',`/api/admin/products/${owned.id}`,200,{role:'admin'}],
    ['PUT',`/api/admin/products/${owned.id}`,400,{role:'admin',body:{}}],
    ['PATCH',`/api/admin/products/${owned.id}/stock`,400,{role:'admin',body:{stockQty:-1}}],
    ['DELETE','/api/admin/products/not-an-id',400,{role:'admin'}],
    ['GET','/api/admin/requests?limit=3',200,{role:'admin'}],
    ['GET',`/api/admin/requests/${shopRequest.requestId}`,200,{role:'admin'}],
    ['PATCH',`/api/admin/requests/${missing}/approve`,409,{role:'admin',body:{paymentType:'full'}}],
    ['PATCH',`/api/admin/requests/${missing}/reject`,409,{role:'admin',body:{reason:'Demo QA'}}],
    ['PATCH',`/api/admin/requests/${missing}/cancel`,409,{role:'admin',body:{reason:'Demo QA'}}],
    ['PATCH',`/api/admin/requests/${missing}/complete`,409,{role:'admin',body:{offlineBalancePaidPaise:0}}],
    ['GET','/api/admin/enquiries',200,{role:'admin'}],
    ['PATCH','/api/admin/enquiries/not-an-id',404,{role:'admin',body:{status:'closed'}}],
    ['GET','/api/admin/customers',200,{role:'admin'}],
    ['GET',`/api/admin/customers/${customerId}`,200,{role:'admin'}],
    ['GET','/api/admin/notifications',200,{role:'admin'}],
    ['GET','/api/admin/audit',200,{role:'admin'}],
    ['POST','/api/admin/demo-seed',200,{role:'admin'}],
  ];
  assert.equal(tests.length,53,'Audit route count');
  const report=[];
  for (const [method,path,status,options={}] of tests) {
    const makeOptions=(server)=>({method,body:options.body,form:options.form?.(),cookie:options.role==='admin'?(server===target?owner.cookie:oldOwner.cookie):options.role==='customer'?customer.cookie:''});
    const actual=await request(target,path,makeOptions(target));
    assert.equal(actual.status,status,`${method} ${path} candidate status (${actual.data.error || ''})`);
    if (baseline) {
      const old=await request(baseline,path,makeOptions(baseline));
      assert.equal(actual.status,old.status,`${method} ${path} status drift`);
      assert(isDeepStrictEqual(actual.data,old.data),`${method} ${path} response drift`);
    }
    report.push({method,path,status,keys:Object.keys(actual.data).sort()});
  }
  // Check the two major middleware boundaries in addition to the full matrix.
  const invalid=await fetch(target+'/api/auth/register',{method:'POST',headers:{'Content-Type':'text/plain'},body:'{}'});
  assert.equal(invalid.status,415,'JSON content type required');
  const spoof=await fetch(target+'/api/enquiries',{method:'POST',headers:{Origin:'https://not-the-shop.example','X-Forwarded-Host':'not-the-shop.example','Content-Type':'application/json'},body:'{}'});
  assert.equal(spoof.status,403,'Forged forwarded host rejected');
  const unknown=await request(target,'/api/not-an-endpoint');assert.equal(unknown.status,404);
  if (process.env.CONTRACT_REPORT) writeFileSync(process.env.CONTRACT_REPORT,JSON.stringify({checkedAt:new Date().toISOString(),target,baseline:baseline || null,passed:report.length,crossServerSessions:!!baseline,tests:report},null,2)+'\n');
  console.log(`PASS: ${report.length} existing method/path contracts, status and response parity${baseline?' vs. baseline':''}; auth cookies and middleware checks passed.`);
})().catch(error=>{console.error('CONTRACT QA FAILED:',error.message);process.exitCode=1;});
