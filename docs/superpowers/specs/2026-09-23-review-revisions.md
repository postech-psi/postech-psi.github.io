# PSI Review Revisions Specification

## Purpose

Apply the decisions from the 21 September design review and the later request for a Hanaro-inspired sponsorship, contact and map area without reintroducing a directory-style Projects hub. Preserve the bilingual static build, current evidence-backed content, compatibility URLs, accessibility and the reviewed PSI visual identity.

Reference: [HANARO, Seoul National University Rocket Club](https://hanaro.snu.ac.kr/) — its page groups current sponsors, ways to support the team, enquiry steps, direct contact and a campus map. Reuse the information pattern, not its claims, account details, copy or artwork.

## Projects and navigation

- `projects.html` is the canonical project experience, not a hub that adds another click.
- The page exposes `PSLV` and `Aircraft` as accessible tabs. Selecting a tab replaces the visible project content immediately; no `Explore PSLV` or `Explore Aircraft` step is required.
- Each tab contains the corresponding complete project content. PSLV retains flight media, vehicle systems, Avionics, TMS results and flight history. Aircraft retains its current aircraft and related-research content.
- The selected project is addressable with `#project-pslv` or `#project-aircraft`. A hash that points to a descendant such as `#avionics` also activates the owning project panel.
- The top navigation keeps `Projects` as a main destination, adds a bilingual project submenu with direct links to both project tabs, and adds a visible `Support & Contact` / `후원·문의` destination. There are six main destinations after this addition.
- Desktop pointer hover and keyboard focus reveal the submenu. Touch and mobile users use an explicit toggle. Escape closes it and returns focus; outside click closes it; reduced motion removes transitions.
- Existing `pslv.html` and `aircraft.html` URLs remain compatibility redirects to the appropriate Projects state. Existing PSLV fragments and test-result queries must still open the correct in-page section.
- No-JavaScript visitors see both project sections in document order and can follow ordinary hash links.

## Homepage media

- The launch film must show its complete frame instead of cropping the lower edge.
- Pad/onboard switching must reserve stable geometry so the page does not jump vertically.
- The current two-view selector remains until a separately edited composite film is supplied; the review recordings do not provide an editable source suitable for producing that composite.
- Existing autoplay, pause, Save-Data, reduced-motion, visibility and native-control behavior remains intact.

## Research, Records and News

- Remove decorative jump-link/category strips that make pages look like nested folders: the current-study strip on Research, the section jump strip on Records and the album jump strip on News.
- Keep Records as the complete dated archive for tests, flights, conference work and awards.
- Keep the Records topic/type/search form because it operates on fifteen records and supports archive retrieval; present it as an archive tool rather than a row of category chips.
- News remains photo-led. The award photograph becomes a dated News gallery event while its factual award entry remains in Records.
- Removing the album jump strip must also collapse its reserved spacing; single-photo events must not leave a large empty column or unexplained vertical gap.
- Gallery photographs use the existing accessible modal consistently. Non-gallery editorial images remain ordinary figures or full-size source links and do not display a video-play affordance.
- Every gallery thumbnail must have an image action only; no video icon or media-type ambiguity is allowed.
- Apply the existing pointer tilt/hover motion consistently to every intentional editorial photograph marked for motion, rather than relying on a partial CSS selector list. Static diagrams, logos and screenshots do not tilt. Reduced-motion and coarse-pointer users receive a still image.

## About, organisation and participation

- Replace the current organisation card grid with a bilingual table that keeps Research division, Competition teams, Equipment & workspace, Finance, Communication & community and Education.
- Preserve the Finance wording about managing the budget and recording expenses.
- Remove the `Joining and participating`, `Membership questions`, and `Education and notebooks` sections.
- Retain the concise recruitment block and official channels.
- Official channels include Instagram, GitHub, the public introduction and the repository-listed president contact `uikangee@postech.ac.kr`; confirm the mailbox owner before publication.
- Supporter logos stay unmodified, move to the last About section immediately before the global footer, and retain their source links.

## Support, contact and location

- Add one bilingual canonical `support.html` page, reachable from the main navigation and footer. It combines the current four supporters, an invitation to discuss support, an enquiry route, direct contact and a campus map. `Contact` is an anchor on this page, not another navigation level.
- Use the same four approved supporter logos and links already present on About. The existing About supporter band remains its final content section; both appearances render from one shared data source so names and links cannot diverge.
- Explain possible support as a discussion of funding, equipment/materials or technical collaboration. Do not publish an account number, tax-deduction claim, guaranteed logo placement or other sponsor benefit without PSI-approved terms.
- Offer a short enquiry form that opens the visitor's own email application with the enquiry details. Label the action as opening an email draft and provide the president email as a direct fallback; do not suggest that the site sends or stores the message.
- Use `uikangee@postech.ac.kr` from the current repository configuration as the proposed PSI contact, subject to a pre-publication ownership check; do not add personal phone numbers or unverified social accounts.
- Show the official POSTECH campus address, `경상북도 포항시 남구 청암로 77 (37673)` / `77 Cheongam-ro, Nam-gu, Pohang-si, Gyeongsangbuk-do 37673`, alongside an embedded campus-area map and a link to POSTECH's official campus map/directions. Label the map as POSTECH campus, not a confirmed PSI room or office.
- The address and direct contact remain usable as text and links if the third-party map does not load or JavaScript is disabled. Lazy-load the map and give its iframe a descriptive bilingual title.
- The legacy `contact.html` address redirects to `support.html#contact` in both languages; `join.html` continues to lead to About participation. If the repository-listed mailbox is no longer monitored, replace it with an approved PSI address before deployment.

## Footer and brand

- Every canonical page displays the actual `psi-logo.png` in the global footer, including at the visual bottom of the page. Text-only `PSI` is not a substitute.
- The footer logo links home, has useful alternative text, keeps its original proportions and remains legible in both themes and at 320–1440 px.

## Static assets and copy

- `/assets/` must render a deliberate no-index landing page with a link back to the site instead of exposing or implying a browsable file directory.
- The release exporter includes that page deterministically and continues to export only allow-listed assets.
- English interface copy uses British spelling consistently because existing public project copy uses `programme`. Proper nouns, source titles and quoted publication titles are not rewritten.
- Generated root files are never edited directly. All changes originate in `docs/launch-site`, are rebuilt, verified and exported.

## Acceptance criteria

- English and Korean Projects tabs switch content immediately, update the hash and restore the correct panel on direct load/back/forward.
- The sixth main navigation destination opens `support.html`; its contact anchor is reachable from About and the footer, and old `contact.html` links land at `support.html#contact`.
- Desktop and mobile project submenus are keyboard- and touch-operable and never trap focus.
- Old project URLs and deep links resolve to the canonical Projects page without losing their target.
- Homepage pad and onboard frames are not cropped and changing view does not shift following content by more than one CSS pixel.
- Removed About sections and page-level jump strips are absent in both languages.
- Award photography is available in the News lightbox while award facts remain in Records.
- Supporters are the final About content block and the image PSI wordmark is present in every footer.
- The support page shows all four approved supporter identities, a truthful email-draft form, the direct email, the official campus address and a titled map with a working directions fallback.
- `/assets/` returns the deliberate landing page in preview and release output.
- No horizontal overflow, broken media, browser exceptions or regressions in TMS/telemetry behavior occur at 320, 390, 768 and 1440 px.
