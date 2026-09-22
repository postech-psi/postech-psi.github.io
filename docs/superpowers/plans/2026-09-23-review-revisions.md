# PSI Review Revisions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Projects into an immediate PSLV/Aircraft tab experience with a matching navigation dropdown, add a Hanaro-inspired PSI support/contact/map page, then apply every confirmed content, media, archive, About, footer-logo and asset-path revision from the design review.

**Architecture:** `docs/launch-site` remains the only editable source and the root remains a deterministic export. Projects becomes one canonical progressively enhanced document: both complete project panels exist in HTML, JavaScript selects one panel and synchronises the URL hash, and former detail routes redirect into that document. A new static `support.html` presents approved supporters, an email-draft enquiry, direct contact and a campus map with a text/link fallback. Shared navigation/footer rendering stays in `templates.mjs`; project markup stays focused in `program-pages.mjs`; browser state stays in `site.js`/`motion.js`; Playwright checks own every interactive contract.

**Tech Stack:** Node.js ES modules, generated static HTML, vanilla JavaScript/CSS, Playwright 1.62.1, GitHub Pages/Jekyll root deployment.

**Spec:** `docs/superpowers/specs/2026-09-23-review-revisions.md`

## Global Constraints

- Edit `docs/launch-site`, rebuild there, then export; never hand-edit root generated HTML/CSS/JS.
- Preserve English/Korean parity for every visible label and route.
- Preserve official neutral colours `#000000`, `#FFFFFF`, `#E9EDF0`, `#B8BDC6`, original logo colours and self-hosted Pretendard.
- Preserve the pinned TMS/results implementation, test datasets, telemetry semantics and source digests.
- Use British `programme` in editorial English copy; do not alter proper nouns or source/publication titles.
- Preserve no-JavaScript access, reduced-motion behavior, keyboard operation and 320/390/768/1440 px layouts.
- Do not publish private storage URLs, raw manuscripts, invented results or unverified member information.
- Do not alter supporter artwork; keep all four existing supporter links and Finance wording.
- The Support & Contact page uses the repository-listed president email (confirm the mailbox owner before deployment) and official POSTECH campus address; do not infer a PSI office room, donation account, tax status or contractual supporter benefit.
- The enquiry form opens a visitor-owned email draft. No PSI backend receives or stores form submissions.
- Do not manufacture the proposed composite launch/onboard video from the review recordings; retain the two-view control until an editable approved master is supplied.

## Review Focus

- A project deep link (`#project-aircraft`, `#avionics`, or `?test=…#test-results`) must activate the owning tab before focus/scroll or chart mounting.
- Desktop hover, keyboard focus, mobile touch, Escape and outside-click dismissal must all settle the project submenu without leaving `main` or `footer` inert.
- JavaScript-disabled Projects must expose both complete programs without duplicated `h1` elements or hidden content.
- Launch/onboard media with different intrinsic dimensions must preserve the full frame without layout shift or a false video button on photographs.
- Generated preview and root release must both own `/assets/index.html`; the exporter must not broaden its media allow-list.
- A blocked or unloaded third-party map must leave the POSTECH address and official directions link readable, and the contact form must never claim an email was sent.

---

## File Structure

- Modify `docs/launch-site/content.mjs`: canonical routes, project submenu data, bilingual Support & Contact route, president email, campus contact data and shared content records.
- Modify `docs/launch-site/program-pages.mjs`: complete PSLV/Aircraft panel boundaries, Research/Records strip removal and News award album data consumption.
- Modify `docs/launch-site/templates.mjs`: Projects page composition, redirects, shared navigation, About cleanup, organisation table and footer image logo.
- Modify `docs/launch-site/site.js`: navigation submenu state, project tab/hash/history controller and support enquiry `mailto:` draft (without a submission backend).
- Create `docs/launch-site/support-page.mjs`: shared supporter list and bilingual support/contact/map page.
- Modify `docs/launch-site/motion.js`: remove the superseded preview-only program switch and keep project-panel motion in one controller.
- Modify `docs/launch-site/site.css` and `docs/launch-site/program-pages.css`: dropdown, tab panels, stable media frame, organisation table and footer-logo layout.
- Modify `docs/launch-site/gallery-data.mjs` and asset manifests: add the existing award photograph as a News album item with a thumbnail derivative.
- Create `docs/launch-site/assets/award-thumb.webp`: reviewed gallery thumbnail derived from `award.webp` without changing the source.
- Create `docs/launch-site/assets/index.html`: deliberate no-index `/assets/` landing page.
- Modify `tools/export-launch-site.mjs`: export the asset landing page and new referenced thumbnail deterministically, and redirect legacy contact routes to `support.html#contact` while preserving the release manifest.
- Create `docs/launch-site/check-support-contact.cjs` and modify focused checks under `docs/launch-site/check-*.cjs` and `tools/check-release.mjs`: pin all new behavior.
- Regenerate `docs/launch-site/*.html`, `docs/launch-site/ko/*.html`, root public files and `release.json` only through the build/export commands.

Before running any Playwright check below, keep `python -m http.server 8767 --bind 127.0.0.1 --directory docs/launch-site` running in a separate terminal and set `$env:PSI_URL='http://127.0.0.1:8767'` in the test terminal. This also overrides the standalone navigation check's different default port.

### Task 1: Make Projects the single canonical tabbed project document

**Files:**
- Modify: `docs/launch-site/program-pages.mjs`
- Modify: `docs/launch-site/templates.mjs`
- Modify: `docs/launch-site/content.mjs`
- Modify: `docs/launch-site/site.js`
- Modify: `docs/launch-site/motion.js`
- Modify: `docs/launch-site/program-pages.css`
- Modify: `docs/launch-site/check-simple-navigation.cjs`
- Modify: `docs/launch-site/check-current-content.cjs`
- Modify: `docs/launch-site/check-engineering.cjs`

