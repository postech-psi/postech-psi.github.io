# PSI information design and subsystem experience

Status: approved by the user's successive implementation requests; implemented and verified. See the implementation plan's execution record for checks and the static-host no-JavaScript redirect limitation.

## Purpose

Help a first-time visitor understand what PSI does, inspect its engineering work without losing orientation, and find a clear way to support the group. Use a restrained academic/engineering identity, not decorative marketing effects or a dashboard of uniform cards.

The audience includes prospective supporters and collaborators, students, and technical readers. Success means that support is visible at the top of the combined information page; subsystem selection never changes the reading-column alignment; the Home page explains PSI's purpose; and shared branding/footer elements occupy proportionate space.

## Global constraints

- Work in the existing main checkout and preserve unrelated tracked and untracked changes.
- Edit canonical source in `docs/launch-site`; generate root exports with the existing build/export commands.
- Keep the existing static HTML, JavaScript and CSS architecture. Add no runtime dependency.
- Apply changes in English and Korean, light and dark themes, desktop and mobile.
- Preserve the natural photographic compositions recently restored throughout the site. Do not replace them with uniform cropped boxes.
- Preserve the uncropped, edge-to-edge 16:9 Home launch film and existing playback, sound, reduced-motion and no-JavaScript behavior. Portrait onboard footage remains uncropped.
- Preserve the immediate PSLV/Aircraft tabs, Projects dropdown, Records tabs, Gallery, archive filters and existing scientific content and caveats.
- Preserve all 5 current studies, 15 research records, 14 gallery photographs, 4 test trials and 3 flight records.
- Do not alter upstream numerical test artifacts, source locks, source citations, measured values or scientific claims.
- Use the confirmed contact address `uikangee@postech.ac.kr` and existing POSTECH Wind Tunnel building location, 풍동동 (E-06).
- No payment processing, fabricated donation account, sponsorship packages, tax benefits or guaranteed supporter benefits.
- Do not send email, publish, push or include unrelated changes in a commit.

## Visual system

Retain Pretendard for both languages, including the existing proper-name and technical notation treatment. Establish one shared title/body scale rather than adding typefaces. Body text stays readable at 16–18px with approximately 60–72 characters per line; diagrams and plots may use the available content width.

Palette: white `#FFFFFF` and black `#000000` for the primary canvases, pale gray `#F4F4F4` and deep gray `#171717` for the corresponding neutral footer surfaces, secondary gray `#555555` in light mode and `#B8B8B8` in dark mode. Preserve authentic colours inside institutional/supporter marks. Resolve readable contrast before adopting any secondary tone.

Use a consistent page grid with aligned starts for section headings, prose and controls. Borders identify useful boundaries rather than decorating every section. Retain restrained, user-triggered interaction feedback; do not introduce scroll choreography, gradients, decorative counters or new automatic animation.

## 1. PSLV subsystem workspace

### Structure

Keep the Projects page and its immediate project tabs. Within PSLV, retain the film and an independent rocket overview; the overview does not disappear when a subsystem is selected. After the overview, present a workspace with a stable desktop navigation column and a single reading column.

The subsystem choices remain Avionics, Body and structure, Combustion tests, Aerodynamics and control, and Recovery. Avionics is the default when entering the workspace without a subsystem anchor. A selected item has an explicit active state that does not rely on colour alone.

Desktop layout: approximately 200–220px for the subsystem list, a 32–48px gutter, and the remaining width for content. The list can remain sticky beneath the global header; it must not cover page content. The diagram, paragraph and heading alignment is stable across subsystem changes. Wide charts use the reading-column width, and narrow prose uses a controlled measure inside it.

On mobile, replace the rail with a clearly labelled native subsystem selector above the content. Do not horizontally overflow the page or reduce control hit areas below 44px. The selector and desktop list express the same selected system.

### Content presentation

Display one subsystem detail at a time when JavaScript is available. Remove the current behaviour that expands the accordion to both grid columns and hides the rocket image. Remove redundant nested page-level titles and forced heading line breaks from embedded engineering introductions, while retaining their meaning and all technical information.

Within detailed systems, use a compact introduction, clear chapter links, and consistently aligned chapters. Preserve all diagrams, source disclosures, telemetry playback, original test-result controls, warnings and limitations. Use a coherent heading hierarchy.

