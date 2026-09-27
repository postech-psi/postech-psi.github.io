# PSI information design implementation plan

> For agentic workers: use superpowers:executing-plans for inline execution. Steps use checkboxes for tracking.

**Goal:** Make PSI's purpose, engineering navigation and support path immediately understandable.

**Architecture:** Retain the bilingual static generator. Extract the shared chrome; compose one About/Support destination; enhance native subsystem content with stable selection and URL state.

**Tech Stack:** Node.js ESM, semantic HTML, CSS, vanilla JavaScript, existing Playwright checks.

**Spec:** `docs/superpowers/specs/2026-09-26-psi-information-design.md`

## Global constraints

- Work on main, preserve all unrelated changes, and do not commit or push during implementation.
- Canonical source is `docs/launch-site`; rebuild and export rather than editing generated HTML.
- Add no runtime dependency. Preserve the technical content, scientific caveats, data locks, all photo assets and restored photo proportions.
- Preserve both languages, themes, immediate project/record tabs, dropdown, media controls, reduced motion and no-JavaScript access.
- Keep `uikangee@postech.ac.kr`, the Wind Tunnel E-06 location and all existing supporters. No payment or message submission is added.

## Review focus

- A chapter hash or dated trial must reveal the correct subsystem after refresh, Back and language changes (Task 3).
- Unknown/malformed hashes and page-level anchors must leave a usable selected subsystem (Task 3).
- Long Korean navigation labels and 320px screens must not overlap logos or hide controls (Task 1).
- Old support/contact URLs must preserve queries, hashes and no-JavaScript navigation (Task 2).
- The mission text must remain visible after playback starts; footer height must come from layout, not clipping (Tasks 1 and 4).

## Task 1: Shared identity and compact footer

Files: new `docs/launch-site/chrome-view.mjs`; modify `templates.mjs`, `program-pages.css`; test `check-information-design.cjs`.

Interfaces: `headerView(lang, asset, navigation)` and `footerView(lang, asset, navigation, sources)` return HTML strings. Existing interaction selectors remain intact.

- [x] Add browser assertions for header image order/sizing and footer height:
  ```js
  assert.ok(psi.width > postech.width);
  assert.ok(postech.x > preferences.x);
  assert.ok(footer.height <= 175);
  ```
- [x] Run `node docs/launch-site/check-information-design.cjs`; expect failure against old logo order and 374px footer.
- [x] Extract chrome markup, combine the PSI identity link and emblem, place POSTECH last, retain navigation controls, replace the multi-band footer with compact rows.
- [x] Replace targeted old component rules; desktop footer is content-sized, mobile wraps with 44px controls. Run the targeted test and build/export; expect passing geometry and no overflow.

## Task 2: About & Support and redirects

Files: `content.mjs`, `templates.mjs`, `support-page.mjs`, `people-view.mjs`, `program-pages.css`; test `check-information-design.cjs` and existing contact checks.

Interfaces: `supportView(lang, asset, sources)` renders support/contact sections without its own page header or supporter list. `supportersView(lang, asset)` is composed once near the page end. Canonical route is `about.html`, support action anchor is `#support`, general contact anchor is `#contact`.

- [x] Test that the support action is above the fold, supporters follow contact, the laboratory team photo is last, and support/contact aliases resolve to About with the requested query/hash.
  ```js
  await page.goto(base+'/support.html?ref=partner#contact');
  await page.waitForURL(base+'/about.html?ref=partner#contact');
  assert.ok(await page.locator('#contact').isVisible());
  ```
- [x] Observe failures on existing separate pages.
- [x] Compose page heading/support action, support options, contact/map, existing organisation/people/history/participation, supporters, then laboratory team photograph. Remove the redundant channel email action, not the confirmed contact.
- [x] Replace support/contact links and redirect targets, retaining ordinary and no-JavaScript fallbacks. Set supporter container background transparent and use current light/dark artwork.
- [x] Run targeted route/form/background tests; expect passing, no email sent.

## Task 3: Stable PSLV subsystem workspace

Files: `program-pages.mjs`, `templates.mjs`, `engineering-pages.mjs`, `site.js`, `motion.js`, `program-pages.css`; test `check-information-design.cjs` and engineering/result checks.

Interfaces: retain `[data-system]` and existing IDs as native details for fallback. Add `[data-system-tab]`, `[data-system-select]`, `[data-system-workspace]`. Enhanced desktop uses tabs with one open detail; mobile uses the selector. Existing target IDs select their owning system.

