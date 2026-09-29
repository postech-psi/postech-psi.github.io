# POSTECH AeroSpace Initiatives

Publish-ready PSI website: [English](https://postech-psi.github.io/psi-website/) · [한국어](https://postech-psi.github.io/psi-website/ko/index.html).

## Files

- Root HTML and `ko/`: public English and Korean pages, including legacy redirects.
- Root CSS, JavaScript and `assets/`: styles, interactions, media, fonts, flight data and licensed runtime dependencies.
- `shop.md`, `404.html`, `_includes/`, `_layouts/`, `_sass/` and `assets/css/` / `assets/js/`: Jekyll Shop and error-page support.
- `_config.yml` and `Gemfile`: GitHub Pages / Jekyll configuration.
- `release.json`: SHA-256 inventory of the current static release.

## Edit and publish

Edit the public HTML, CSS, JavaScript and assets directly. Update both language versions when changing shared content. There is no Node build or package installation step.

GitHub Pages publishes from the `main` branch root using Jekyll. Commit and push reviewed changes, then verify the Pages deployment. To preview the complete site locally, install Ruby and Bundler and run:

```sh
bundle install
bundle exec jekyll serve
```

A plain static server can preview the HTML routes, but does not render the Shop or Jekyll error page.

If a file listed in `release.json` changes, update its SHA-256 and byte count. The revision is the SHA-256 of the compact JSON serialization of the sorted `files` array.

Keep bundled licenses and source attribution with their assets. The `assets/results/upstream/tests/` directory contains public combustion-test measurements used by the site.

Development generators, duplicate previews, test scripts and design notes are no longer part of this publishing repository. Earlier versions remain in Git history.
