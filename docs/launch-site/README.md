# PSI launch-site source and local review

This is the source and standalone review build for the bilingual PSI website. It lives under the Jekyll-excluded `docs` directory. The root export, not this directory, is published by the existing main-branch GitHub Pages deployment. Build and verify here before running `node tools/export-launch-site.mjs` from the repository root; see the root README for the release process.

## Build and preview

Run from this directory with Node.js:

```sh
node build.mjs
python -m http.server 8767 --bind 127.0.0.1
```

Open `http://127.0.0.1:8767/`. English is the entry language. Fourteen routes have matching paths under `ko/`, including compatibility redirects; the language switch retains the current page, query and fragment. Both `contact.html` and `ko/contact.html` also redirect to `support.html#contact`.

The build uses only Node's standard library. Content records are in `content.mjs`, current manuscripts in `current-research.mjs`, event records in `gallery-data.mjs`, HTML structure and bilingual page copy in `templates.mjs`, the support/contact page in `support-page.mjs`, and engineering chapters in `engineering-pages.mjs`. Presentation is in `site.css` and browser behaviour in `site.js`. `telemetry-view.mjs` renders the static recorded plot; `telemetry.mjs` enhances it with playback. Running the build writes 28 route pages plus two contact redirects. Keep generated HTML with the source for direct local review. Stylesheet and script URLs carry content fingerprints, so an already-open preview cannot silently mix old assets with new markup.

## Verification

`projects.html` is the canonical home of the complete PSLV and Aircraft panels. Its tabs switch the full panel immediately, and the Projects navigation has direct PSLV/Aircraft dropdown links. `pslv.html` and `aircraft.html` are compatibility redirects. The Avionics and TMS engineering chapters sit within PSLV; `avionics.html` and `tms.html` redirect to those anchors. The pinned M7/M4 implementation and recorded player remain available at `#flight-record`, and the original result controls and graph engine remain under `#test-results`. Home and Records link to this local result view. The independent public portal remains a secondary source. The calibration figure retains its original white background, full-size source and limitations; dated test PNGs and independent numeric cards do not duplicate the live results.

`node check.cjs` expects the local server at port 8767. It uses the declared Playwright dependency and Chromium by default; set `PSI_BROWSER_CHANNEL=msedge` to use Edge. Set `PSI_URL` to use another loopback origin. The checker closes its browser in a `finally` block and returns a non-zero exit status on a failed assertion.

The checks cover all 28 route pages at 320, 390, 768 and 1440 pixels; theme persistence; route-preserving language links; research topic/search filters, reset and empty state; mobile menu Escape/scroll restoration; selected hardware panels; media switching; actual pad/onboard playback; support email drafts and map fallback; font and image loading; and browser exceptions. `check-media-visual.cjs` loads and decodes all visible media before capturing every locale/theme at 320/390/768/1440. CAD checks use verified alpha bounds to prove that the light drawing board crops only transparent padding and preserves every hardware component.

The full checker includes `check-review-followups.cjs`, `check-reel.cjs`, `check-homepage.cjs`, `check-current-content.cjs`, `check-motion-gallery.cjs`, `check-brand.cjs`, `check-engineering.cjs`, `check-support-contact.cjs` and `check-polish.cjs`. `node check-assets.mjs` separately checks content-fingerprinted asset URLs. Run these individually for focused checks; the motion checker also accepts `theme`, `hero`, `handoff`, `gallery`, `loading`, `replay`, `preferences` or `fallbacks` as its final argument. It covers real playback, background-to-native-control focus, remembered pause, reduced motion, Save-Data, policy rejection, stale promises, gallery keyboard/mobile controls and recorded sample playback. Save-Data, policy rejection and document visibility are controlled environment fixtures; actual media time and UI state are asserted. Desktop/mobile screenshots are written locally and excluded from version control. Root review scripts add independent theme, anchor, source-data and privacy checks.