### Navigation and fallback

Subsystem selection updates a shareable URL without adding an intermediate hub. Existing `#avionics`, `#structure`, `#tms`, `#control`, `#recovery`, chapter anchors and `?test=...#test-results` open the correct PSLV subsystem and target. Existing `#vehicle`, `#systems` and `#flights` remain meaningful.

Browser Back/Forward, refresh and language switching restore the selected system and any nested target. Clicking a subsystem keeps the user at the workspace rather than returning to the project heading. Chapter navigation clears the sticky header. Avoid conflicting scroll handlers between project selection, subsystem selection and existing engineering deep links.

Without JavaScript, all subsystem material and source links remain readable and chapter anchors remain usable. Keyboard users can operate the desktop navigation and mobile selector with visible focus. Hiding a subsystem must not leave active keyboard focus trapped inside it.

## 2. Combined About & Support page

### Canonical route and information order

Use `about.html` and `ko/about.html` as the canonical pages, with navigation labels `About & Support` and `소개·후원`. Use one page-level heading.

Order the content as follows:

1. A brief PSI introduction, prominent support action and visible contact email.
2. Clear support options: funding, materials, equipment and technical collaboration.
3. General contact information and the compact E-06 building map.
4. Leadership/advisor, organisation, participation information and founding background.
5. Existing supporters and their official links.
6. The laboratory team photograph currently at the beginning of About, moved to the final content position before the footer.

The primary support action is labelled `Support PSI` / `PSI 후원 문의` and clearly opens an email enquiry to the confirmed address with a support-related subject. The email itself stays visible and selectable. A short nearby explanation makes clear that this is an enquiry, not an on-site payment form.

Support options are concise text, not speculative benefits or four oversized cards. The optional existing email draft form remains a secondary disclosure. Preserve validation, enquiry type, draft invalidation after edits, and the statement that the site does not send messages. Avoid duplicating the contact email in several visually competing channel blocks.

Support information precedes sponsor recognition. The opening email action must be visible within a 390×844 mobile viewport and a 1280×720 desktop viewport. The map remains compact; keep the exact building context, direct map fallback, address, and request to email before visiting.

Keep the existing named leaders, faculty advisor, Finance function, founding dates, recruitment caveats and source links. Preserve founder and field photographs with their natural proportions; they must not push the support entry below the fold. Move, rather than delete, the original laboratory team image, and load it lazily in its new final position.

### Compatibility

`support.html` redirects to `about.html#support` and `contact.html` to `about.html#contact`, with equivalent Korean routes. Preserve query parameters. Preserve valid explicit fragments such as contact, campus and supporter anchors; provide compatibility anchors where existing links would otherwise break. Update canonical internal navigation to the combined page rather than requiring a redirect hop.

Existing join/learning aliases continue to reach `about.html#participation`. News/Gallery and engineering aliases retain their current destinations. Redirect pages keep a useful ordinary link and no-JavaScript fallback.

## 3. Header identity and navigation

Place the larger PSI wordmark at the left, with the authentic PSI emblem immediately beside it. The small POSTECH wordmark moves to the far-right affiliation position, after navigation and theme/language controls. All marks retain their proportions and original assets; do not redraw or distort them.

The desktop order is PSI wordmark, PSI emblem, Projects/Research/Records/Gallery/About & Support, theme/language controls, POSTECH. Keep Projects' existing accessible dropdown behavior and correctly aligned chevron.

The emblem is visible between the PSI and POSTECH marks but remains associated with PSI, not confused with a menu action. Avoid duplicate adjacent home links with identical accessible names where a single combined identity link will suffice.

Responsive layout may use two compact rows at the narrowest widths instead of shrinking marks or touch targets excessively. POSTECH remains right-aligned in the branding row, PSI remains the primary identity, and the mobile menu can still be closed with Escape without leaving the document inert. Theme and language controls stay available.

## 4. Home purpose and content

Retain the full-width launch film and the existing natural PSLV/Aircraft programme imagery. Present the identity statement outside the playing-video overlay so it remains visible as text when the film starts:

English headline: `Student-led aerospace engineering at POSTECH.`

