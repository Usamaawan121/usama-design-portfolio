from playwright.sync_api import sync_playwright
from pathlib import Path
import re
P=Path(__file__).resolve().parent.parent
H=(P/'site/index.html').read_text()
CSS=(P/'site/styles.css').read_text()
JS=(P/'public/site.js').read_text()
DATA=(P/'public/projects-data.js').read_text()
WEBGL=(P/'public/webgl-orbit.js').read_text()
CSS=re.sub(r'@import url\(.+?\);','',CSS,count=1)
CSS=re.sub(r'url\(\s*[\'\"]?https://images\.unsplash\.com[^)]*\)','none',CSS)
EMPTY='data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22800%22%20height=%22600%22%3E%3Crect%20width=%22800%22%20height=%22600%22%20fill=%22%23212d24%22/%3E%3C/svg%3E'
H=re.sub(r'(?<=src=")https://images\.unsplash\.com[^\"]*',EMPTY,H)
H=H.replace('<link rel="stylesheet" href="/styles.css">','<style>'+CSS+'</style>')
H=H.replace('<script src="/projects-data.js" defer></script>','<script>'+DATA+'</script>')
H=H.replace('<script src="/site.js" defer></script>','<script>'+JS+'</script>')
H=H.replace('<script src="/webgl-orbit.js" defer></script>','<script>'+WEBGL+'</script>')
with sync_playwright() as pw:
 b=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w,h,label in [(1440,900,'desktop'),(768,1024,'tablet'),(390,844,'mobile')]:
  page=b.new_page(viewport={'width':w,'height':h},device_scale_factor=1)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(H,wait_until='domcontentloaded',timeout=12000)
  page.wait_for_timeout(280)
  assert page.locator('.featured-grid .project-card').count()==6
  assert page.locator('#all-projects .project-card').count()==20
  assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1'),f'overflow {w}'
  assert page.locator('#zoom-overlay').is_hidden()
  assert page.evaluate("getComputedStyle(document.body).backgroundColor")=='rgb(8, 11, 10)'
  # Filtration works on the actual DOM once work view is shown.
  page.evaluate("document.querySelector('#view-home').hidden=true;document.querySelector('#view-work').hidden=false")
  page.locator('[data-filter="UI/UX"]').click()
  assert page.locator('#filter-count').inner_text()=='SHOWING 5 PROJECTS'
  assert page.locator('#all-projects .project-card:not(.is-hidden)').count()==5
  page.locator('[data-filter="All"]').click()
  assert page.locator('#filter-count').inner_text()=='SHOWING 20 PROJECTS'
  # Zoom logic is exercised by injecting a test detail image into case-study region.
  page.evaluate("document.querySelector('#view-work').hidden=true;document.querySelector('#view-detail').hidden=false;document.querySelector('#detail-content').innerHTML='<div class=detail-cover><img alt=Test src=\"data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27800%27%20height=%27600%27%3E%3C/svg%3E\"></div>'")
  page.locator('.detail-cover img').click()
  assert page.locator('#zoom-overlay').is_visible()
  page.locator('#zoom-in').click()
  assert page.locator('#zoom-reset').inner_text()=='125%'
  page.keyboard.press('Escape')
  assert page.locator('#zoom-overlay').is_hidden()
  assert not errors,errors
  print('PASS',label,w,'20 projects, filters, zoom, no overflow, no JS errors')
  page.close()
 b.close()