**Interfaces:**
- Produces: project panels marked `data-project-panel="pslv|aircraft"`, tabs marked `data-project-tab`, and fragment targets `#project-pslv` / `#project-aircraft`.
- Produces: `selectProject(id, {updateHistory, focus})` inside `site.js`; later navigation code activates it by changing the URL fragment.
- Consumes: existing `media()`, `hardware()`, `views.systems()`, `flightLedger()` and `engineeringPage()` renderers without duplicating their technical content.

- [ ] **Step 1: Replace the old preview assertion with a failing canonical-tab test**

Add assertions to `check-simple-navigation.cjs` for both locales:

```js
await page.goto(`${base}/${prefix}projects.html#project-aircraft`);
assert.equal(await page.locator('[data-project-tab]').count(), 2);
assert.equal(await page.locator('[data-project-tab="aircraft"]').getAttribute('aria-selected'), 'true');
assert.ok(await page.locator('[data-project-panel="aircraft"]').isVisible());
assert.equal(await page.locator('[data-project-panel="pslv"]').isVisible(), false);
assert.equal(await page.locator('[data-project-panel] a').filter({hasText:/Explore PSLV|Explore Aircraft|PSLV 살펴보기|항공기 살펴보기/}).count(), 0);
await page.locator('[data-project-tab="pslv"]').click();
assert.equal(new URL(page.url()).hash, '#project-pslv');
assert.ok(await page.locator('#avionics').count());
await page.goBack();
assert.equal(await page.locator('[data-project-tab="aircraft"]').getAttribute('aria-selected'), 'true');
```

Add a no-JavaScript assertion:

```js
await fallback.goto(`${base}/${prefix}projects.html`);
assert.equal(await fallback.locator('[data-project-panel]:visible').count(), 2);
assert.equal(await fallback.locator('main h1').count(), 1);
```

- [ ] **Step 2: Run the focused test and confirm the current hub behavior fails**

Run: `node docs/launch-site/build.mjs; node docs/launch-site/check-simple-navigation.cjs`

Expected: FAIL because the current page uses `data-program-choice`, hides a preview card only, and still requires an Explore link.

- [ ] **Step 3: Split project renderers into panel-safe content**

In `templates.mjs`, split the current PSLV renderer into a panel body without a second page `h1`:

```js
const pslvProject=()=>`<div class="project-panel-head">
  <p class="program-code">PSLV</p>
  <h2>POSTECH Science Launch Vehicle</h2>
  <p>${t('POSTECH Science Launch Vehicle brings structures, electronics, propulsion and recovery into one sounding-rocket programme.','POSTECH Science Launch Vehicle은 구조, 전자장치, 추진과 회수를 하나로 연결하는 사운딩 로켓 프로젝트입니다.')}</p>
</div>
<section aria-label="${t('Launch and onboard footage','발사와 탑재 영상')}">${media()}</section>
<section class="section" id="vehicle">${hardware()}</section>
${views.systems()}
<section class="ledger-section section" id="flights"><div class="wrap">${sectionHeading(t('Recorded flights','비행 기록'))}${flightLedger()}</div></section>`;
```

Expose the Aircraft body from `program-pages.mjs` as panel content with an `h2`, not a second page header. Render `projects.html` with one shared `h1`, a real tablist and both panel bodies:

```html
<div class="project-tabs" role="tablist" aria-label="Choose a project">
  <button id="project-tab-pslv" role="tab" data-project-tab="pslv" aria-controls="project-panel-pslv" aria-selected="true">PSLV</button>
  <button id="project-tab-aircraft" role="tab" data-project-tab="aircraft" aria-controls="project-panel-aircraft" aria-selected="false" tabindex="-1">Aircraft</button>
</div>
<section id="project-pslv" data-project-panel="pslv" role="tabpanel" aria-labelledby="project-tab-pslv">…</section>
<section id="project-aircraft" data-project-panel="aircraft" role="tabpanel" aria-labelledby="project-tab-aircraft">…</section>
```

Do not add `hidden` in generated HTML; JavaScript applies it after enhancement so no-JS readers receive both programs.

- [ ] **Step 4: Implement hash-aware project selection**

Replace the preview-only handler in `motion.js` with one controller in `site.js`:

```js
const projectTabs=[...document.querySelectorAll('[data-project-tab]')];
const projectPanels=[...document.querySelectorAll('[data-project-panel]')];
const projectForHash=()=>{
  const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));
  return target?.closest('[data-project-panel]')?.dataset.projectPanel ||
    (location.hash==='#project-aircraft'?'aircraft':'pslv');
};
const selectProject=(id,{updateHistory=false,focus=false}={})=>{
  projectTabs.forEach(tab=>{
    const selected=tab.dataset.projectTab===id;
    tab.setAttribute('aria-selected',String(selected));
    tab.tabIndex=selected?0:-1;
    if(selected&&focus)tab.focus();
  });
  projectPanels.forEach(panel=>{panel.hidden=panel.dataset.projectPanel!==id;});
  if(updateHistory)history.pushState(null,'',`#project-${id}`);
};
```

Bind click plus ArrowLeft/ArrowRight/Home/End, initialise from `projectForHash()`, and run the same reconciliation on `hashchange`, `popstate` and `pageshow`. When the fragment identifies `#avionics`, `#tms` or another descendant, select PSLV first and then let the existing disclosure/deep-link logic run.

- [ ] **Step 5: Convert old project pages to compatibility routes**

Move `pslv` and `aircraft` into the redirect map in `templates.mjs`:

```js
const redirects={
  pslv:'projects.html#project-pslv',
  aircraft:'projects.html#project-aircraft',
  avionics:'projects.html#avionics',
  tms:'projects.html#tms',
  gallery:'news.html#photos',
  join:'about.html#participation',
  learning:'about.html#participation'
};
```

For `pslv.html?test=<id>#test-results`, copy the query to `projects.html?test=<id>#test-results`; for any explicit original fragment, preserve that fragment instead of `#project-pslv`. Update `trialHref()` and all internal PSLV/Aircraft links to canonical `projects.html` fragments.

- [ ] **Step 6: Style the full project tabs without a hub card**

