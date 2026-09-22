# POSTECH AeroSpace Initiatives

The bilingual PSI website: [English](https://postech-psi.github.io/psi-website/) · [한국어](https://postech-psi.github.io/psi-website/ko/index.html).

Fourteen routes in each language (28 generated pages, plus two Contact redirects) cover immediately switchable full PSLV and Aircraft panels, five current studies, fifteen historical research/award records, photo News, About and Support & Contact. The Projects navigation dropdown opens PSLV or Aircraft directly; old project URLs redirect there. The interface uses the authentic PSI logo in the header and footer, field photography/video and self-hosted Pretendard. Project descriptions distinguish implemented, configured and verified behaviour, with links to pinned repositories and the actual [test-results portal](https://postech-psi.github.io/test-results/).

## Edit and preview

The editable source is `docs/launch-site/`, not the generated root HTML. Content is in `content.mjs`, `current-research.mjs` and `gallery-data.mjs`; layout is in `templates.mjs`, `program-pages.mjs`, `archive-view.mjs`, `reel-view.mjs`, `engineering-pages.mjs` and `support-page.mjs`; styling and interaction are in `site.css`, `program-pages.css` and `site.js`. See [the source guide](docs/launch-site/README.md) for media provenance and detailed behaviour.

```sh
node docs/launch-site/build.mjs
python -m http.server 8767 --bind 127.0.0.1 --directory docs/launch-site
```

Open `http://127.0.0.1:8767/ko/index.html`. The English entry is `/index.html`.

## Verify and export

Install the pinned Playwright dependency (1.62.1) and its default Chromium browser once, then run with the preview server running:

```sh
npm ci
npx playwright install chromium
node docs/launch-site/check.cjs
npm run test:results
node docs/launch-site/check-structure.cjs
node docs/launch-site/check-media-visual.cjs
node docs/launch-site/check-assets.mjs
node tools/check-release.mjs
node tools/export-launch-site.mjs path/to/staging
```

Browser checks import the declared `playwright` package and use Chromium by default. To use installed Edge, set `PSI_BROWSER_CHANNEL=msedge`. Set `PSI_URL` to your preview origin (default port 8767); `check-structure.cjs` uses `PSI_BASE_URL` with a trailing slash. All paths work beneath `/psi-website/`. The Node-only build and export checks have no package dependencies.

The TMS view ports the original results module, data, fonts and controls from the pinned `postech-psi/test-results` source. `docs/launch-site/assets/results/source-lock.json` owns its immutable export allowlist and digests. Edit site integration in `test-results-view.mjs`; do not change the locked results engine or create a second metric catalog. `npm run test:results` checks source parity and real browser behavior. The separate public portal remains an attribution link.

Inspect the staging export before publishing; run `node tools/export-launch-site.mjs` without a destination only for the intended root release.

The exporter verifies generated HTML against the renderer and copies only public pages, runtime files, referenced media and the font license. `release.json` records deterministic SHA-256 digests. Tests, review files, source manifests, internal documents and removed spring-event media are not exported. Unrelated root files are preserved; an unowned or hand-modified destination is rejected. Make edits in the source and re-export, rather than editing root output.

## Deployment

GitHub Pages uses the existing `main` branch/root Jekyll configuration. Commit the verified source **and** root export, then push `main`. The `pages build and deployment` workflow must finish successfully, and the public `release.json` revision must match the local one before considering a release deployed.

Legacy source Markdown is retained but conflicting pages are excluded in `_config.yml`. Old Team and Events addresses redirect to About and News. Both `contact.html` and `ko/contact.html` redirect to `support.html#contact`; the Contact form only prepares a visitor-owned email draft and does not submit to a server. The printed POSTECH campus address and official map remain available if the approximate embedded map fails. `/assets/` has a no-index landing page rather than a listing. The existing Jekyll Shop, layouts and shop assets remain available at `/shop`; no checkout or fulfilment behaviour was changed.

To preview the complete Jekyll output, including Shop, use the existing `Gemfile`: `bundle install` then `bundle exec jekyll serve`. Source-only static previews do not render the legacy Shop.

## Recovery

Before a release, record the current remote `main` SHA. If an essential route, navigation, theme or media flow fails after deployment, inspect the Pages workflow and failed request first. A rollback is a normal Git revert of the release commits followed by a regular push; never reset or force-push shared history. The last pre-redesign production commit was `076d52832c77c4c7d8747a3ee7625a6b677767b1`.

Original files and the isolated design worktree are retained for recovery. Older generated visuals remain only as legacy assets; the redesigned pages use the real PSI media.
