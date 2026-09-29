# PSI launch-site source and local review

This is the source and standalone review build for the bilingual PSI website. It lives under the Jekyll-excluded `docs` directory. The root export, not this directory, is published by the existing main-branch GitHub Pages deployment. Build and verify here before running `node tools/export-launch-site.mjs` from the repository root; see the root README for the release process.

## Build and preview

Run from this directory with Node.js:

```sh
node build.mjs
python -m http.server 8767 --bind 127.0.0.1
```

Open `http://127.0.0.1:8767/`. English is the entry language. Fourteen routes have matching paths under `ko/`, including compatibility redirects; the language switch retains the current page, query and fragment. Contact routes redirect to the matching locale's `about.html#contact`; Support routes reach `about.html#support`.

The build uses only Node's standard library. Content records are in `content.mjs`, current manuscripts in `current-research.mjs`, event records in `gallery-data.mjs`, HTML structure and bilingual page copy in `templates.mjs`, the support/contact page in `support-page.mjs`, grouped leadership in `people-view.mjs`, and concise engineering sections in `engineering-pages.mjs`. Shared shell styles are in `site.css`; the consolidated editorial/component rules are in `program-pages.css`, with shared SVG controls in `icons.mjs`. Browser behaviour is in `site.js`. The earlier recorded-telemetry demo is retained in source history but is no longer rendered on Projects. Running the build writes 28 route pages plus two contact redirects. Keep generated HTML with the source for direct local review. Stylesheet and script URLs carry content fingerprints, so an already-open preview cannot silently mix old assets with new markup.

The shared footer orders the marks POSTECH → PSI emblem → PSI wordmark, with the privacy link beneath the identity group. Page navigation and the unbroken Email/Instagram/GitHub row form a separate responsive group. Supporters include owner-confirmed KAI and MATLAB/MathWorks; their original light/dark logo variants retain transparent backgrounds and source colors. See `assets/supporter-sources.md` for provenance and checksums.

## Verification

`projects.html` contains the complete PSLV and Aircraft programmes. Tabs change the programme; PSLV itself is one continuous page: vehicle introduction, Systems engineering with three Avionics essentials, original combustion results, and dated flights. Avionics and TMS each have one link to their main GitHub repository. The chapter links scroll within PSLV. Old project URLs and chapter anchors remain compatible, including selected combustion trials. All content and a static results table remain readable without JavaScript.

`node check.cjs` expects the local server at port 8767. It uses the declared Playwright dependency and Chromium by default; set `PSI_BROWSER_CHANNEL=msedge` to use Edge. Set `PSI_URL` to use another loopback origin. The checker closes its browser in a `finally` block and returns a non-zero exit status on a failed assertion.

The checks cover all 28 route pages at 320, 390, 768 and 1440 pixels; theme persistence; route-preserving language links; research topic/search filters, reset and empty state; mobile menu Escape/scroll restoration; PSLV section navigation; media switching; actual pad/onboard playback; support email drafts and map fallback; font and image loading; and browser exceptions. `check-media-visual.cjs` loads and decodes all visible media before capturing every locale/theme at 320/390/768/1440. CAD checks use verified alpha bounds to prove that the light drawing board crops only transparent padding and preserves every hardware component.

The full checker includes `check-site-refinement.cjs`, `check-layout-refinement.cjs`, `check-review-followups.cjs`, `check-reel.cjs`, `check-homepage.cjs`, `check-current-content.cjs`, `check-motion-gallery.cjs`, `check-brand.cjs`, `check-engineering.cjs`, `check-support-contact.cjs` and `check-polish.cjs`. `node check-assets.mjs` separately checks content-fingerprinted asset URLs. Run these individually for focused checks; the motion checker also accepts `theme`, `hero`, `handoff`, `gallery`, `loading`, `preferences` or `fallbacks` as its final argument. It covers real playback, background-to-native-control focus, remembered pause, reduced motion, Save-Data, policy rejection, stale promises, gallery keyboard/mobile controls. Save-Data, policy rejection and document visibility are controlled environment fixtures; actual media time and UI state are asserted. Desktop/mobile screenshots are written locally and excluded from version control. Root review scripts add independent theme, anchor, source-data and privacy checks.