Replace `.program-choices`/`.program-pair` enhancement rules with `.project-tabs` and `.project-panel`. Keep the pill-like two-tab appearance from the review, make each button at least 44 px high, apply `scroll-margin-top` to nested anchors, and set `[data-project-panel][hidden]{display:none}`. Do not constrain panel content to preview-card dimensions.

- [ ] **Step 7: Run project, engineering and deep-link checks**

Run:

```powershell
node docs/launch-site/build.mjs
node docs/launch-site/check-simple-navigation.cjs
node docs/launch-site/check-current-content.cjs
node docs/launch-site/check-engineering.cjs
```

Expected: PASS with one canonical Projects document, working project hashes, intact Avionics/TMS charts and compatible legacy URLs.

- [ ] **Step 8: Commit the canonical Projects change**

```powershell
git add docs/launch-site docs/superpowers/specs/2026-09-23-review-revisions.md docs/superpowers/plans/2026-09-23-review-revisions.md
git commit -m "feat: make projects an immediate tabbed experience"
```

### Task 2: Add the Projects navigation dropdown

**Files:**
- Modify: `docs/launch-site/content.mjs`
- Modify: `docs/launch-site/templates.mjs`
- Modify: `docs/launch-site/site.js`
- Modify: `docs/launch-site/site.css`
- Modify: `docs/launch-site/check-simple-navigation.cjs`
- Modify: `docs/launch-site/check-accessibility.cjs`

**Interfaces:**
- Consumes: `projects.html#project-pslv` and `projects.html#project-aircraft` from Task 1.
- Produces: `[data-project-menu]`, `[data-project-menu-toggle]`, and `[data-project-submenu]` shared across all canonical pages.

- [ ] **Step 1: Write failing desktop, keyboard and mobile dropdown tests**

Add to `check-simple-navigation.cjs`:

```js
await page.goto(`${base}/${prefix}index.html`);
const projectMenu=page.locator('[data-project-menu]');
const projectToggle=page.locator('[data-project-menu-toggle]');
const submenu=page.locator('[data-project-submenu]');
assert.deepEqual(await submenu.locator('a').evaluateAll(as=>as.map(a=>a.getAttribute('href'))),[
  'projects.html#project-pslv','projects.html#project-aircraft'
]);
await projectToggle.focus();
await page.keyboard.press('Enter');
assert.ok(await submenu.isVisible());
await page.keyboard.press('Escape');
assert.equal(await submenu.isVisible(),false);
assert.equal(await projectToggle.evaluate(el=>el===document.activeElement),true);
await page.setViewportSize({width:390,height:844});
await page.locator('[data-menu-toggle]').click();
await projectToggle.click();
assert.ok(await submenu.isVisible());
await submenu.getByRole('link',{name:/Aircraft|항공기/}).click();
assert.match(page.url(),/projects\.html#project-aircraft$/);
```

- [ ] **Step 2: Run the focused test and verify the dropdown is absent**

Run: `node docs/launch-site/build.mjs; node docs/launch-site/check-simple-navigation.cjs`

Expected: FAIL because the existing navigation renders five flat anchors.

- [ ] **Step 3: Render a progressive-enhancement submenu**

At this stage `nav` has five main destinations; Task 6 adds Support & Contact as the sixth. Render only the Projects entry as:

```html
<div class="nav-projects" data-project-menu>
  <a href="projects.html" aria-current="page">Projects</a>
  <button type="button" data-project-menu-toggle aria-expanded="false" aria-controls="project-submenu">Open project menu</button>
  <div id="project-submenu" class="project-submenu" data-project-submenu hidden>
    <a href="projects.html#project-pslv">PSLV</a>
    <a href="projects.html#project-aircraft">Aircraft</a>
  </div>
</div>
```

Use unique submenu IDs if rendering more than once in a document. Keep ordinary anchors so direct navigation still works without JavaScript; a `<noscript>` Projects link remains sufficient because both panels are present there.
In `check-simple-navigation.cjs` and `check-structure.cjs`, count/compare only direct main-navigation destinations (`.site-nav > a, .nav-projects > a`), so the two submenu anchors do not inflate the count or change the main-route ordering assertion.

- [ ] **Step 4: Implement deterministic submenu state**

In `site.js`, implement `setProjectMenu(open,{restoreFocus=false}={})`, update `aria-expanded` and `hidden`, and close on Escape, outside pointer click, submenu link activation, primary mobile-menu close, media-query change and `pageshow`. Desktop `pointerenter`/`pointerleave` may open/close, while `focusin`/`focusout` keeps the submenu open for keyboard traversal.

- [ ] **Step 5: Style desktop and mobile submenu states**

On desktop, position the submenu below Projects with an opaque surface, border and visible focus outlines. On mobile, keep it in normal document flow beneath Projects so it cannot overflow the menu viewport. Animate opacity/translate only through `window.psiMotion`; do not hide links solely with transforms.

- [ ] **Step 6: Verify navigation accessibility and commit**

Run:

```powershell
node docs/launch-site/build.mjs
node docs/launch-site/check-simple-navigation.cjs
node docs/launch-site/check-accessibility.cjs
```

Expected: PASS for both languages, pointer-independent keyboard use, mobile touch and focus restoration.

```powershell
git add docs/launch-site
git commit -m "feat: add direct project navigation menu"
```

### Task 3: Stabilise and un-crop launch media

**Files:**
- Modify: `docs/launch-site/site.css`
- Modify: `docs/launch-site/site.js`
- Modify: `docs/launch-site/check-homepage.cjs`
- Modify: `docs/launch-site/check-media-visual.cjs`
- Modify: `docs/launch-site/check-motion-gallery.cjs`

**Interfaces:**
- Preserves: `[data-media-stage]`, `[data-flight-video]`, pad/onboard tabs, manual playback and reduced-motion contracts.
- Produces: stable `.media-screen` aspect-ratio geometry for both sources.

- [ ] **Step 1: Add failing frame-completeness and layout-shift checks**

