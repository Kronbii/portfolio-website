# Consolidated acceptance fixes

The first live-browser acceptance pass found material issues. Fix all of them in one batch. Preserve the additive-only boundary: modify only files that were created on this branch; do not touch any file from the base commit.

## 1. Dynamic routes are broken in Next.js 16

Every dynamic detail page currently returns 404 in `next dev`. Browser console evidence:

`Route "/projects/[slug]" used params.slug. params is a Promise and must be unwrapped with await or React.use()`

Update the props and both the page and `generateMetadata` implementations for project, writing, and topic dynamic routes to follow Next.js 16 asynchronous params. Verify actual HTTP/DOM output in `next dev`, not only `next build`.

Acceptance:

- `/projects/360-spherical-panorama-stitching` returns the intended page, not 404.
- `/writing/building-a-360-panorama-stitcher-from-a-phone-sweep` returns the intended article.
- `/topics/computer-vision` returns the intended hub.
- Canonical metadata is route-specific.
- Ready routes are indexable; review routes such as `/projects/omnisign-lebanese-sign-language` and `/writing/building-real-time-lebanese-sign-language-translation` emit `noindex, nofollow`.
- JSON-LD scripts are present on successful dynamic pages.

## 2. Dead topic links

Project records include topical labels that do not have eligible hub routes, such as `robotics`, `infrastructure-inspection`, `health-technology`, `document-intelligence`, `information-integrity`, `full-stack-systems`, `education-technology`, `lebanon`, `frontend-engineering`, `flutter`, and `product-engineering`.

Do not link those labels to 404 pages. Keep the labels if useful, but render a link only when `getTopic(slug)` resolves to an implemented hub. Apply the same rule everywhere a topic label or recommendation renders.

## 3. Existing header anchors are broken on subpages

The incumbent header uses fragment-only hrefs such as `#home`, `#about`, and `#selected-work`. On `/projects`, `/writing`, and `/topics`, those links target nonexistent sections on the current route.

Without modifying the incumbent header or any existing file, add a small authority-route client bridge loaded only by the new authority pages that rewrites those header/navigation fragment hrefs to `/#home`, `/#about`, `/#experience`, `/#selected-work`, `/#community`, and `/#contact`. Do not rewrite breadcrumbs or local section anchors.

Acceptance: on an authority page, the visible header's Home/About/Experience/Work/Community/Contact link hrefs resolve to the homepage fragments.

## 4. Remove banned visual defaults

The accepted surface brief and craft floor prohibit eyebrow/kicker labels and decorative section numbering.

- Remove `pageKicker` output such as “Engineering record,” “Project · ...,” “Essay,” and “Topic hub.”
- Remove the `AuthoritySection` eyebrow labels such as “Plain-language answer,” “Mechanism,” “Measurements,” “Artifacts,” “Limits,” “Evidence and links,” “Cross-links,” “Questions this page answers,” and similar. Keep the meaningful section title.
- Remove decorative project-list sequence numbers `01` through `11`.
- Preserve useful role/credit information by placing it in normal supporting copy near the project title, not as an all-caps eyebrow.
- Remove Unicode arrow glyphs used as icons. Link text should describe its action without a substitute glyph.
- Do not weaken headings or remove meaningful content while doing this.

## 5. Re-verify the rendered pages

Run `npm run build`, ESLint against new files, and the additive-only diff check. Then start or reuse a dev server and verify the three ready routes and two review routes named above with real HTTP/rendered output.

Update `docs/geo/claude/IMPLEMENTATION_REPORT.md` with the fix evidence. In the terminal response, report each resolved item and the exact live-route checks.