## Content and media

Public repositories, the PSI public research register and POSTECH's founder article ground the project, research and history copy. Five ongoing September 2026 manuscripts are separated from fifteen historical records; acceptance/publication status is unverified. Conference records retain their original Korean titles. English research descriptions and UGRP award glosses are editorial translations. Recruitment copy links to current announcements without claiming that applications are open.

Approved photographs, video derivatives and the electric TVC CAD are in `assets`. Conceptual research diagrams are inline SVG and explicitly distinguish themselves from measured results. The authentic PSI wordmark is unchanged in navigation and the unified gray footer; the footer also carries the original favicon emblem. Luminance masks let the original monochrome artwork follow the theme without an opaque black rectangle. The 733px-wide official POSTECH artwork replaces the tiny header/footer originals. `assets/index.html` is an intentional no-index landing page, not a file listing. All interface typography, including English headings, uses self-hosted Pretendard to match PSI's test-results portal, with its license retained. The older Barlow file is no longer referenced or preloaded. Raw iCloud downloads, internal decks, manuscript pages and precise-coordinate telemetry screenshots are not included.

Only the homepage pad film can begin as a muted inline background loop. It pauses offscreen, in a hidden document, or while navigation/dialog interaction obscures its control. A compact pause/resume icon preserves explicit user pause. Reduced-motion and Save-Data begin with a still poster; explicit playback remains available. The adjacent sound icon hands playback to native controls; its action remains labelled for assistive technology and in a tooltip. Onboard and PSLV-panel films require intentional play; the onboard warning describes rapid camera rotation. Both films preserve their original aspect ratio with `object-fit:contain`. The Home launch film fills the page width at its native 16:9 ratio without a desktop height cap, side gaps or cropping; the film tabs can sit below the first viewport on wide screens. The portrait onboard clip remains contained in the same stable player, so its full image is visible. Mobile and project players also retain a stable 16:9 frame. Switching viewpoints leaves the new clip paused. Native controls remain available without JavaScript. Two consolidated photographic/conceptual homepage previews link directly to the full PSLV and Aircraft panels; the only full project tab switcher is on Projects. The sun/moon button directly switches the palette and stores only `psi-theme` locally. A fresh visit starts in light mode; a saved system preference follows the OS; an explicit choice overrides later system changes. The toggle has a stable accessible name with a pressed state and an action tooltip.

Gallery (`gallery.html` / `ko/gallery.html`) contains fourteen unique photographs across six documented events, including the POSTECH award group photograph. The six dated award facts remain in Records, alongside fifteen historical research/award records and filters. Static photo links work without JavaScript; enhancement provides an accessible modal with keyboard navigation, full image proportions and focus return. Single-photo events remain single-photo events. The spring MT event was removed from the displayed gallery at the user's request; original archive files were not deleted. Thumbnails are derivatives, not additional photographs. Some OneDrive images are 1024px archive previews and are not presented as camera originals.

The former telemetry replay and implementation-level Avionics chapters have been removed from the public page at the owner’s request. The concise summary retains the flight-computer responsibilities and the distinction between vertical-motion estimation and separately recorded GNSS position. `#flight-record` now reaches the dated flight record beside the films. Source files for the retired replay remain available in the repository.

Leadership updates supplied by PSI in the design review supersede the older public directory: Vice President Yeonho Kim, Secretary Taeho Lee, and Avionics & TMS Lead Jaeyoung Park. English names retain the spellings confirmed by PSI. Heading-final periods in both languages are normalized during static rendering; body punctuation and technical numbers are retained.