English supporting text: `We learn by designing, building and testing rockets and aircraft—and sharing what we find.`

Korean headline: `포스텍 학생들이 만드는 항공우주 기술`

Korean supporting text: `로켓과 항공기를 설계하고 제작하며, 시험으로 배우고 그 과정을 공유합니다.`

Maintain one h1. Keep the real launch as the primary visual, not an ornamental background for excessive copy. Preserve title/control readability at all sizes without reintroducing sidebars or cropping the footage.

After the identity, retain the PSLV and Aircraft previews with their direct project destinations and photo reel behavior. Remove only the standalone Home Research and Test Results promotional sections. Their full content remains in Research, Projects and Records, and their primary navigation links remain available.

Finish with one compact support invitation linking directly to `about.html#support`. No new statistic tiles, news feed, award counter, generic value cards or additional large photo block. Removed Home member/activity sections remain removed.

## 5. Supporter logos

Remove the separate tinted supporter-list surface and any logo-tile background. Marks sit directly on the page canvas. Use the existing appropriate light/dark assets; preserve original colours and contrast. If an asset has an opaque background, use a suitable existing variant rather than a filter that changes its brand colours.

Size marks optically, not merely with identical bounding boxes. Keep organisation labels, their official links and all four supporters. Verify both light and dark modes for rectangular background seams and clipping. No new logos are fabricated.

## 6. Compact footer

Replace the separate large link, identity and lower branding bands with one continuous theme-aware gray footer. One compact top row contains the institutional identity, practical navigation and contact/social links; a smaller second row contains copyright, privacy and back-to-top.

Keep PSI emblem, PSI wordmark and POSTECH mark; remove redundant branding whitespace and duplicated mission prose. Preserve useful links and correct language destinations.

At desktop widths 1280 and 1440px, target 150–175px total height, compared with the observed current 374px. Mobile reflows to a compact layout while preserving 44px touch targets and legible text. No fixed-height clipping or hidden overflow is allowed to manufacture a smaller measured footer.

## Implementation boundaries

Canonical composition and routing live in `templates.mjs` and `content.mjs`. About/Support, institutional chrome, and subsystem rendering should have focused helpers rather than further enlarging the single HTML return expression in `templates.mjs`.

The existing `support-page.mjs`, `people-view.mjs`, `program-pages.mjs` and embedded `engineering-pages.mjs` supply content. `site.js` owns interaction and URL reconciliation; `program-pages.css` owns the current page-level layout overrides. Remove superseded targeted rules rather than stacking contradictory selectors on them.

Generated HTML, root CSS/JS and `release.json` are rebuilt/exported only through the existing tools. Do not hand-edit generated root HTML. Tests may be updated only where an old design assertion is explicitly superseded here; keep the behavior coverage intact.

## Acceptance and verification

- Write browser regressions first for stable subsystem geometry, working subsystem selection/deep links/history, merged routes, visible support entry, final team-image position, shared supporter background, header order and reduced footer height. Observe failures on the current site before implementation.
- Test both languages at 320, 390, 768, 1280, 1440 and 1920px where applicable; check light/dark themes, long Korean labels and reduced motion.
- Verify chapter links, direct result trial links, keyboard focus, Back/Forward, refresh, language switch, unknown fragments and no-JavaScript fallbacks.
- Verify email draft validation and editing invalidation without sending mail; verify map fallback when the external embed is unavailable.
- Compare protected content inventories and retain existing photograph-composition and media behavior tests.
- Run the complete `docs/launch-site/check.cjs` suite, results checks, visual-layout matrix, asset checks and deterministic release check. Run `git diff --check`.
- Review actual desktop/mobile screenshots, including an expanded Avionics chapter, Combustion results, the combined page opening/closing, the Home identity during playback, both logo themes and the compact footer.
- Refresh the existing preview only after build/export. Report any test failure or limitation; do not describe unverified behavior as complete.

## Design review

The design is deliberately scoped to presentation, navigation and support discoverability. It does not add financial infrastructure or rewrite scientific content. The approved intent is covered by all six sections, compatibility routes have explicit destinations, and no essential engineering or group information is deleted. The remaining prerequisite is the user's review of this written specification before preparing the implementation plan.