- [x] Test equal detail x/width before and after selecting a subsystem, persistent rocket visibility, keyboard selection, mobile selector, nested hash and history recovery.
  ```js
  await page.goto(base+'/projects.html#architecture');
  assert.ok(await page.locator('#architecture').isVisible());
  await page.locator('[data-system-tab="tms"]').click();
  assert.equal(new URL(page.url()).hash,'#tms');
  await page.goBack();
  assert.ok(await page.locator('#architecture').isVisible());
  ```
- [x] Observe current missing controls/layout-shift failures.
- [x] Separate vehicle overview from workspace, render labelled subsystem controls and fallback details, remove old expanding-grid/hide-image styles.
- [x] Replace the old accordion animator with selection state in `site.js`. Keep one source of truth for URL reconciliation; synchronously reveal before scrolling; preserve query and language state; dispatch resize when result charts become visible.
- [x] Align embedded chapter headings and content in one reading column, normalize forced title breaks, preserve all scientific text/plots. Run targeted navigation/geometry and results checks; expect all controls and charts usable.

## Task 4: Home purpose and full verification

Files: `templates.mjs`, `program-pages.css`, `check.cjs`, affected existing design tests and README.

Interfaces: `.home-identity` contains the single h1 and mission outside the player; `.home-support` links to `about.html#support`. Media selectors remain unchanged.

- [x] Test that Home retains two programme links, the film ratio, a visible mission while playing, and a direct support route without separate research/test promotional sections.
- [x] Observe failure on current overlay-only identity/promotional sections.
- [x] Move identity outside the video, use approved concise EN/KO copy, retain natural programme imagery, replace the two redundant sections with the compact support invitation.
- [x] Update superseded tests without weakening unrelated behavior coverage; import the new checker in `check.cjs`.
- [x] Build/export and run `check.cjs`, `check-test-results.cjs`, `check-refinement-visual.cjs`, `check-assets.mjs`, `tools/check-release.mjs`, and `git diff --check`. Expect zero failures.
- [x] Review desktop/mobile screenshots, request a fresh scoped code review, fix important findings with failing regressions, update execution record, refresh the existing Home preview. No commit or push.

## Execution record

- Design and written spec approved by the user's successive requests to implement.
- Execution: native in this session. Preserve the existing dirty main worktree; no worktree migration or automatic commit.
- Pre-flight: Tasks 1/2 share navigation markup; produce the combined nav in Task 2 without duplicating header rendering. Tasks 1/4 share media/header spacing; actual header height remains the anchor clearance authority. Task 3 retains technical IDs for existing result/telemetry consumers.
- Tests and per-task results will be recorded below during execution.

### Verified outcome

- New regression suite observed RED against the old implementation, then passed in both languages after the four implementation tasks.
- Header identity order and desktop footer height (at most 175px) passed at 1280/1440px; all chrome checks passed at 320/390px.
- Combined support/contact URLs, above-fold email action, transparent supporter backgrounds, closing photograph and compact Wind Tunnel map verified. Original team/leadership/founding facts and all four supporters retained.
- Stable subsystem geometry, native fallback, keyboard/mobile selection, chart visibility, Back/Forward, refresh and language links passed. Review found a return-from-Aircraft URL-state gap; a failing regression reproduced it before the selection hash fix.
- Tablet telemetry overflow was reproduced in the 768px visual matrix and fixed with container-responsive readouts. All 140 route/locale/theme/viewport combinations and eight expanded-system layouts now pass.
- Independent read-only review approved with no remaining blocker. Its minor email-action explanation and About ordering comments were implemented.
- Full `check.cjs` suite, `check-structure.cjs`, `check-support-contact.cjs`, `check-accessibility.cjs`, `check-assets.mjs`, result integration and `tools/check-release.mjs` passed. Desktop/mobile screenshots were inspected.
- Static-host adaptation: JavaScript redirects retain query/fragment; no-JavaScript meta refresh and ordinary links use the default canonical section. Documented in README; arbitrary no-JavaScript URL-state preservation is not claimed.
- Execution interfaces: header navigation is an object containing rendered links and the language URL; footer navigation remains rendered links. This avoids exposing page-template internals in the shared chrome module.
- Completion follows the user's explicit existing-main integration choice: no new worktree, no commit/push, no unrelated cleanup. Current preview opened at http://127.0.0.1:8874/index.html.