The homepage close-up uses the user's preferred authentic rocket photograph at its complete aspect ratio. A four-photo reel follows the rocket body, launch rail, rear fins and airframe section. Group photographs remain in Gallery and About, not Home. It changes every seven seconds while visible, with previous/next, direct dots, pause/play, arrow keys and touch swipes. Focus, hover, hidden tabs and manual movie playback suspend its timer; an explicit pause persists across those interactions. Reduced motion starts paused. Its visible frame pauses the automatic hero film without resetting the film’s manual pause. The first photograph and event link remain available without JavaScript. No animation library, generated rocket image, scroll hijacking or invented telemetry was added.

The merged About & Support page lists the five approved supporter entries, invites financial, equipment/material and technical proposals, and offers a visitor-owned email draft to the confirmed president mailbox. It does not claim that opening a draft submits a message. Contact and location share a compact two-column layout; a native disclosure reveals the email form when needed. The 360 × 220px map (200px high on mobile) marks POSTECH's Wind Tunnel building, 풍동동 (E-06), rather than the campus center. The institutional postal address and official campus-map/building links remain useful if the external embed fails. The pin identifies a building, not PSI's room or an entrance; visitors are asked to email first. The supporter list and support invitation follow the About introduction. One archive team photograph accompanies participation, followed by grouped leadership. A small founding note sits below the email contact and draft form, beside the map. The organisation table and separate channel row are removed; footer links remain.

## Portable results parity checks

From the repository root, use Node.js 20 or newer and pnpm:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm test:results
```

The pinned project dependency and lockfile supply Playwright; the suite uses standard Node module resolution and Chromium by default on Windows, macOS and Linux. Linux CI images may additionally need `pnpm exec playwright install-deps chromium`. To use an already-installed supported browser, set `PSI_BROWSER_CHANNEL` (for example, PowerShell: `$env:PSI_BROWSER_CHANNEL='msedge'`). No developer-specific runtime path is required. The suite starts its own static server and creates its screenshot output directory. `node tools/check-results-test-dependency.cjs` verifies dependency resolution without launching a browser.

## Current information architecture

Projects uses shared programme introductions and one continuous PSLV document. Research presents five current studies; historical conference and award records remain in Records. Gallery owns event photographs. About follows introduction, supporters and support action, participation, leadership, contact/location with compact founding, then the centered laboratory group photograph. Compatibility routes preserve their canonical destinations.

The immutable result catalog is the only numeric test catalog. Records uses validated local `projects.html?test=<id>#test-results` links. The live results module retains static fallback readings, while trial-keyed observations preserve interpretation limits without independent metric cards or duplicate result PNGs. The exporter includes only referenced reviewed assets, the explicit assets landing page and its locked result allowlist; private working manuscripts are excluded.

Run `PSI_BROWSER_CHANNEL=msedge PSI_URL=http://localhost:8870 node docs/launch-site/check.cjs` from the repository (PowerShell: set the environment variables first). `check-structure.cjs` uses `PSI_BASE_URL` with a trailing slash. Browser checks import the declared Playwright dependency; unset `PSI_BROWSER_CHANNEL` for portable Chromium.
## Review follow-ups — 23 September 2026

- Records has four immediate-switch tabs: Tests, Flights, Research & Awards, and Milestones. Only the active panel is shown with JavaScript; all four remain readable without it. Existing section and research-record fragments activate their owning panel. Keyboard arrows/Home/End, history, language switching and the fifteen-record filters remain available.
- Gallery is the canonical photo destination in navigation, footer and photo links. Old News URLs preserve their query and event fragment; `news.html#tests` still opens Records. The legacy Events landing page now points directly to Gallery.
- Editorial photographs use explicit `data-photo-motion` markers and one pointer-hover tilt rule. Still photographs do not autoplay, show video icons or acquire play/pause buttons. Coarse pointers, reduced motion, diagrams, scientific screenshots, logos and the full-size lightbox stay still. The separately labelled homepage carousel retains its own navigation and pause control.
- Page-heading/section padding, homepage programme boundaries, project/research spacing and the Gallery lead-in are tightened. Removed the redundant photo-section heading and repeated milestone list from Gallery; the complete milestone archive remains in Records.
- `node check-review-followups.cjs` covers these contracts and is included in `node check.cjs`.
## Compact layout review — 24 September 2026

