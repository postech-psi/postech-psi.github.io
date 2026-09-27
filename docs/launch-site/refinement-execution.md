# Whole-site refinement — 2026-09-25

Approved direction: restrained, hardware-led editorial design. Work on main; preserve existing changes. No commit or publication requested.

## Execution ledger

- [x] Regression checks: heading alignment, viewport fit, filter history, email drafts, gallery ordering.
- [x] Shared hierarchy, spacing, icons and footer refinement.
- [x] Home programme consolidation and hardware-only imagery.
- [x] Projects: consolidate systems; retain all technical records and deep links.
- [x] Research and Records: concise presentation, persistent filters, preserved evidence.
- [x] Gallery: chronological, compact, accessible image viewer.
- [x] About and Support: concise copy, compact people/contact/map, sharp supporter assets.
- [x] Build/export, browser regression suite, desktop/mobile/light/dark visual verification.
- [x] Independent final review and fixes.

Preserve: immediate project/Records tabs, Projects dropdown, all dates/results/limitations, 5 current studies, 15 research records, 14 gallery photographs, confirmed email and Wind Tunnel location, PSI/POSTECH marks.

Excluded: PIP/onboard video editing, fabricated artwork/data, changes to upstream numerical test artifacts, deletion of original assets, commit/push.

## Verification results

- Full `check.cjs` browser regression suite passed: bilingual routes, navigation, media playback, filter state, accessibility, email drafts and map fallback.
- `check-test-results.cjs` passed all four trials, chart controls, theme, subpath, retry/no-JavaScript behavior and parity with the pinned original data/options.
- Final visual matrix passed 140 route/locale/theme/viewport checks and eight expanded-system layouts. Screenshots were reviewed for all seven main pages and Korean mobile/dark layouts.
- Final visual review found a two-row gallery span reserving empty space and a legacy research border touching text. Added failing regressions, corrected both CSS rules, then reran refinement, visual, current-content and Gallery interaction checks successfully.
- `check-structure.cjs`, `check-title-layout.cjs`, `check-assets.mjs`, `tools/check-release.mjs`, `tools/sync-test-results.mjs --check` and `git diff --check` passed.
- Final exported revision: `d47fc9b9c3ff28fe632c721fdebe1f568e830551d414e43e2647a213e181f62d` (111 managed files).
- Existing Support preview refreshed at `http://127.0.0.1:8874/support.html`.

## Review disposition and limitations

Independent review approved after correcting literal `q=all` URL persistence and aligning the new checker default port with the existing suite. Existing deep links and scientific caveats remain intact. Final CSS-only visual corrections were verified by dedicated regression and screenshot checks.

Email behavior prepares a draft for the visitor's email application; no message was sent and no server-side delivery is claimed. External map uptime is not guaranteed; the building address and direct campus/building links remain usable when embedding fails. No new scientific validation, video editing, commit or publication was performed.

## Photo-composition correction requested by the user

The user rejected the compact uniform photo layout and approved restoring the earlier natural/gallery-like composition throughout. Restored the portrait Home reel, alternating programme/research visuals, side-captioned Gallery albums and varied launch spread, plus natural photo proportions in Projects/About. Retained chronology, concise copy, functional improvements, removed sections, original assets and all data. The launch composition follows its event ID even when newer albums precede it.

Added `check-photo-layout.cjs`; observed the old layout fail its portrait, alternation, side-caption and natural-ratio checks in both languages, then verified the corrected layout passes. The 140-layout/eight-expanded-system matrix and deterministic release export also pass. Full-suite and final review disposition recorded after completion below.

- Full `check.cjs` passed after the photo restoration, including all 28 bilingual routes and existing interaction/media checks.
- Independent scoped review approved with no actionable findings; an additional 751px EN/KO check confirmed all reel captions/controls fit and Home/Gallery/Research do not overflow.
- Review scope exclusions accepted: pre-existing copy/removals and scientific accuracy were not re-audited; HEAD was a composition reference rather than a pixel-identical rollback, since unrelated authorized changes must remain. Parent ran the complete interaction suite.
- Updated Home preview refreshed. Current exported revision: `754cf29ffe185d1ccf8380b297fc24a85538b1677ed09a592a596c5317a1967c`. No commit or push.

## Home film framing correction

The user approved an edge-to-edge, natural 16:9 Home launch film instead of the height-capped desktop frame that produced black side gaps. Removed only the Home height cap; preserved photo compositions, Projects, media controls and playback behavior. On wide screens the player can extend below the initial viewport. The portrait onboard source remains contained, uncropped, in the stable player.

- Updated the Home regression first and observed the old height cap fail in both languages. The corrected geometry passes at 390, 768, 1440 and 1920px, including viewpoint switches. Document coordinates distinguish layout shifts from the normal scroll needed to reach the tabs.
- Actual launch playback verified as 1920×1080 in a 1920×1080 displayed frame. Reviewed wide-screen footage and mobile screenshots; refreshed the existing Home preview.
- Full `check.cjs`, the 140-layout/eight-expanded-system visual matrix, deterministic release export, asset checks and `git diff --check` passed. Photo-layout regressions remain green.
- One export encountered a transient file-access error on `index.html`; the unchanged export command succeeded on retry and the release consistency check passed. No export-code change was needed.
- Exported revision: `6affa7d392b737c065cce41d725c44dd62d16e6fb743862acf4e416a07781bec`. No commit or push.

## Footer and supporter completion — 28 September 2026

The user approved the footer grouping and authorized committing and pushing the accumulated website changes on main. This supersedes the earlier implementation-only restriction above; unrelated local research notes and screenshot output remain outside the commit.

- Footer identity is POSTECH → PSI emblem → PSI wordmark, with privacy beneath. Navigation and the single-line Email/Instagram/GitHub row form the second responsive group on the same gray surface.
- Added owner-confirmed KAI and replaced the displayed MATLAB text artwork with the original full-color MathWorks lockup, captioned MATLAB (MathWorks). Unmodified light/dark originals, provenance and SHA-256 checks are retained. All five supporter entries share a transparent surface.
- New footer regressions were observed failing before implementation. Supporter tests exposed insufficient logo height at 1200px; removing inherited artwork padding corrected it without altering original images.
- Fresh full `check.cjs` passed all 28 bilingual routes. Supporter checks passed 20 locale/theme/width combinations; footer geometry passed six widths in both locales. Original results integration and controls, all trials, theme, Korean/subpath, retry and no-JavaScript checks passed.
- Asset, structure, deterministic release and whitespace checks passed. Release revision: `a447fc18ab267d8ef60c2b5e1b893f9f17c107a7f7f7429a6114ad1f7b14df52` (114 managed files). Desktop/mobile footer and light/dark supporter screenshots were inspected.
- Independent focused review found no actionable footer/supporter issue. Earlier information-design and photo-composition reviews remain recorded above and in the approved implementation plan.