## Content and media

Public repositories, the PSI public research register and POSTECH's founder article ground the project, research and history copy. Five ongoing September 2026 manuscripts are separated from fifteen historical records; acceptance/publication status is unverified. Conference records retain their original Korean titles. English research descriptions and UGRP award glosses are editorial translations. Recruitment copy links to current announcements without claiming that applications are open.

Approved photographs, video derivatives and the electric TVC CAD are in `assets`. Conceptual research diagrams are inline SVG and explicitly distinguish themselves from measured results. The authentic PSI logo is unchanged in the navigation and the final footer band. `assets/index.html` is an intentional no-index landing page, not a file listing. All interface typography, including English headings, uses self-hosted Pretendard to match PSI's test-results portal, with its license retained. The older Barlow file is no longer referenced or preloaded. Raw iCloud downloads, internal decks, manuscript pages and precise-coordinate telemetry screenshots are not included.

Only the homepage pad film can begin as a muted inline background loop. It pauses offscreen, in a hidden document, or while navigation/dialog interaction obscures its control. A compact pause/resume icon preserves explicit user pause. Reduced-motion and Save-Data begin with a still poster; explicit playback remains available. The adjacent sound icon hands playback to native controls; its action remains labelled for assistive technology and in a tooltip. Onboard and PSLV-panel films require intentional play; the onboard warning describes rapid camera rotation. Both films use one stable 16:9 contain frame, and switching viewpoints leaves the new clip paused. Native controls remain available without JavaScript. Two static photographic/conceptual homepage previews link directly to the full PSLV and Aircraft panels; the only full project tab switcher is on Projects. The sun/moon button directly switches the palette and stores only `psi-theme` locally. A fresh visit follows the system; an explicit choice overrides later system changes. The toggle has a stable accessible name with a pressed state and an action tooltip.

Gallery (`gallery.html` / `ko/gallery.html`) contains fourteen unique photographs across six documented events, including the POSTECH award group photograph. The six dated award facts remain in Records, alongside fifteen historical research/award records and filters. Static photo links work without JavaScript; enhancement provides an accessible modal with keyboard navigation, full image proportions and focus return. Single-photo events remain single-photo events. The spring MT event was removed from the displayed gallery at the user's request; original archive files were not deleted. Thumbnails are derivatives, not additional photographs. Some OneDrive images are 1024px archive previews and are not presented as camera originals.

The canonical recorded player at `projects.html#flight-record` uses 343 selected received public-log samples with seven documented gaps, rendered as eight disconnected SVG traces. Time is relative to the excerpt start, not liftoff. Controls play, pause, reset and scrub actual samples; they never interpolate across gaps. Playback pauses when the document is hidden and stops at the last DEPLOY sample. The maximum received estimate is 186.632 m; it is not a vehicle specification or evidence of landing. The excerpt's date/vehicle and synchronization with the films are unconfirmed. `assets/archive-telemetry.json` contains only four sample fields, elapsed gap boundaries and a pinned public source link. Fetch/JavaScript failures preserve the static plot and summary. Private raw manuscripts, source files, absolute times and coordinates are not runtime inputs.

Leadership updates supplied by PSI in the design review supersede the older public directory: Vice President Yeonho Kim, Secretary Taeho Lee, and Avionics & TMS Lead Jaeyoung Park. English spellings are editorial romanizations. The two engineering case studies name the same project lead. Heading-final periods in both languages are normalized during static rendering; body punctuation and technical numbers are retained.

The homepage close-up uses the user's preferred authentic rocket photograph at its complete aspect ratio. A four-photo reel follows the hardware, launch rail, launch-day team and workshop preparation. It changes every seven seconds while visible, with previous/next, direct dots, pause/play, arrow keys and touch swipes. Focus, hover, hidden tabs and manual movie playback suspend its timer; an explicit pause persists across those interactions. Reduced motion starts paused. Its visible frame pauses the automatic hero film without resetting the film’s manual pause. The first photograph and event link remain available without JavaScript. No animation library, generated rocket image, scroll hijacking or invented telemetry was added.