- Home omits the Assembly and field preparation block and the PSI members section/photo. About omits its timeline and supporter band; historical records and Gallery are unaffected.
- Leadership groups advisor, presidency and operational/technical roles; former presidents use a native disclosure. Four channel actions explain where each link leads.
- Enlarged high-resolution POSTECH/PSI artwork, the original PSI favicon emblem, and one gray theme-aware footer are shared by both locales. Footer POSTECH uses black ink in light mode and white ink in dark mode; header and supporter POSTECH marks retain their original colour. The Projects chevron is an aligned SVG. Header controls retain 44px targets even at 320px; desktop navigation is centered in the available area between the larger identity and preferences.
- Redundant promotional jump links were removed; source links, result links, navigation, project tabs and media controls remain.
- Supporter backgrounds use the theme surface. Ansys uses original light/dark variants; the monochrome MATLAB wordmark uses dark ink in light mode. See [artwork provenance](assets/supporter-sources.md).
- Map provenance: POSTECH's [2026–27 admissions guide campus map](https://gift.postech.ac.kr/file/2026_27_Admissions_guide_for_international%20students_GIFT.pdf) identifies E-06 as Wind Tunnel / 풍동동. The pin at 36.02159, 129.32135 lies within [OpenStreetMap building 631011007](https://www.openstreetmap.org/way/631011007), whose geometry and 풍동동 name were checked via the public OSM API. This is not a verified room/entrance location.
- `node check-layout-refinement.cjs` covers removals, grouped people/channels, high-DPI asset dimensions, unified footer, theme-aware supporters, dropdown keyboard navigation, compact map and expandable email draft. It runs as part of `node check.cjs`.

## Whole-site refinement — 25 September 2026

- Page titles and optional short introductions share a vertical axis. Type, section spacing, source links and SVG controls follow one compact editorial hierarchy; headings do not fade while being read.
- Home combines the PSLV reel and programme preview. Projects has one hardware overview and the existing system disclosures instead of a duplicate hardware tab interface. The research invitation and results band are compact; all original evidence remains accessible.
- Records persists `topic`, `type` and `q` in the URL. Selection changes create history entries; search typing updates the current entry. Reload, language changes and Back/Forward restore filters. Reset clears only these parameters. A specific record anchor clears incompatible filters so the requested record remains visible.
- English archive entries lead with their translated titles; original Korean titles remain underneath. Research stages and validation caveats remain visible. Gallery sorts the six events newest first and eagerly loads the lead image; fourteen original photographs remain.
- About uses one recruitment section and compact organisation, people and channel layouts. Support uses the high-resolution official POSTECH wordmark for the separate Mechanical Engineering entry. Email preparation is explicitly two-step and any field edit invalidates the earlier draft link.
- The results adapter removes the duplicate chart hint and uses a square, unshadowed frame. Original chart samples, axes, colour palettes and legend options are protected by upstream parity tests. Edit `tools/test-results-adapter.mjs`, then run `node tools/sync-test-results.mjs` to regenerate; do not edit the upstream snapshot.
- `node check-site-refinement.cjs` covers the new behavioral regressions. `node check-refinement-visual.cjs` checks seven pages at five widths in both locales/themes plus expanded system layouts, writing local screenshots under `output/playwright/site-refinement`. Both use the same `PSI_URL` / default port 8767 convention as the main checker.

### Photo-composition correction

The user rejected uniform, compact image boxes. Keep the concise copy and functional refinements, but preserve the site's earlier gallery-like composition: a portrait Home reel, alternating programme/research visuals, side-captioned albums with a varied launch-photo spread, and natural photo proportions in Projects and About. Photo whitespace is intentional; do not apply text-density rules to every image. Gallery remains chronological, and its special launch spread is selected by event ID rather than position.