In `check-homepage.cjs`, record the bottom of `.media-screen` and the top of `.media-bar` before and after changing viewpoints, and assert a maximum one-pixel difference. Assert both views compute `object-fit: contain` and that the video rectangle stays inside the screen rectangle.

```js
const geometry=async()=>page.locator('[data-media-stage]').evaluate(stage=>{
  const screen=stage.querySelector('.media-screen').getBoundingClientRect();
  const bar=stage.querySelector('.media-bar').getBoundingClientRect();
  return {screenBottom:screen.bottom,barTop:bar.top,fit:getComputedStyle(stage.querySelector('video')).objectFit};
});
```

- [ ] **Step 2: Run the homepage test and confirm pad footage currently uses `cover`**

Run: `node docs/launch-site/check-homepage.cjs`

Expected: FAIL because the desktop hero uses `object-fit: cover` and the mobile hero forces a square crop.

- [ ] **Step 3: Reserve the film frame and show the complete video**

Use a 16:9 `.media-screen` frame for pad and onboard views, set video width/height to 100%, and use `object-fit:contain; background:#000`. Remove the mobile `height:100vw; aspect-ratio:1` crop. Keep the identity overlay outside essential image content and preserve the current play/pause controls.

- [ ] **Step 4: Keep runtime view changes geometry-neutral**

In the existing media switcher, change `src`, `poster`, labels and state without rewriting frame dimensions. Cancel stale play promises as today, and retain focus/native controls behavior.

- [ ] **Step 5: Run media behavior and visual checks, then commit**

Run:

```powershell
node docs/launch-site/build.mjs
node docs/launch-site/check-homepage.cjs
node docs/launch-site/check-motion-gallery.cjs hero
node docs/launch-site/check-media-visual.cjs
```

Expected: PASS with full frames, no section jump and no autoplay/accessibility regression.

```powershell
git add docs/launch-site
git commit -m "fix: preserve complete stable flight media frames"
```

### Task 4: Simplify Research, Records and News while preserving the archive

**Files:**
- Modify: `docs/launch-site/program-pages.mjs`
- Modify: `docs/launch-site/archive-view.mjs`
- Modify: `docs/launch-site/gallery-data.mjs`
- Modify: `docs/launch-site/assets/gallery-media-manifest.json`
- Create: `docs/launch-site/assets/award-thumb.webp`
- Modify: `docs/launch-site/program-pages.css`
- Modify: `docs/launch-site/site.css`
- Modify: `docs/launch-site/motion.js`
- Modify: `docs/launch-site/check-current-content.cjs`
- Modify: `docs/launch-site/check-motion-gallery.cjs`
- Modify: `docs/launch-site/check-structure.cjs`

**Interfaces:**
- Produces: one `award-dec-2025` gallery event using `award.webp` / `award-thumb.webp`.
- Preserves: fifteen historical research records and six award records in Records.
- Removes: `.study-navigation` from Research/Records and `.album-navigation` from News.
- Produces: one explicit `[data-photo-motion]` contract used by all intended editorial photographs and ignored by diagrams, logos and screenshots.

- [ ] **Step 1: Add failing content-ownership tests**

Add assertions for both locales:

```js
await page.goto(`${base}/${prefix}research.html`);
assert.equal(await page.locator('.study-navigation').count(),0);
assert.equal(await page.locator('[data-current-research]').count(),5);
await page.goto(`${base}/${prefix}records.html`);
assert.equal(await page.locator('.study-navigation').count(),0);
assert.equal(await page.locator('[data-research-record]').count(),15);
assert.equal(await page.locator('[data-filter-type]').count(),1);
await page.goto(`${base}/${prefix}news.html`);
assert.equal(await page.locator('.album-navigation').count(),0);
assert.equal(await page.locator('#award-dec-2025 [data-gallery-open]').count(),1);
assert.equal(await page.locator('[data-gallery-open] .media-play').count(),0);
assert.equal(await page.locator('main [data-photo-motion]').count(),await page.locator('main [data-photo-motion].motion-surface').count());
```

- [ ] **Step 2: Run the focused checks and observe the three navigation strips and missing award album**

Run: `node docs/launch-site/build.mjs; node docs/launch-site/check-current-content.cjs; node docs/launch-site/check-motion-gallery.cjs gallery`

Expected: FAIL on the strip and award assertions while the archive count remains 15.

- [ ] **Step 3: Remove redundant page jump strips**

Delete only the Research current-study nav, Records section jump nav and News album jump nav render fragments. Do not remove headings, stable section IDs, record filters or source links. Remove their unused CSS.

Collapse the removed navigation margins and let each News event size itself from its header and photographs. For a one-photo event, use a content-width image column without a forced empty companion row or minimum height. Add a geometry assertion that the first photo begins within 160 px of its event header bottom at 1440 px and within 96 px at 390 px.

- [ ] **Step 4: Add the award photo to the News gallery**

Create `award-thumb.webp` from the existing approved `award.webp` using the repository’s established WebP thumbnail process, add exact dimensions to `gallery-media-manifest.json`, and add:

```js
{
  id:'award-dec-2025',
  date:'2025-12-02',
  dateLabel:text('2 December 2025','2025년 12월 2일'),
  label:text('Undergraduate POSTECHIAN Award','학부 POSTECHIAN상 수상'),
  description:text('A commemorative group photograph from the university recognition recorded in PSI’s public history.','PSI 공개 연혁에 기록된 대학 수상을 기념한 단체 사진입니다.'),
  photos:[photo('award.webp','PSI members in a commemorative group photograph after the POSTECH award.','POSTECH 수상을 기념해 함께 촬영한 PSI 구성원들.')]
}
```

Keep the dated award facts in Records; News owns the photograph, not a duplicate evidence record.

- [ ] **Step 5: Make photograph hover motion explicit and consistent**

Add `data-photo-motion` when rendering the homepage reel images, linked project photographs, News thumbnails and other intentional editorial photographs. Change `motion.js` to select `[data-photo-motion]` instead of maintaining the partial selector list `.reel-image,.program-picture,.story-list>article>a,[data-gallery-open],.study-visual,.living-photo`. Do not mark conceptual SVGs, CAD boards, video posters, supporter artwork, PSI logos or screenshots. Keep the existing fine-pointer guard and reduced-motion reset so touch and reduced-motion users see a still image.