The support page lists the four approved supporter identities, invites financial, equipment/material and technical proposals, and offers a visitor-owned email draft to the confirmed president mailbox. It does not claim that opening a draft submits a message. The printed POSTECH address and official campus-map link remain useful if the approximate OpenStreetMap marker cannot load; the marker does not identify PSI's room. About retains the organisation table, leadership, timeline, recruitment and official channels, with supporters as its final block; the long join cards, FAQ and notebook section were removed.

## Portable results parity checks

From the repository root, use Node.js 20 or newer and pnpm:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm test:results
```

The pinned project dependency and lockfile supply Playwright; the suite uses standard Node module resolution and Chromium by default on Windows, macOS and Linux. Linux CI images may additionally need `pnpm exec playwright install-deps chromium`. To use an already-installed supported browser, set `PSI_BROWSER_CHANNEL` (for example, PowerShell: `$env:PSI_BROWSER_CHANNEL='msedge'`). No developer-specific runtime path is required. The suite starts its own static server and creates its screenshot output directory. `node tools/check-results-test-dependency.cjs` verifies dependency resolution without launching a browser.

## Current information architecture

Projects contains immediately switchable full PSLV and Aircraft panels. Avionics and TMS are subordinate PSLV systems. Research presents the five current studies with labelled conceptual diagrams and the inspected electric-TVC CAD; historical conference and award records live in Records, retaining filters and original public sources. News owns event photographs, including the award image, while Records owns dated evidence. About ends with supporters. Support & Contact owns the enquiry form and campus map. Learning and Join compatibility routes both reach the remaining About participation section; former project, news-test and research-archive anchors forward to their corresponding destinations. `program-pages.mjs`, `archive-view.mjs` and `support-page.mjs` own these views; `program-pages.css` owns the engineering layout.

The immutable result catalog is the only numeric test catalog. Records and Home use validated local `projects.html?test=<id>#test-results` links. The live results module retains static fallback readings, while trial-keyed observations preserve interpretation limits without independent metric cards or duplicate result PNGs. The exporter includes only referenced reviewed assets, the explicit assets landing page and its locked result allowlist; private working manuscripts are excluded.

Run `PSI_BROWSER_CHANNEL=msedge PSI_URL=http://localhost:8870 node docs/launch-site/check.cjs` from the repository (PowerShell: set the environment variables first). `check-structure.cjs` uses `PSI_BASE_URL` with a trailing slash. Browser checks import the declared Playwright dependency; unset `PSI_BROWSER_CHANNEL` for portable Chromium.
## Review follow-ups — 23 September 2026

- Records has four immediate-switch tabs: Tests, Flights, Research & Awards, and Milestones. Only the active panel is shown with JavaScript; all four remain readable without it. Existing section and research-record fragments activate their owning panel. Keyboard arrows/Home/End, history, language switching and the fifteen-record filters remain available.
- Gallery is the canonical photo destination in navigation, footer and photo links. Old News URLs preserve their query and event fragment; `news.html#tests` still opens Records. The legacy Events landing page now points directly to Gallery.
- Editorial photographs use explicit `data-photo-motion` markers and one pointer-hover tilt rule. Still photographs do not autoplay, show video icons or acquire play/pause buttons. Coarse pointers, reduced motion, diagrams, scientific screenshots, logos and the full-size lightbox stay still. The separately labelled homepage carousel retains its own navigation and pause control.
- Page-heading/section padding, homepage programme boundaries, project/research spacing and the Gallery lead-in are tightened. Removed the redundant photo-section heading and repeated milestone list from Gallery; the complete milestone archive remains in Records.
- `node check-review-followups.cjs` covers these contracts and is included in `node check.cjs`.