`node check-photo-layout.cjs` protects portrait presentation, alternating desktop order, natural image proportions, all 14 Gallery photographs and mobile reading order. It is included in `check.cjs`.

## Historical implementation — 26 September 2026

The September 29 revision below supersedes the earlier About ordering and PSLV subsystem interface.

- Five main destinations now include **About & Support**. The PSI wordmark and authentic emblem form one Home link; the smaller POSTECH affiliation sits at the far right. At narrow widths a compact second control row preserves 44px touch targets. `chrome-view.mjs` owns the shared masthead and compact single-surface footer (no duplicated branding band).
- About opens with a support email action to the confirmed president address, visible email and support types. The action opens the visitor's email app; it does not send a message. Contact and the Wind Tunnel E-06 map follow. Leadership, organisation, participation/channels and founding information precede the four supporters and the laboratory photograph. Supporter backgrounds are transparent, with the existing light/dark artwork.
- `support.html` and `contact.html` are compatibility redirects to `about.html#support` and `about.html#contact` in both languages. JavaScript preserves query strings and explicit fragments; legacy `#support-path-heading`, `#supporters-heading`, `#campus` and `#campus-heading` remain available. Without JavaScript, static meta refresh and ordinary links reach the default canonical section; they cannot preserve arbitrary query/fragment state on this static host.
- PSLV keeps its independent rocket overview above a stable subsystem workspace. Desktop has a sticky five-item rail; mobile has a labelled selector. Avionics is the default. Returning from Aircraft keeps a non-default subsystem in the URL; chapter links, history, refresh and language changes restore it. Native details preserve no-JavaScript reading. Technical prose, sources, data and charts are unchanged; embedded headings and prose share one axis. Telemetry responds to the column's width, including the narrower tablet layout.
- Home retains its full-width film and natural programme photographs. Its concise mission is outside the video and remains visible during playback. The standalone Research and Test Results promotions are replaced with a compact support invitation.
- `check-information-design.cjs` covers these contracts and is included in `check.cjs`. Previous tests were migrated only where approved behavior changed; native fallbacks, charts, sources, image proportions, keyboard interaction and theme checks remain.

## September 2026 layout revision

The PSLV Systems engineering section uses the owner-supplied `assets/pslv-systems.png` at its original 747 × 819 proportions. No control-study promotion appears in the overview; the legacy `#control` anchor reaches Systems engineering. `#structure` reaches the vehicle explanation, and `#recovery` reaches the December flight record. The August 2025 recovery failure remains explicit. The portrait, detail photograph and team photograph are complete images, without cropping.

PSLV and Aircraft use the same `projectHero` component and shared heading, spacing and link styles. Aircraft retains its labeled conceptual diagram and separates its research links from the introduction. Selecting either programme returns to the project switcher above its introduction; deep links still reach their chapters. About retains both original group photographs: the launch-field image beside participation and the laboratory image at the bottom, after contact. Supporters remain immediately after the introduction, and founding remains a compact note under contact.

For this layout, run `node check.cjs`, `node check-pslv-clean.cjs`, `node check-support-contact.cjs`, `node check-structure.cjs`, `node check-test-results.cjs` and `node check-assets.mjs`. The focused layout check covers both languages and themes at 320/390/768/1440 px, natural image proportions, old anchors, chart width after reveal, history, keyboard/focus, language switching, hidden playback, no-JavaScript access and preserved footer links.


### Continuous PSLV follow-up — 29 September 2026

The owner requested all engineering material inline and essential Avionics content only. `engineering-pages.mjs` now renders a three-point Avionics summary and the original combustion-results component, with just the main Avionics and TMS repository links. The result datasets and chart engine remain pinned and unchanged. The laboratory group photo closes About at a maximum width of 640px on desktop and 360px on mobile, with its full proportions. The shared footer is retained. `check-engineering.cjs` delegates to the continuous-page regression suite; former checks for removed disclosures, implementation references and telemetry playback have been replaced with checks for the new behavior.
