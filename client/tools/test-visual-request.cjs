/* Regression checks for the five-link redesign, fixed engineering grid, brand bands and accessible motion. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const base = process.env.TEST_URL || 'http://127.0.0.1:3000';
const root = path.resolve(__dirname, '..');
const report = { checkedAt: new Date().toISOString(), base, checks: [], widths: [] };
const pass = label => { report.checks.push(label); console.log(`PASS ${report.checks.length}: ${label}`); };
const browserPath = process.env.CHROME_PATH;
(async () => {
  let browser;
  try {
    browser = await chromium.launch({ headless:true, ...(browserPath ? {executablePath:browserPath} : {}), args:['--no-sandbox'] });
    const viewports = [320, 360, 390, 720, 721, 768, 970, 971, 1080, 1200, 1250, 1280, 1357, 1440, 1600, 1920];
    const ctx = await browser.newContext({ reducedMotion:'reduce', viewport:{ width:1440, height:900 } });
    for (const width of viewports) {
      const page = await ctx.newPage();await page.setViewportSize({ width, height:900 });
      const errors=[]; page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto(base + '/', { waitUntil:'domcontentloaded', timeout:60000 });
      assert.equal(response.status(), 200);
      const result = await page.evaluate(async () => {
        await document.fonts.ready;
        const box = selector => document.querySelector(selector)?.getBoundingClientRect();
        const section = box('.engineering-section'), story = box('.engineering-story'), details = box('.engineering-details'), tyres = box('#tyres');
        return { width:innerWidth, documentWidth:document.documentElement.scrollWidth, gap:Math.round(tyres.top - Math.max(story.bottom,details.bottom)), overflow:Math.round(Math.max(story.bottom,details.bottom)-section.bottom), nav:[...document.querySelectorAll('#primary-nav > a')].map(el=>el.querySelector('.nav-label')?.firstChild?.textContent.trim()), bands:document.querySelectorAll('#home-brands .brand-rail').length };
      });
      assert.equal(result.documentWidth, width, `Home overflows at ${width}px`);
      assert(result.gap >= 20, `Engineering overlaps tyres at ${width}px (${result.gap}px)`);
      assert(result.overflow <= 2, `Engineering cards escape their section at ${width}px`);
      assert.deepEqual(result.nav, ['Home','Find Tyres','Services','About','Contact']);
      assert.equal(result.bands, 2);
      assert.deepEqual(errors, [], `Home browser exceptions at ${width}px`);
      report.widths.push(result);
      await page.close();
    }
    pass('Engineering stays inside its allocated section at 16 widths (320–1920px), with five primary links and two brand bands');
    for (const width of [1440, 768, 390, 320]) {
      const page = await ctx.newPage();await page.setViewportSize({ width, height:900 });
      for (const route of ['/about','/find-tyres','/services','/contact']) {
        const response=await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:60000});assert.equal(response.status(),200);
        const output=await page.evaluate(()=>({ width:document.documentElement.scrollWidth, heroImage:document.querySelector('.page-hero>img')?.getBoundingClientRect().height, logos:document.querySelectorAll('#service-brands img').length, steps:document.querySelectorAll('.page-block ol li').length, sizeGuide:!!document.querySelector('#sidewall-guide') }));
        assert.equal(output.width,width, `${route} overflows at ${width}px`);
        if(route==='/about') assert(output.heroImage <= (width <=720 ? 200 : 400), `Oversized About image at ${width}px`);
        if(route==='/services') assert(output.logos>=5 && output.steps===3,'Services brand marks and practical checks');
        if(route==='/contact') assert.equal(output.steps,3,'Contact preparation content');
        if(route==='/find-tyres') assert(output.sizeGuide,'Public sidewall explainer');
      }
      await page.close();
    }
    pass('About image is compact and four main subpages have useful new sections without overflow at 320/390/768/1440px');
    const service = await ctx.newPage();await service.goto(base+'/services',{waitUntil:'domcontentloaded'});
    const serviceBrands=await service.locator('#service-brands img').evaluateAll(images=>images.map(img=>({alt:img.alt,width:img.naturalWidth})));
    assert(serviceBrands.every(item=>item.width>0 && /logo/.test(item.alt)), `Brand marks failed: ${JSON.stringify(serviceBrands)}`);
    assert.match(await service.locator('#service-brands').innerText(),/DEMO|no brands/i);
    await service.close();
    pass('Service brands have locally served, loaded logo images and an explicit demo disclaimer');
    const anonymous=await ctx.newPage();await anonymous.goto(base+'/find-tyres',{waitUntil:'domcontentloaded'});
    const publicData=await anonymous.evaluate(async()=>{
      const [catalogue,finder]=await Promise.all([fetch('/api/products?limit=4'),fetch('/api/tyre-finder/search',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({method:'size',width:205,aspectRatio:55,rimDiameter:16})})]);
      return {catalogueStatus:catalogue.status,finderStatus:finder.status,products:(await catalogue.json()).items?.length,matches:(await finder.json()).total};
    });
    assert.equal(publicData.catalogueStatus,200);assert.equal(publicData.finderStatus,200);assert(publicData.products>0 && publicData.matches>0);
    await anonymous.goto(base+'/catalogue',{waitUntil:'domcontentloaded'});assert.equal(new URL(anonymous.url()).pathname,'/catalogue');await anonymous.close();
    pass('Anonymous visitors can check catalogue availability and exact-size finder results without sign-in');
    const reveal=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
    await reveal.goto(base+'/find-tyres',{waitUntil:'domcontentloaded'});
    await reveal.waitForFunction(()=>document.querySelector('#sidewall-heading')?.classList.contains('motion-pending'));
    const directions=await reveal.locator('.motion-heading.motion-pending').evaluateAll(els=>els.map(el=>el.classList.contains('motion-from-right')?'right':'left'));
    assert(directions.includes('left')&&directions.includes('right'),'Some headings should enter from both sides');
    await reveal.locator('#sidewall-guide').scrollIntoViewIfNeeded();
    await reveal.waitForFunction(()=>document.querySelector('#sidewall-heading')?.classList.contains('motion-visible'));
    await reveal.goto(base+'/',{waitUntil:'domcontentloaded'});
    const workshop=reveal.locator('.engineering-story > img');await workshop.scrollIntoViewIfNeeded();
    await reveal.waitForFunction(()=>{const img=document.querySelector('.engineering-story > img');return img?.naturalWidth>0&&img?.classList.contains('motion-visible');});
    await reveal.close();
    pass('Headings enter from both sides and a lazy workshop image reveals after loading');
    const animated=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
    await animated.goto(base+'/',{waitUntil:'domcontentloaded'});
    const positions=()=>animated.evaluate(()=>[...document.querySelectorAll('.brand-track,.reviews-track')].map(el=>({name:el.className,animation:getComputedStyle(el).animationName,direction:getComputedStyle(el).animationDirection,x:new DOMMatrix(getComputedStyle(el).transform).m41})));
    const before=await positions();await animated.waitForTimeout(750);const after=await positions();
    assert.equal(before.length,3);assert(after.every(item=>item.animation==='strip-left'));
    assert(after[0].x<before[0].x-5, 'First brand band must move right to left');
    assert(after[1].x>before[1].x+5, 'Second brand band must move left to right');
    assert(after[2].x<before[2].x-5, 'Reviews must move right to left');
    await animated.getByRole('button',{name:'Pause logos'}).click();assert((await animated.locator('.brand-track').evaluateAll(els=>els.map(el=>getComputedStyle(el).animationPlayState))).every(x=>x==='paused'));
    await animated.getByRole('button',{name:'Pause moving reviews'}).click();assert.equal(await animated.locator('.reviews-track').evaluate(el=>getComputedStyle(el).animationPlayState),'paused');
    await animated.close();
    pass('Bands run in opposite directions, reviews move left and both animations can be paused');
    const reduced=await ctx.newPage();await reduced.goto(base+'/',{waitUntil:'domcontentloaded'});
    const noMotion=await reduced.evaluate(()=>[...document.querySelectorAll('.brand-track,.reviews-track')].every(el=>getComputedStyle(el).animationName==='none'));
    assert(noMotion,'Reduced-motion setting must stop continuous animation');await reduced.close();await ctx.close();
    pass('Reduced-motion users receive non-moving, readable brand and review content');
    report.result='passed';console.log(`\n${report.checks.length} visual/content checks passed.`);
  } catch (error) { report.result='failed';report.error=String(error);console.error('VISUAL QA FAILED:',error);process.exitCode=1; }
  finally { fs.writeFileSync(path.join(root,'docs/visual-request-verification.json'),JSON.stringify(report,null,2)+'\n');if(browser)await browser.close(); }
})();
