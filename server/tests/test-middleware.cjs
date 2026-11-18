/* Non-destructive body/origin/role/error boundary checks on an existing server. */
const assert=require('node:assert/strict');
const {randomUUID}=require('node:crypto');
const base=process.env.TEST_URL || 'http://127.0.0.1:4000';
const tag=randomUUID().replace(/-/g,'').slice(0,4);
const headers={'X-Forwarded-For':`198.18.${parseInt(tag.slice(0,2),16)}.${parseInt(tag.slice(2,4),16)}`};
let passed=0;
const check=(condition,label)=>{assert(condition,label);console.log(`PASS ${++passed}: ${label}`);};
(async()=>{
  let r=await fetch(base+'/api/auth/register',{method:'POST',headers:{...headers,'Content-Type':'text/plain'},body:'{}'});
  check(r.status===415 && (await r.json()).code==='REQUEST_ERROR','JSON content type enforced');
  r=await fetch(base+'/api/auth/register',{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:'not-json'});
  check(r.status===400 && (await r.json()).error==='Malformed JSON request.','Malformed JSON has stable JSON error');
  r=await fetch(base+'/api/auth/register',{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:''});
  check(r.status===400 && (await r.json()).error==='Malformed JSON request.','Empty JSON body rejected');
  r=await fetch(base+'/api/auth/register',{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({junk:'a'.repeat(33000)})});
  check(r.status===413 && (await r.json()).code==='REQUEST_ERROR','Oversize JSON rejected at 32 KiB');
  r=await fetch(base+'/api/enquiries',{method:'POST',headers:{...headers,Origin:'https://forged.example','X-Forwarded-Host':'forged.example','Content-Type':'application/json'},body:'{}'});
  check(r.status===403 && (await r.json()).error==='Cross-origin request blocked.','Spoofed forwarded host cannot bypass origin policy');
  r=await fetch(base+'/api/admin/dashboard',{headers});
  check(r.status===401 && (await r.json()).code==='AUTH_REQUIRED','Admin route protected before controller');
  r=await fetch(base+'/api/payments/webhook',{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:'x'.repeat(131073)});
  check(r.status===413 && /Webhook too large/.test((await r.json()).error),'Webhook raw payload limited independently of JSON parser');
  r=await fetch(base+'/api/not-an-endpoint',{headers});
  check(r.status===404 && r.headers.get('cache-control')==='no-store' && (await r.json()).code==='NOT_FOUND','Unknown API has JSON 404 and no-store caching');
  r=await fetch(base+'/uploads/products/00000000-0000-4000-8000-000000000000.webp',{headers});
  check(r.status===404,'Missing local upload returns 404');
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    r=await fetch(base+'/api/auth/login',{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify({email:process.env.ADMIN_EMAIL,password:process.env.ADMIN_PASSWORD})});
    assert.equal(r.status,200);const cookie=r.headers.get('set-cookie').split(';')[0];
    r=await fetch(base+'/api/admin/products/images',{method:'POST',headers:{...headers,Cookie:cookie,'Content-Type':'multipart/form-data; boundary=BAD'},body:'--BAD\r\n'});
    check(r.status===400 && (await r.json()).code==='REQUEST_ERROR','Malformed multipart rejected after owner authentication');
  }
  console.log(`${passed} middleware boundary checks passed against ${base}.`);
})().catch(error=>{console.error('MIDDLEWARE QA FAILED:',error);process.exitCode=1;});