Add a Playwright pointer test that records `--tilt-x`/`--tilt-y` after moving over each marked photograph and asserts those properties remain absent under `reducedMotion:'reduce'`.

- [ ] **Step 6: Verify gallery interaction, hover consistency and archive filtering**

Run:

```powershell
node docs/launch-site/build.mjs
node docs/launch-site/check-current-content.cjs
node docs/launch-site/check-structure.cjs
node docs/launch-site/check-motion-gallery.cjs gallery
node docs/launch-site/check-media-visual.cjs
```

Expected: PASS; five current studies, fifteen historic records, six award records and the award photo lightbox all remain reachable.

- [ ] **Step 7: Commit the content split**

```powershell
git add docs/launch-site
git commit -m "refactor: clarify research records and photo news"
```

### Task 5: Apply the About-page deletions and organisation table

**Files:**
- Modify: `docs/launch-site/content.mjs`
- Modify: `docs/launch-site/templates.mjs`
- Modify: `docs/launch-site/site.css`
- Modify: `docs/launch-site/check-supporters.cjs`
- Modify: `docs/launch-site/check-structure.cjs`
- Modify: `docs/launch-site/check-copy.cjs`

**Interfaces:**
- Produces: `sources.presidentEmail='uikangee@postech.ac.kr'` and one bilingual `.organisation-table`.
- Removes: `Joining and participating` (`.join-steps`), `Membership questions` (`.faq-section`), and `Education and notebooks` (`#learning`) from canonical About.
- Preserves: `#participation`, concise recruitment, official channels, leadership, timeline and supporter assets.

- [ ] **Step 1: Write failing About structure tests**

Add:

```js
await page.goto(`${base}/${prefix}about.html`);
assert.equal(await page.locator('.join-steps,.faq-section,#learning').count(),0);
assert.equal(await page.locator('.organisation-table tbody tr').count(),6);
assert.equal(await page.locator('a[href="mailto:uikangee@postech.ac.kr"]').count(),1);
assert.equal(await page.locator('main > .support-section').evaluate(el=>el===document.querySelector('main').lastElementChild),true);
```

- [ ] **Step 2: Run the tests and verify the old cards/steps/FAQ/notebooks remain**

Run: `node docs/launch-site/build.mjs; node docs/launch-site/check-structure.cjs; node docs/launch-site/check-supporters.cjs`

Expected: FAIL on the removed-section, table and email assertions.

- [ ] **Step 3: Replace organisation cards with a semantic table**

Render a `<table class="organisation-table">` with headers Role/What it supports (역할/지원하는 활동) and six rows sourced from one bilingual array. Use `<th scope="row">` for each role. Retain the existing Research, Competition, Equipment, Finance, Communication and Education wording, including budget/expenses.

- [ ] **Step 4: Reduce participation to recruitment and official contact**

Remove the three-step join section, five-question FAQ and Education/notebooks renderer call. Keep the `#participation` heading and recruitment notice. Add:

```js
presidentEmail:'uikangee@postech.ac.kr'
```

and render `mailto:${sources.presidentEmail}` with labels `President contact` / `회장 이메일`. Keep Instagram, GitHub and public introduction links.

- [ ] **Step 5: Make supporters the final About block**

Compose About as `aboutCore() + participation() + supporters()`. Remove the earlier supporter insertion from `aboutCore()` so the four-logo band occurs once, immediately before the global footer.

- [ ] **Step 6: Verify About in both themes and commit**

Run:

```powershell
node docs/launch-site/build.mjs
node docs/launch-site/check-structure.cjs
node docs/launch-site/check-supporters.cjs
node docs/launch-site/check-copy.cjs
```

Expected: PASS with six table rows, one president email, no deleted sections and unchanged supporter art hashes.

```powershell
git add docs/launch-site
git commit -m "refactor: simplify about and clarify organisation"
```

### Task 6: Add a bilingual Support & Contact page with a campus map

**Files:**
- Create: `docs/launch-site/support-page.mjs`
- Modify: `docs/launch-site/content.mjs`
- Modify: `docs/launch-site/templates.mjs`
- Modify: `docs/launch-site/site.js`
- Modify: `docs/launch-site/site.css`
- Modify: `docs/launch-site/build.mjs`
- Modify: `docs/launch-site/check.cjs`
- Modify: `docs/launch-site/check-simple-navigation.cjs`
- Modify: `docs/launch-site/check-structure.cjs`
- Modify: `docs/launch-site/check-supporters.cjs`
- Create: `docs/launch-site/check-support-contact.cjs`
- Modify: `tools/export-launch-site.mjs`
- Modify: `tools/check-release.mjs`

**Interfaces:**
- Consumes: `sources.presidentEmail='uikangee@postech.ac.kr'` from Task 5 and the four existing supporter logo files/URLs.
- Produces: `supportView(lang,asset,sources)` and `supportersView(lang,asset)` from `support-page.mjs`; `support.html`, `ko/support.html`, `#contact`, `[data-support-form]`, `[data-support-draft]` and a titled `[data-campus-map]` iframe.
- Updates: `routes` to include `support`, `nav` to include a sixth entry `Support & Contact` / `후원·문의`, and legacy `contact.html` to `support.html#contact`.

- [ ] **Step 1: Write failing route, contact and map tests**

In `check-support-contact.cjs`, test both locales with a local Playwright browser:

```js
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.PSI_URL||'http://127.0.0.1:8767';
;(async()=>{
const browser=await chromium.launch({channel:process.env.PSI_BROWSER_CHANNEL||undefined});
try {
  for(const prefix of ['', 'ko/']) {
    const page=await browser.newPage();
    await page.route('**/openstreetmap.org/**',route=>route.abort());
    await page.goto(`${base}/${prefix}support.html`);
    assert.equal(await page.locator('.site-nav > a, .nav-projects > a').count(),6);
    assert.equal(await page.locator('.supporter-list a').count(),4);
    assert.equal(await page.locator('a[href="mailto:uikangee@postech.ac.kr"]').count(),1);
    assert.ok((await page.locator('#contact').innerText()).includes(prefix?'청암로 77':'77 Cheongam-ro'));
    assert.equal(await page.locator('[data-campus-map][loading="lazy"][title]').count(),1);
    assert.equal(await page.locator('a[href="https://www.postech.ac.kr/eng/about/campus_map.do"]').count(),1);
    await page.goto(`${base}/${prefix}contact.html`);
    await page.waitForURL(`${base}/${prefix}support.html#contact`);
    await page.close();
  }
} finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
```

Add the form and no-JavaScript assertions in Step 5. Update `check.cjs` so this focused check runs in the full suite, and use the `routes` export rather than a second manually maintained route array.

- [ ] **Step 2: Run the focused test and confirm the page is absent**

Run: `node docs/launch-site/check-support-contact.cjs`

Expected: FAIL because `support.html` and its navigation destination have not been generated.

- [ ] **Step 3: Add the route, shared supporters and truthful page content**

Add `support` to `routes`, `nav` and `pageTitles` in `content.mjs`. Extract the four existing supporter entries from the `supporters()` closure in `templates.mjs` into `supportersView(lang,asset)` so About and Support render the same logos, names and destination URLs. Keep the About supporter band last as required by Task 5. On the Support page, show the logos near the introduction before the enquiry steps, as in the reference site's information sequence.

In `supportView(lang,asset,sources)`, render one `h1`, the four approved supporters, a concise invitation to discuss financial, material/equipment or technical support, and an enquiry sequence: write to PSI, discuss scope and terms, then agree on the arrangement. Avoid account numbers, tax claims and promised sponsor placements. Add a direct `mailto:${sources.presidentEmail}` link and a homepage link to `support.html#contact` near the community section.

- [ ] **Step 4: Add the accessible enquiry form and campus map**

Render labelled fields for name, affiliation (optional), reply email, enquiry type (`support` or `general`) and message. Set `required` on name, reply email and message, `type="email"` on the reply address and `maxlength="1600"` on the message. The visible submit label is `Prepare email draft` / `이메일 초안 만들기`; the adjacent explanatory text says the visitor's email app will open and PSI has not received the message yet. Keep a direct email link visible without JavaScript.

