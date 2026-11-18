/* End-to-end browser checks for the separate Next.js + Express + Mongo apps.
 * Requires both servers and a test database; all QA records are marked DEMO.
 * Set ADMIN_EMAIL and ADMIN_PASSWORD (or use unshipped .local/preview-credentials). */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {randomBytes}=require('node:crypto');
const {chromium}=require('playwright');
const ROOT=path.resolve(__dirname,'..');
const BASE=process.env.TEST_URL||'http://127.0.0.1:3000';
const TAG=randomBytes(4).toString('hex');
const QA_HEADERS={'X-Forwarded-For':`198.19.${parseInt(TAG.slice(0,2),16)}.${parseInt(TAG.slice(2,4),16)}`};
const readCredentials=()=>{
  if(process.env.ADMIN_EMAIL&&process.env.ADMIN_PASSWORD)return {ADMIN_EMAIL:process.env.ADMIN_EMAIL,ADMIN_PASSWORD:process.env.ADMIN_PASSWORD};
  const file=path.join(ROOT,'.local/preview-credentials');
  if(!fs.existsSync(file))throw Error('Set ADMIN_EMAIL and ADMIN_PASSWORD before running browser QA.');
  return Object.fromEntries(fs.readFileSync(file,'utf8').trim().split(/\r?\n/).map(line=>[line.slice(0,line.indexOf('=')),line.slice(line.indexOf('=')+1)]));
};
const report={inspectedAt:new Date().toISOString(),base:BASE,viewportRoutes:[],checks:[]};
function pass(label){report.checks.push(label);console.log(`PASS ${report.checks.length}: ${label}`);}
function getBrowser(){return chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--no-sandbox']});}
// The optional, externally hosted Google Maps iframe sometimes logs its own
// CORS probe failure; only site-origin console errors indicate an app defect.
function siteConsoleError(message){if(message.type()!=='error')return false;const url=message.location().url||'';return !(/^https:\/\/(?:www\.google\.com\/maps|maps\.googleapis\.com)/.test(url)||/maps\.googleapis\.com/.test(message.text()));}
async function routeSweep(browser,seed){
  const routes=['/','/find-tyres','/brands','/services','/gallery','/offers','/about','/contact','/services/new-tyres','/services/puncture-repair','/services/wheel-alignment','/services/wheel-balancing','/catalogue','/account','/admin/login',`/tyres/${seed.slug}`];
  for(const width of [1440,390,320,768,1080]){
    const inspected=width===1440||width===390?routes:['/','/find-tyres','/contact','/catalogue','/account','/admin/login',`/tyres/${seed.slug}`];
    const ctx=await browser.newContext({extraHTTPHeaders:QA_HEADERS,viewport:{width,height:900},reducedMotion:'reduce',deviceScaleFactor:1});
    for(const route of inspected){
      const page=await ctx.newPage(); const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('console',m=>{if(siteConsoleError(m))errors.push(m.text());});
      const response=await page.goto(BASE+route,{waitUntil:'networkidle',timeout:60000});
      assert.equal(response.status(),200,`${route} HTTP @ ${width}`);
      // Allow React hydration to finish before requesting off-screen lazy images;
      // mutating the loading attribute during hydration creates a false warning.
      await page.waitForTimeout(350);
      await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('img').forEach(img=>img.loading='eager');});
      try { await page.waitForFunction(()=>[...document.images].every(img=>img.complete && img.naturalWidth>0),null,{timeout:15000}); }
      catch(error){ const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.naturalWidth).map(i=>({src:i.src,loading:i.loading,complete:i.complete})));throw Error(`Image load on ${route} @ ${width}: ${JSON.stringify(broken)}; ${error.message}`); }
      const result=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:innerWidth,images:document.images.length,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),headings:document.querySelectorAll('h1').length,title:document.title,linkCount:document.querySelectorAll('a[href]').length}));
      assert.equal(result.width,width,`Horizontal overflow on ${route} @ ${width} (${result.width})`);
      assert.equal(result.headings,1,`H1 count on ${route} @ ${width}`);
      assert.deepEqual(result.broken,[],`Broken images on ${route} @ ${width}`);
      assert.deepEqual(errors,[],`Browser console on ${route} @ ${width}`);
      report.viewportRoutes.push({route,width,...result,broken:undefined});
      await page.close();
    }
    await ctx.close();
    pass(`${inspected.length} routes responsive at ${width}px with no overflow, broken images or browser exceptions`);
  }
}
async function publicInteractions(browser,seed){
  const ctx=await browser.newContext({extraHTTPHeaders:QA_HEADERS,viewport:{width:390,height:844}});const page=await ctx.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(BASE+'/',{waitUntil:'networkidle'});
  const mobile=page.getByRole('button',{name:'Open menu'});await mobile.click();assert.equal(await page.getByRole('button',{name:'Close menu'}).getAttribute('aria-expanded'),'true');
  await page.keyboard.press('Escape');assert.equal(await mobile.getAttribute('aria-expanded'),'false');
  await mobile.click();await page.locator('#primary-nav a[href="/find-tyres"]').click();await page.waitForURL('**/find-tyres');assert.equal(await mobile.getAttribute('aria-expanded'),'false');
  pass('Mobile menu opens, Escape closes, and route navigation closes it');
  await page.locator('.finder-submit').click();assert.match(await page.locator('#finder-error').textContent(),/tyre size|verified make/);
  await page.locator('#finder-size').fill('205/55 R16');await page.locator('.finder-submit').click();await page.locator('.finder-result').waitFor();
  assert.match(await page.locator('.finder-result').textContent(),/matching tyres found|matching tyre found/);
  assert((await page.locator('.finder-result').textContent()).includes('DEMO'));
  const found=await page.locator('.finder-result a[href^="/tyres/"]').first().getAttribute('href');assert(found);
  pass('Tyre finder validates input and returns database products by exact size with DEMO label');
  await page.locator('#finder-size').fill('999/99 R99');await page.locator('.finder-submit').click();await page.waitForFunction(()=>/width|rim|range|invalid/i.test(document.querySelector('#finder-error')?.textContent||''));
  await page.goto(BASE+'/');await page.getByRole('tab',{name:/Alignment/}).click();assert.equal(await page.getByRole('tab',{name:/Alignment/}).getAttribute('aria-selected'),'true');
  const first=await page.locator('#tyres .product-tile strong').first().textContent();await page.getByRole('button',{name:'Next tyre category'}).click();assert.notEqual(await page.locator('#tyres .product-tile strong').first().textContent(),first);
  await page.locator('.products-search input').fill('Bike');assert.equal(await page.locator('#tyres .product-tile').count(),1);
  await page.locator('#tyres .products-view').click();await page.waitForURL('**/catalogue');
  pass('Service tabs, category rotation/search and View all catalogue navigation work');
  await page.waitForFunction(()=>document.querySelector('[aria-label="Catalogue results"]')?.textContent.includes('products found'));
  assert.equal(await page.locator('[aria-label="Catalogue results"] .grid article').count(),12);
  await page.getByRole('button',{name:'Next',exact:true}).click();await page.waitForFunction(()=>document.querySelector('nav[aria-label="Product pages"]')?.textContent.includes('Page 2 of'));
  assert((await page.locator('[aria-label="Catalogue results"] .grid article').count())>=1);
  await page.locator('#catalogue-category').selectOption('Bike');await page.waitForFunction(()=>document.querySelector('[aria-label="Catalogue results"] [aria-live="polite"]')?.textContent.includes('4 products found'));
  assert.equal(await page.locator('[aria-label="Catalogue results"] .grid article').count(),4);
  await page.locator('#catalogue-availability').selectOption('out');await page.waitForFunction(()=>document.querySelector('[aria-label="Catalogue results"] [aria-live="polite"]')?.textContent.includes('1 product found'));
  await page.getByRole('button',{name:'Clear filters'}).click();await page.waitForFunction(()=>document.querySelector('[aria-label="Catalogue results"] [aria-live="polite"]')?.textContent.includes('products found'));
  await page.locator('#catalogue-size').fill('205/55 R16');await page.waitForFunction(()=>document.querySelector('[aria-label="Catalogue results"] [aria-live="polite"]')?.textContent.includes('1 product found'));
  const expected=await page.locator('[aria-label="Catalogue results"] article a[aria-label^="View"]').first().getAttribute('href');assert.equal(expected,`/tyres/${seed.slug}`);
  await page.locator('#catalogue-size').fill('');await page.locator('#catalogue-sort').selectOption('price_asc');
  await page.waitForFunction(()=>document.querySelector('#catalogue-sort')?.value==='price_asc' && document.querySelectorAll('[aria-label="Catalogue results"] article').length>0);
  const text=(await page.locator('[aria-label="Catalogue results"] article').first().textContent());assert(text.includes('DEMO'));
  pass('Catalogue pagination, category, stock, exact-size filtering, sorting and clear controls work');
  await page.goto(BASE+found,{waitUntil:'domcontentloaded',timeout:60000});assert.match(await page.locator('h1').textContent(),/DEMO/);
  assert((await page.getByRole('link',{name:/Request to Buy/}).count())>0);
  pass('Product details, stock state and request CTA reflect database records');
  await page.goto(BASE+'/contact');await page.locator('#enquiry-name').fill('Browser QA Customer');await page.locator('#enquiry-phone').fill('918300000001');await page.locator('#enquiry-email').fill(`browser-${TAG}@jmtyres.test`);await page.locator('#enquiry-vehicle').fill('QA vehicle');await page.locator('#enquiry-message').fill('Can your team review the exact size and confirm options?');await page.getByRole('button',{name:'Send enquiry'}).click();
  await page.getByText(/Enquiry saved ·/).waitFor({timeout:15000});const confirmation=await page.locator('[role="status"]').filter({hasText:'Enquiry saved'}).textContent();assert(confirmation.includes('Enquiry saved'));
  const wa=await page.getByRole('link',{name:/Optional: continue in WhatsApp/}).getAttribute('href');assert(new URL(wa).searchParams.get('text').includes('Browser QA Customer'));
  pass('Contact enquiry saves before an optional, correctly prefilled WhatsApp draft');
  assert.deepEqual(errors,[],'Mobile browser errors');await ctx.close();
}
async function accountAndAdmin(browser,seed){
  const {ADMIN_EMAIL,ADMIN_PASSWORD}=readCredentials();const admin=await browser.newContext({extraHTTPHeaders:QA_HEADERS,viewport:{width:1440,height:900},baseURL:BASE});const owner=await admin.newPage();
  await owner.goto('/admin/login');await owner.locator('input[type="email"]').fill(ADMIN_EMAIL);await owner.locator('input[type="password"]').fill(ADMIN_PASSWORD);await owner.getByRole('button',{name:/Sign in/}).click();await owner.waitForURL('**/admin',{waitUntil:'domcontentloaded',timeout:60000});await owner.getByRole('heading',{name:'Manage your shop.'}).waitFor();
  assert((await owner.locator('.admin-app').textContent()).includes('SIMULATED DEMO'));
  pass('Owner signs in to the protected console with demo/payment/storage configuration visible');
  const customer=await browser.newContext({extraHTTPHeaders:QA_HEADERS,viewport:{width:390,height:844},baseURL:BASE});const user=await customer.newPage();const email=`browser-customer-${TAG}@jmtyres.test`;const password='BrowserStrongPass-123!';
  await user.goto(`/request/${seed.slug}`);await user.waitForURL('**/account?next=*');await user.getByRole('button',{name:/New here\? Register/}).click();
  await user.getByRole('textbox',{name:/Full name/}).fill('Browser Demo Customer');await user.locator('input[type="email"]').fill(email);await user.locator('input[type="tel"]').fill('918300000002');await user.locator('input[type="password"]').fill(password);await user.getByRole('button',{name:/Create account/}).click();
  await user.waitForURL(`**/request/${seed.slug}`,{waitUntil:'domcontentloaded',timeout:60000});await user.getByRole('heading',{name:'Request details'}).waitFor();
  await user.getByRole('textbox',{name:/Additional message/}).fill('QA browser request, not an actual purchase.');await user.getByRole('button',{name:'Submit purchase request'}).click();await user.getByRole('heading',{name:'Request saved.'}).waitFor();const href=await user.getByRole('link',{name:/View request/}).getAttribute('href');const id=href.split('/').pop();assert.match(id,/^JM-/);
  await user.getByRole('link',{name:/View request/}).click();await user.waitForURL('**/account/requests/*',{waitUntil:'domcontentloaded',timeout:60000});await user.getByText(/owner must approve/i).first().waitFor({timeout:15000});
  pass('Customer registration, return-to-request, form submission and pending history work');
  await owner.goto(`/admin/requests?request=${encodeURIComponent(id)}`,{waitUntil:'domcontentloaded',timeout:60000});await owner.getByRole('button',{name:/Approve and reserve stock/}).waitFor();
  await owner.getByRole('button',{name:/Approve and reserve stock/}).click();await owner.getByRole('status').filter({hasText:/approved and stock reserved/}).waitFor();
  await user.reload({waitUntil:'domcontentloaded',timeout:60000});await user.getByRole('button',{name:/Start Demo Payment/}).waitFor();await user.getByRole('button',{name:/Start Demo Payment/}).click();await user.getByRole('button',{name:'Demo Accept Payment'}).waitFor();assert(await user.getByRole('button',{name:'Demo Verify Payment'}).isDisabled());
  await user.getByRole('button',{name:'Demo Accept Payment'}).click();await user.getByRole('button',{name:'Demo Verify Payment'}).waitFor({state:'visible'});await user.getByRole('button',{name:'Demo Verify Payment'}).click();await user.getByText('Simulated demo verification recorded').waitFor();
  assert((await user.locator('section').filter({hasText:'Transactions'}).textContent()).includes('Demo (not real)'));
  pass('Owner approval reserves stock; separate demo accept/verify records a simulated transaction without Razorpay');
  await owner.reload({waitUntil:'domcontentloaded',timeout:60000});await owner.getByRole('button',{name:/Confirm collection & complete/}).waitFor();owner.once('dialog',d=>d.accept());await owner.getByRole('button',{name:/Confirm collection & complete/}).click();await owner.getByRole('status').filter({hasText:/completed/}).waitFor();
  await user.reload({waitUntil:'domcontentloaded',timeout:60000});await user.getByText(/Completed/,{exact:false}).first().waitFor();
  pass('Owner marks paid demo request complete; customer sees updated status and history');
  const anonymous=await browser.newContext({extraHTTPHeaders:QA_HEADERS,baseURL:BASE});const forgot=await anonymous.newPage();await forgot.goto('/account');await forgot.getByRole('button',{name:'Forgot password?'}).click();await forgot.locator('input[type="email"]').fill(email);await forgot.getByRole('button',{name:'Request reset'}).click();await forgot.getByText(/instructions have been sent or logged/i).waitFor();
  // Browser fetch shares the secure localhost session cookie; Playwright's Node
  // request context does not send Secure cookies over the preview's HTTP loopback.
  const notificationResponse=await owner.evaluate(async()=>{const response=await fetch('/api/admin/notifications');return {status:response.status,data:await response.json()};});
  assert.equal(notificationResponse.status,200,`Admin outbox fetch: ${JSON.stringify(notificationResponse.data)}`);
  const reset=notificationResponse.data.items.find(x=>x.subject==='Reset your password' && x.recipient===email);assert(reset?.link);
  if(process.env.E2B_SANDBOX_ID)assert.equal(new URL(reset.link).host,`3000-${process.env.E2B_SANDBOX_ID}.e2b.app`,'Preview reset link must be browser reachable');
  await user.goto(BASE+new URL(reset.link).pathname+new URL(reset.link).search);await user.getByRole('heading',{name:'Reset password'}).waitFor();await user.locator('input[type="password"]').fill('NewBrowserStrongPass-123!');await user.getByRole('button',{name:'Set new password'}).click();await user.getByText('Password reset. You can sign in now.').waitFor();
  await user.locator('input[type="email"]').fill(email);await user.locator('input[type="password"]').fill('NewBrowserStrongPass-123!');await user.getByRole('button',{name:'Sign in'}).click();await user.getByRole('heading',{name:/Hello, Browser/}).waitFor();
  pass('Forgot/reset works while signed in, resets the session and uses a reachable preview link');
  await anonymous.close();await customer.close();await admin.close();
}
(async()=>{let browser;try{browser=await getBrowser();const seed=(await (await fetch(`${BASE}/api/products?size=205%2F55%20R16`)).json()).items.find(x=>x.isDemo&&x.stockQty>0);assert(seed,'Need 205/55 R16 seeded DEMO tyre');if(!process.argv.includes('--flows-only'))await routeSweep(browser,seed);await publicInteractions(browser,seed);await accountAndAdmin(browser,seed);report.result='passed';console.log(`\n${report.checks.length} browser feature groups passed; ${report.viewportRoutes.length} route/viewport combinations.`);}catch(error){report.result='failed';report.error=String(error);console.error('BROWSER QA FAILED:',error);process.exitCode=1;}finally{fs.writeFileSync(path.join(ROOT,'docs/browser-verification.json'),JSON.stringify(report,null,2));if(browser)await browser.close();}})();