Use the POSTECH campus address from the official [POSTECH directions page](https://postech.ac.kr/eng/about/direction.do). Label it `POSTECH campus` / `포스텍 캠퍼스`; do not claim this pin identifies PSI's room. The approximate campus marker follows the university coordinate recorded in [Wikidata Q40018](https://www.wikidata.org/wiki/Q40018). Render:

```html
<iframe data-campus-map title="Map of the POSTECH campus" loading="lazy"
  src="https://www.openstreetmap.org/export/embed.html?bbox=129.314%2C36.005%2C129.335%2C36.019&amp;layer=mapnik&amp;marker=36.01083%2C129.32278"></iframe>
<a href="https://www.postech.ac.kr/eng/about/campus_map.do">Open official POSTECH campus map</a>
```

Use a Korean iframe title/link label in the Korean view. The OpenStreetMap pin is an approximate campus marker, not a room marker; the official campus link and printed street address are the reliable directions. Give the map a fixed aspect ratio so load failure does not shift following content. Keep the address and directions link outside the iframe.

- [ ] **Step 5: Make the form produce a real visitor-owned email draft**

In `site.js`, intercept a valid `[data-support-form]` submission, build the subject `PSI support enquiry` / `PSI 후원 문의` or `PSI general enquiry` / `PSI 일반 문의`, percent-encode the subject/body using `encodeURIComponent`, set the resulting `mailto:` URL on `[data-support-draft]`, reveal and focus that link. The link label is `Open email app to send` / `이메일 앱에서 보내기`. With JavaScript disabled, the form's `action="mailto:uikangee@postech.ac.kr" method="post" enctype="text/plain"` provides a browser-level fallback; the always-visible direct email link remains usable if no mail app is configured.

Extend `check-support-contact.cjs`:

```js
await page.getByLabel(prefix?'이름':'Name').fill('Test Visitor');
await page.getByLabel(prefix?'답장 이메일':'Reply email').fill('visitor@example.com');
await page.getByLabel(prefix?'문의 내용':'Message').fill('Materials for PSI');
await page.locator('[data-support-form] button[type="submit"]').click();
const draft=page.locator('[data-support-draft]');
assert.ok(await draft.isVisible());
const href=await draft.getAttribute('href');
assert.ok(href.startsWith('mailto:uikangee@postech.ac.kr?'));
assert.ok(decodeURIComponent(href).includes('visitor@example.com'));
assert.ok(decodeURIComponent(href).includes('Materials for PSI'));
assert.equal(await page.locator('[data-support-success]').count(),0);
```

Also load the page in a `javaScriptEnabled:false` context and assert the direct email, printed address and official campus-map link remain visible. Block the OpenStreetMap iframe request in one normal context and assert those same elements remain readable.

- [ ] **Step 6: Update navigation, compatibility redirects and route-count checks**

Render the sixth main-nav and footer link from the updated `nav` array. Change the root exporter's legacy `contact.html` target to `support.html#contact`; add `ko/contact.html` explicitly to the exporter with Korean `lang`, `../assets/psi-emblem.png` and relative `support.html#contact` target. Add both English and Korean contact compatibility HTML to the preview build so local and released behavior agree. Update hard-coded five-link and thirteen-route assertions in `check-simple-navigation.cjs`, `check-structure.cjs`, `check.cjs` and `tools/check-release.mjs` to six direct links and fourteen routes. Verify the new build contains 28 bilingual route pages plus both contact compatibility files. Keep `join.html` targeted at About participation. Before root export, verify that `uikangee@postech.ac.kr` still reaches the intended PSI owner; if not, obtain an approved replacement and update the source/tests first.

- [ ] **Step 7: Verify responsive contact and map states**

Run:

```powershell
node docs/launch-site/build.mjs
node docs/launch-site/check-support-contact.cjs
node docs/launch-site/check-supporters.cjs
node docs/launch-site/check-simple-navigation.cjs
node tools/check-release.mjs
```

Expected: PASS for both languages, six navigation destinations, four approved logos on Support and About, a draft containing the entered details, readable address if the iframe is blocked, and both legacy contact URLs.

At 320, 390, 768 and 1440 px, inspect the form, map and address for clipping or horizontal overflow. Run `git diff --check` before committing.

- [ ] **Step 8: Commit the support and contact page**

```powershell
git add docs/launch-site tools/export-launch-site.mjs tools/check-release.mjs
git commit -m "feat: add PSI support contact and campus map"
```

### Task 7: Put the actual PSI logo at the bottom of every page

**Files:**
- Modify: `docs/launch-site/templates.mjs`
- Modify: `docs/launch-site/site.css`
- Modify: `docs/launch-site/check-brand.cjs`
- Modify: `docs/launch-site/check-supporters.cjs`

**Interfaces:**
- Produces: `.footer-logo` containing the existing `psi-logo.png` on all seven canonical content pages in both languages.

- [ ] **Step 1: Add a failing footer-logo test**

For each canonical route and locale, assert:

```js
const logo=page.locator('footer .footer-logo img');
assert.equal(await logo.count(),1);
assert.ok((await logo.getAttribute('src')).endsWith('assets/psi-logo.png'));
assert.equal(await logo.getAttribute('alt'),'PSI');
const ratio=await logo.evaluate(img=>img.getBoundingClientRect().width/img.getBoundingClientRect().height);
assert.ok(Math.abs(ratio-1280/317)<.05);
```

- [ ] **Step 2: Run the brand check and observe the text-only footer wordmark**

Run: `node docs/launch-site/build.mjs; node docs/launch-site/check-brand.cjs`

Expected: FAIL because the footer currently renders plain `PSI` text.

- [ ] **Step 3: Render the image wordmark in the footer’s bottom brand band**

Replace the text-only `.footer-wordmark` with an image link created by the existing `image('psi-logo.png', 'PSI')` helper. Place it in a dedicated final `.footer-brand-bottom` after navigation/contact and before or alongside the copyright line so it is visually at the bottom on every page.

- [ ] **Step 4: Style and verify the footer logo**

Limit width with `clamp(150px,22vw,320px)`, preserve `height:auto`, use no filter/recolour, and keep sufficient spacing from copyright and Back to top. Test light/dark at 320, 390, 768 and 1440 px.

Run: `node docs/launch-site/check-brand.cjs; node docs/launch-site/check-supporters.cjs`

Expected: PASS with one authentic footer logo per page and unchanged header/supporter logos.

- [ ] **Step 5: Commit the global brand footer**

```powershell
git add docs/launch-site
git commit -m "feat: add the PSI logo to every page footer"
```

### Task 8: Own `/assets/` with a deliberate landing page

**Files:**
- Create: `docs/launch-site/assets/index.html`
- Modify: `tools/export-launch-site.mjs`
- Modify: `tools/check-release.mjs`
- Modify: `docs/launch-site/check-assets.mjs`

**Interfaces:**
- Produces: `assets/index.html` in preview and release output.
- Preserves: media discovery allow-list and deterministic `release.json` digests.

- [ ] **Step 1: Write a failing release assertion**

Add to `tools/check-release.mjs`:

```js
assert.ok(names.includes('assets/index.html'));
const assetsIndex=await readFile(join(destination,'assets/index.html'),'utf8');
assert.match(assetsIndex,/name="robots" content="noindex,nofollow"/);
assert.match(assetsIndex,/href="\.\.\/index\.html"/);
assert.doesNotMatch(assetsIndex,/\.mp4|\.webp|directory|listing/i);
```

- [ ] **Step 2: Run the release check and confirm `/assets/` is unowned**

Run: `node tools/check-release.mjs`

Expected: FAIL because no `assets/index.html` is exported.

- [ ] **Step 3: Create and explicitly export the landing page**

Create a minimal static document with `noindex,nofollow`, PSI favicon, title `PSI`, a short “This is a site resource path” / “사이트 리소스 경로입니다” message and `../index.html` home link. Add exactly this file to `outputFiles` in `export-launch-site.mjs`:

```js
outputFiles.set('assets/index.html',await readFile(join(source,'assets','index.html')));
```

Do not add HTML to the general asset-extension allow-list.

- [ ] **Step 4: Verify preview and deterministic export, then commit**

Run:

```powershell
node docs/launch-site/check-assets.mjs
node tools/check-release.mjs
```

Expected: PASS, including repeated deterministic export and unowned-file protection.

```powershell
git add docs/launch-site/assets/index.html docs/launch-site/check-assets.mjs tools/export-launch-site.mjs tools/check-release.mjs
git commit -m "fix: own the public assets path"
```

### Task 9: Audit English consistency and remove obsolete code

**Files:**
- Modify: `docs/launch-site/content.mjs`
- Modify: `docs/launch-site/current-research.mjs`
- Modify: `docs/launch-site/program-pages.mjs`
- Modify: `docs/launch-site/templates.mjs`
- Modify: `docs/launch-site/site.js`
- Modify: `docs/launch-site/motion.js`
- Modify: `docs/launch-site/site.css`
- Modify: `docs/launch-site/program-pages.css`
- Modify: `docs/launch-site/check-copy.cjs`
- Modify: `docs/launch-site/README.md`
- Modify: `README.md`

**Interfaces:**
- Removes: old preview-switch selectors, deleted About selectors and obsolete page-strip selectors.
- Produces: British editorial spelling checks and current architecture documentation.

- [ ] **Step 1: Add copy assertions for the chosen English style**

Extend `check-copy.cjs` to reject editorial `rocket program` / `PSLV program` while allowing code identifiers and proper/source titles. Assert visible canonical copy contains `programme` and no deleted About headings.

- [ ] **Step 2: Run copy and source searches before cleanup**

Run:

```powershell
node docs/launch-site/check-copy.cjs
rg -n "data-program-choice|program-pair|join-steps|faq-section|study-navigation|album-navigation" docs/launch-site -g '*.mjs' -g '*.js' -g '*.css'
```

Expected: the search identifies selectors/renderers made obsolete by Tasks 1, 4 and 5.

- [ ] **Step 3: Remove only unreachable handlers/styles and normalise editable copy**

Delete obsolete program-preview enhancement code and unused styles. Replace inconsistent editorial American `program` with `programme`; leave URLs, identifiers, POSTECH/PSLV proper names and original publication titles unchanged.

- [ ] **Step 4: Update maintainer documentation**

Document `projects.html` as the canonical project owner, `pslv.html`/`aircraft.html` as compatibility redirects, the Projects submenu, News award gallery ownership, simplified About content, the new bilingual `support.html` with email-draft contact and POSTECH campus-map fallback, footer logo and `/assets/` landing page. State that `contact.html` and `ko/contact.html` redirect to `support.html#contact`, and update route counts while retaining all generated route files required for old links.

- [ ] **Step 5: Run copy and dead-selector checks, then commit**

Run:

```powershell
node docs/launch-site/build.mjs
node docs/launch-site/check-copy.cjs
rg -n "data-program-choice|program-pair|join-steps|faq-section|study-navigation|album-navigation" docs/launch-site -g '*.mjs' -g '*.js' -g '*.css'
```

Expected: copy check passes and the search returns no obsolete production selectors.

```powershell
git add README.md docs/launch-site
git commit -m "docs: align copy and architecture with review decisions"
```

### Task 10: Run full regression, visual review and deterministic release export

**Files:**
- Regenerate: `docs/launch-site/*.html`
- Regenerate: `docs/launch-site/ko/*.html`
- Regenerate: root canonical and compatibility HTML files
- Regenerate: root `site.css`, `program-pages.css`, `site.js`, `motion.js`
- Regenerate: root referenced assets and `release.json`
- Modify if a real regression is found: the owning source/test file from Tasks 1–9

**Interfaces:**
- Consumes: every preceding task.
- Produces: verified source build and root deployment artifact with matching revision.

- [ ] **Step 1: Build editable source pages**

Run: `node docs/launch-site/build.mjs`

Expected: `Built 28 PSI pages in docs/launch-site.` plus `contact.html` and `ko/contact.html`; every generated route file matches `render()`.

- [ ] **Step 2: Start the local preview server**

Run in a persistent terminal:

```powershell
python -m http.server 8767 --bind 127.0.0.1 --directory docs/launch-site
```

Expected: preview is available at `http://127.0.0.1:8767/` and `/ko/index.html`.

- [ ] **Step 3: Run the complete browser and data suite**

Run:

```powershell
node docs/launch-site/check.cjs
npm run test:results
node docs/launch-site/check-structure.cjs
node docs/launch-site/check-media-visual.cjs
node docs/launch-site/check-assets.mjs
```

Expected: all checks pass with no browser exceptions, broken images, overflow or telemetry/result parity changes.

- [ ] **Step 4: Inspect required visual states**

At 320, 390, 768 and 1440 px in both languages and themes, inspect screenshots for:

- Projects default PSLV and selected Aircraft panels.
- Projects dropdown open on desktop keyboard focus and mobile touch.
- Homepage pad and onboard full-frame states with no vertical jump.
- News award lightbox and ordinary photo thumbnails without play icons.
- About organisation table, final supporter band and president contact.
- Support & Contact page with four approved supporters, enquiry form, direct email, official campus address and map fallback.
- Footer PSI image logo at the physical bottom of short and long pages.
- `/assets/` landing page.

Any failure is fixed in the source owner named in Tasks 1–9, followed by the same focused test and full suite.

- [ ] **Step 5: Export to staging and verify the release manifest**

Run:

```powershell
$psiStage = Join-Path ([System.IO.Path]::GetTempPath()) 'psi-review-release'
if (Test-Path -LiteralPath $psiStage) { Move-Item -LiteralPath $psiStage -Destination ($psiStage + '-' + [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()) }
node tools/export-launch-site.mjs $psiStage
node tools/check-release.mjs
```

Expected: deterministic revision output; staging includes canonical pages, compatibility redirects, `assets/index.html`, footer/logo assets and no review/internal files.

- [ ] **Step 6: Export the verified release to the repository root**

Run: `node tools/export-launch-site.mjs`

Expected: root public files and `release.json` match the verified source build; unrelated root files remain untouched.

- [ ] **Step 7: Re-run release integrity and inspect the diff**

Run:

```powershell
node tools/check-release.mjs
git status --short
git diff --check
git diff --stat
```

Expected: release and whitespace checks pass; the diff contains only planned source, generated public files, the award thumbnail, asset landing page, docs and manifest updates.

- [ ] **Step 8: Commit the verified generated release**

```powershell
git add docs/launch-site *.html ko site.css program-pages.css site.js motion.js assets release.json README.md
git commit -m "release: apply PSI design review revisions"
```

## Self-Review Record

- Spec coverage: Projects immediate tabs, dropdown, old URLs, media crop/jump, Research/Records/News split, award photo, About deletions, organisation table, president contact, a Support & Contact page with an email-draft form and campus map, supporter placement, footer logo, asset path and copy audit each map to a numbered task.
- Deliberate boundary: composite-video editing is documented as unavailable from the supplied recordings; current approved pad/onboard controls are retained and tested.
- Placeholder scan: every implementation and test step names the exact file, behavior, command and expected result.
- Type/interface consistency: project IDs are `pslv` and `aircraft`; canonical fragments are `project-pslv` and `project-aircraft`; nested PSLV fragment ownership is resolved by the enclosing `data-project-panel`.
- Review Focus coverage: Tasks 1–3, 6 and 8 include direct tests for deep links, submenu state, no-JS panels, stable media geometry, map failure, truthful email-draft behavior and the asset landing page.
