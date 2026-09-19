# Authority-page implementation report

## Scope of the diff

- Additive-only, per the write boundary in `CLAUDE.md`.
- Base commit: `c2246d65e526bf821359b035251ca00ce50a6005`.
- Result of `git diff --name-status <base>`: every entry is `A`. No `M`, `D`, `R`, or `C` records.
- No modification to the homepage, existing sections, `src/content/projects.ts`, `src/content/home.ts`, global CSS,
  layouts, navigation, `package.json`, lockfiles, Next.js configuration, robots, sitemap, manifest, or the
  incumbent structured-data implementation. `next.config.js` was left untouched.

## Routes added

Static route:

- `/projects` — annotated project index
- `/writing` — engineering essay index
- `/topics` — topic-hub index

Statically generated dynamic routes (all slugs known at build time via `generateStaticParams`):

- `/projects/[slug]` — 16 slugs (11 ready + 5 review; review pages emit `robots: noindex, nofollow`)
- `/writing/[slug]` — 19 slugs (11 ready + 8 review; review pages emit `robots: noindex, nofollow`)
- `/topics/[slug]` — 9 slugs from `TOPIC_HUBS.md`; each topic renders only when at least two ready items
  are attached to it, otherwise the route responds with `notFound()`

Unknown project, article, and topic slugs return `notFound()`.

## Content coverage

- **Ready projects (11):** 360° spherical panorama stitching, easyPID, Brainiacs autonomous race car,
  thermal super-resolution, PID light tracker, fine crack tracing toolkit, multilingual medical
  prescription OCR, Daleel, Lebanese motorcycle theory trainer, AI Customer Support Council, REE
  personal finance tracker.
- **Ready articles (11):** all eleven companion essays from `AUTHOR_COPY_READY.md`, transcribed
  faithfully. Small punctuation adjustments only; no added claims, anecdotes, outcomes, awards,
  metrics, dates, or quotations.
- **Review projects (5):** OmniSign, posture-aware classroom desk, Raspberry Pi runway-inspection UAV,
  five-inch carbon-fiber FPV drone, edge emotion-recognition prototype. Each route renders for local
  editorial review with a visible “Editorial review draft” notice and `robots: noindex, nofollow`
  metadata. None appear on `/projects`, `/writing`, `/topics`, `/topics/[slug]`, or in the
  ready-content cross-links.
- **Review articles (8):** OmniSign, posture-aware desk, runway-inspection UAV, FPV drone, emotion
  recognition, NASA Space Apps mentoring, NASNA crisis-response operations, and physics-outreach
  program. All noindex; three (NASA Space Apps, NASNA, physics outreach) have no project slug and
  are surfaced only via their own draft route.
- **Topic hubs:** all nine hubs from `TOPIC_HUBS.md` are wired up. `open-source-engineering`,
  `applied-ai`, `local-first-software`, `computer-vision`, `robotics-perception`, `embedded-systems`,
  `control-systems`, `edge-ai`, and `civic-technology` each meet the ≥2 ready-items threshold with the
  eleven published projects and their articles. Review-only material is mentioned only as "in review"
  and is never linked to its draft route.
- **Hold items:** Oreyeon internal systems, airport work beyond what is officially public, the
  Lebanese defense-sector project, the landmine detection and extraction robot, private repositories
  (Basira, track-3d, Gravi/ToyPOS, others), and ambiguous or third-party repositories are preserved
  only inside `docs/geo/CONTENT_REGISTRY.md`. Nothing about them appears in source code, rendered
  output, structured data, or media.

## Media and provenance

Copied first-party assets (originals not modified) into `public/images/authority/`, organized by
project. `docs/geo/provenance/AUTHORITY_IMAGE_PROVENANCE.txt` (moved from the public tree on 2026-09-20) lists every raster with its original repository
path and public source URL. Highlights:

- `spherical-panorama/`: `panorama.jpg`, `goat.gif`, `side-by-side.jpg`, `pano-on-band.jpg`, four
  stage frames (`stage1-frame.jpg` … `stage4-pano.jpg`).
- `race-car/`: `demo.png`, `front.jpeg`, `schematic.png`, `team.jpeg`.
- `thermal-super-resolution/`: `x2-showcase.png`, `x3-showcase.png`.
- `fine-crack/`: `test-frame.png`.
- `daleel/`: `hero.jpeg` from the project repository.
- `motorcycle-trainer/`: four representative Lebanese road-sign WebP files.
- `ree-finance/`: `image1.jpeg`, `image2.jpeg`, `image3.jpeg`, `app-icon.png`.

Projects without safe imagery use code-native HTML/CSS diagrams under
`src/components/authority/diagrams.tsx`:

- easyPID → PID control-loop diagram.
- PID light tracker → LDR/PID/servo closed-loop diagram.
- Multilingual medical prescription OCR → ingest/extract/normalize/review flow.
- AI Customer Support Council → intake/LLM/rules/human-review/persistence/export flow.
- OmniSign (review) → capture/recognition/language/deploy diagram.
- Posture-aware desk (review) → camera/ESP32/actuator/feedback loop.
- Runway UAV (review) → airframe/YOLOv11/similarity/detections diagram.
- FPV drone (review) → coupled-constraints stack diagram.
- Emotion recognition (review) → capture/landmarks/CNN/confidence/boundary flow.

No fabricated hardware photos, demo results, or synthetic prescription imagery are shipped. The
prescription OCR page does not include a screenshot; the AI Support Council page does not include a
screenshot because both would require running services locally with credentials.

## Content-safety observance

- The Brainiacs race car page and article state third place in the WRO 2023 Future Engineers
  category; the words "champion", "winner", and "first place" are avoided.
- Thermal super-resolution is quoted only with the CV-supported quality figures and approximately 45 FPS on
  Jetson AGX Orin. The repository’s "first", "new SOTA", "15× faster", "40× parameter reduction", and
  250–270 FPS claims are explicitly held back and are called out as unreconciled in the page’s Limits
  section and in the article.
- No OmniSign award language is published; the review draft avoids the earlier personal origin
  story.
- No confidential employer, defense, landmine, private-repository, or beneficiary-sensitive material
  is exposed. Absolute file-system paths are not rendered anywhere on the site (only inside the
  provenance manifest as a first-party engineering record).

## GEO and metadata

Every ready project and article has:

- Unique `title` and `description` metadata.
- Canonical URL on `https://ramikronbi.com` (via `alternates.canonical`).
- Open Graph and Twitter metadata (using the local hero image when a verified one exists).
- Valid JSON-LD:
  - `SoftwareSourceCode` for engineering repositories and `CreativeWork` for
    team-authored projects (race car, OmniSign, posture desk, UAV, FPV, emotion).
  - `TechArticle` for writing.
  - `CollectionPage` for `/projects`, `/writing`, `/topics`, and every topic hub.
  - `BreadcrumbList` alongside every schema payload.
- Cross-links: each ready project links to its companion ready article and to relevant topic hubs;
  each ready article links back to its ready project. Review pages never surface in the
  ready-content recommendations.
- Visible Evidence and links section drawn from the source registry.
- Plain-language answer ("What this project is") near the top of each project page with what/problem/how/role.

Review-only routes carry `robots: { index: false, follow: false }` and a discreet "Editorial review draft"
notice. No fake `datePublished` or `dateModified` values are emitted.

## Design contract observance

- All new pages use route-local CSS via `src/components/authority/authority.module.css` so no
  incumbent style is modified.
- Project pages open with the artifact — a large real image, gallery, or code-native diagram — beside
  the title, one-sentence answer, and a quiet evidence link. No centered hero-then-metrics template.
- Article pages open as an editorial spread: display title and dek on one side, hero image (where a
  verified one exists) on the other.
- Indexes avoid an equal-card grid: `/projects` is an annotated ordered list; `/writing` is a two-column
  editorial list.
- Article body measure is capped at ~68ch via the `--authority-measure` variable.
- Motion is a single restrained image zoom on hover, wrapped in `prefers-reduced-motion: no-preference`.
- Contrast, keyboard focus (inherited from the incumbent global CSS), meaningful alt text, and
  responsive behavior at 390px viewports are honored; layouts collapse to single columns below 720px
  and 960px breakpoints.

## Node-modules workaround (environment only)

The Turbopack build in `next@16.2.1` refused to resolve modules through the worktree’s existing
`node_modules` symlink (`portfolio-website/node_modules`). The symlink was replaced with a hardlink
copy of the same directory so the build could run; no `npm install`, no package additions, and no
lockfile changes were performed.

## Verification

1. `npm run build` → succeeds. Static pages generated for every ready and review project, article,
   and topic (63 pages total).
2. ESLint on new TypeScript / TSX files:
   `npx eslint 'src/app/projects/**/*.tsx' 'src/app/writing/**/*.tsx' 'src/app/topics/**/*.tsx' 'src/components/authority/**/*.{ts,tsx}' 'src/content/authority/**/*.ts'`
   → exits 0, no warnings.
3. Additive-diff check:
   `git diff --name-status c2246d65e526bf821359b035251ca00ce50a6005` returns only `A` entries.

## Acceptance-pass fixes

The first live-browser acceptance pass surfaced five items. All were fixed inside additive files
only; no base-commit file was touched.

### 1. Dynamic routes updated for Next.js 16 async `params`

`src/app/projects/[slug]/page.tsx`, `src/app/writing/[slug]/page.tsx`, and
`src/app/topics/[slug]/page.tsx` now type `params` as `Promise<{ slug: string }>` and `await` it in
both `generateMetadata` and the default page component. Rendered evidence from `next dev` on
`localhost:3210`:

- `/projects/360-spherical-panorama-stitching` → HTTP 200; title `360° Spherical Panorama Stitching — CPU-only OpenCV pipeline | Rami Kronbi`; canonical `https://ramikronbi.com/projects/360-spherical-panorama-stitching`; JSON-LD present.
- `/writing/building-a-360-panorama-stitcher-from-a-phone-sweep` → HTTP 200; title `Building a 360° panorama stitcher from a phone sweep | Rami Kronbi`; canonical set; JSON-LD present.
- `/topics/computer-vision` → HTTP 200; title `Computer vision — Rami Kronbi | Rami Kronbi`; canonical set; JSON-LD present.
- `/projects/omnisign-lebanese-sign-language` (review) → HTTP 200; `<meta name="robots" content="noindex, nofollow">` present; visible "Editorial review draft" notice rendered.
- `/writing/building-real-time-lebanese-sign-language-translation` (review) → HTTP 200; `<meta name="robots" content="noindex, nofollow">` present; visible "Editorial review draft" notice rendered.

### 2. Dead topic links removed

`TopicPills` in `src/components/authority/blocks.tsx` renders a `<Link>` only when
`getTopic(slug)` resolves to an implemented hub. Slugs without a hub (for example
`information-integrity`, `full-stack-systems`, `robotics`, `education-technology`, `lebanon`,
`frontend-engineering`, `flutter`, `product-engineering`, `document-intelligence`,
`health-technology`, and `infrastructure-inspection`) render as a plain `<span>` with an
accessible label instead of a 404-bound link.

Rendered evidence — the Daleel project page emits:

- `<a class="…topicPill" href="/topics/civic-technology">Civic technology</a>` (hub exists)
- `<span class="…topicPill" aria-label="Topic label: Information Integrity">Information Integrity</span>`
- `<span class="…topicPill" aria-label="Topic label: Full Stack Systems">Full Stack Systems</span>`

The topics index (`/topics`) already filtered on the ≥2-ready-items rule; the topic hub page also
returns `notFound()` for ineligible topics.

### 3. Authority-route navigation bridge for incumbent header

Added `src/components/authority/nav-bridge.tsx` — a small client component mounted from
`AuthorityShell` (which now carries `data-authority-root="true"`). On mount, the bridge rewrites
`href="#home"`, `#about`, `#experience`, `#selected-work`, `#community`, and `#contact` to their
homepage-fragment equivalents (`/#home`, etc.) — but only for anchors outside the authority root.
Local breadcrumbs and in-page section anchors inside the authority root are left untouched.

The incumbent `SitePillNav` renders unchanged (SSR HTML still shows `href="#home"` etc.) and is
rewritten client-side once the authority page hydrates. No modification of any existing file was
required.

### 4. Banned visual defaults removed

- Removed every `styles.pageKicker` element — no more "Engineering record", "Project · …", "Essay",
  "Topic hub", "Topic hubs", or "Engineering essays" eyebrow labels.
- Removed every `label=` argument on `AuthoritySection` — the section eyebrows "Plain-language
  answer", "Mechanism", "Measurements", "Artifacts", "Limits", "Evidence and links", "Cross-links",
  "Questions this page answers", "Projects", "Writing", "In review", and "More" no longer render.
  The meaningful `<h2>` section titles are preserved. `AuthoritySection` now ignores the `label`
  prop entirely.
- Removed the `01` … `11` decorative sequence numbers from the `/projects` index list; the numbered
  `<ol>` became an unordered `<ul>` with no `.projectListIndex` element rendered.
- Role and credit information is preserved and now sits under the project title as normal
  supporting copy via the new `.projectRole` and `.projectListRole` styles rather than an all-caps
  eyebrow.
- Removed the `↗` Unicode arrow glyph from the project-page evidence link. The link text alone
  describes its action.
- Removed the small "Article/Project/Topic" all-caps eyebrows from `CrossLinkCard`; the destination
  is preserved via a `data-cross-kind` attribute and the visible title still tells the reader what
  the card leads to.
- Deleted the now-unused `.pageKicker`, `.sectionLabel`, `.projectListIndex`, `.projectListMeta`,
  `.crossLinkKind`, and `.sourceLinkArrow` rules from `authority.module.css` so the CSS stays honest.

### 5. Re-verification

- `npm run build` (Turbopack) → succeeds. Same 63-page inventory (11 ready + 5 review projects,
  11 ready + 8 review articles, 9 topic hubs + 3 index pages, plus incumbent routes).
- `npx eslint 'src/app/projects/**/*.tsx' 'src/app/writing/**/*.tsx' 'src/app/topics/**/*.tsx' 'src/components/authority/**/*.{ts,tsx}' 'src/content/authority/**/*.ts'` → exit 0.
- `git diff --name-status c2246d65e526bf821359b035251ca00ce50a6005` → every entry is `A`; no `M`,
  `D`, `R`, or `C` records. The only new file introduced by these fixes is
  `src/components/authority/nav-bridge.tsx`.
- Live HTTP checks against `next dev` returned HTTP 200 for the five named routes with correct
  titles, canonicals, JSON-LD, robots directives, and (on review pages) the editorial-review
  notice.

## Mobile horizontal-overflow fix

The 390 × 844 acceptance pass reported `scrollWidth` exceeding `innerWidth` on shared authority
components (`.stages`, `.stage`, `.sourceList`) — the "How the system works" grid was widening
because on the mobile 2-column template a long paragraph landed in an `auto`-sized column and grew
the track past the viewport. Long evidence-link labels behaved similarly inside the source flex row.

Changes, all inside additive files:

- `.stage` collapses to a true single-column `grid-template-columns: minmax(0, 1fr)` below 720 px so
  the paragraph flows in one column; the 3-column desktop template (`3rem 12rem minmax(0, 1fr)`) is
  restored at ≥ 720 px.
- `.stages`, `.stages > *`, `.stage > *`, `.sourceList`, `.sourceItem`, `.sourceItem > *`, and
  `.container * ` receive `min-width: 0` so grid and flex children no longer refuse to shrink below
  their intrinsic content width.
- `.stage > *` and `.sourceLabel` set `overflow-wrap: anywhere` and (for the label)
  `word-break: break-word` so long URLs and identifiers wrap instead of pushing the row wider.
- `.sourceItem` wraps (`flex-wrap: wrap`); `.sourceKind`’s 8 rem minimum column width only applies
  at ≥ 720 px so the kind label can share the mobile row.

Verified via Chrome DevTools Protocol at 390 × 844 and 1440 × 900 against `next dev`:

```
/projects/360-spherical-panorama-stitching        @390x844: {"inner":390,"scroll":390,"body":390,"overflowers":[]}
/projects/omnisign-lebanese-sign-language         @390x844: {"inner":390,"scroll":390,"body":390,"overflowers":[]}
/writing/building-a-360-panorama-stitcher-…       @390x844: {"inner":390,"scroll":390,"body":390,"overflowers":[]}
/projects/360-spherical-panorama-stitching        @1440x900: {"inner":1440,"scroll":1440,"body":1440,"overflowers":[]}
```

`document.documentElement.scrollWidth === window.innerWidth` on all measured viewports. No
element under `main` reports `scrollWidth > innerWidth + 1`. Stage detail paragraphs and source
labels remain fully readable at their normal type sizes; nothing is hidden and no global
`overflow-x: hidden` bandage was used.

Post-fix re-verification:

- `npm run build` (Turbopack) → succeeds. 63 static pages.
- `npx eslint 'src/app/projects/**/*.tsx' 'src/app/writing/**/*.tsx' 'src/app/topics/**/*.tsx' 'src/components/authority/**/*.{ts,tsx}' 'src/content/authority/**/*.ts'` → exit 0.
- `git diff --name-status c2246d65e526bf821359b035251ca00ce50a6005` → every entry is `A`; only
  `src/components/authority/authority.module.css` and this report changed from the previous fix
  pass, so the additive-only boundary is preserved. Total: 56 `A` records; zero `M`, `D`, `R`, or
  `C`.

## 2026-09-20 — Phase 0.5 follow-through

- Content edits after Rami's decisions: thermal edge figure bound to NVIDIA Jetson Orin per the CV with unreconciled figures disclosed in limits; easyPID versions 1.0.0 and 1.1.0; Daleel credits Layth Ayache; OmniSign, BEMO desk, NASNA, and Space Apps review records carry confirmed roles and team credits.
- New review routes: `/projects/upstream-open-source-contributions`, `/writing/what-small-upstream-fixes-teach-about-firmware`, `/writing/talks-workshops-and-teaching`. New diagram ids `upstream-fixes` and `talks-loop` in `src/components/authority/diagrams.tsx`.
- Verification: `npm run build` → 66 static pages; ESLint on new TS/TSX → exit 0; `git diff --name-status c2246d6…` → only `A` records (workspace and content files added on this branch were modified, no base-commit file). Generated HTML for the three new routes contains `noindex, nofollow`, the editorial-review notice, and JSON-LD.

## 2026-09-20 — Discovery drafts complete

- Routes added (all `review`): `/projects/hantawatch-outbreak-dashboard`, `/projects/basira-retinal-screening`, `/projects/imagen-raw-to-edit-dataset-pipeline`, `/projects/lumiscan-lesion-dashboard`, `/projects/evoid-applied-vision-venture`, `/projects/water-shooting-robot`, and their companion articles; `/writing/talks-workshops-and-teaching`; `/projects/upstream-open-source-contributions` with `/writing/what-small-upstream-fixes-teach-about-firmware`.
- Media copied: `public/images/authority/smart-desk/night-pic.jpeg` and `demo.gif` from the public smart-interactive-desk repository; provenance appended.
- Diagram ids added: `osint-feed`, `council-consensus`, `raw-pipeline`, `lesion-timeline`, `water-robot`, `venture-loop`, `upstream-fixes`, `talks-loop`.
- Verification: `npm run build` → 78 static pages; new-file ESLint → exit 0; `git diff --name-status <base>` → only `A`; generated HTML for every new route contains `noindex, nofollow` and the review notice; `/projects` index HTML contains no link to a review slug.

## 2026-09-20 — Promotions

- Twelve records moved from `review` to `ready` after Rami's decisions; metadata rewritten without review markers; Basira record, article, and diagram carry no model names.
- Verification: `npm run build` → 78 static pages; new-file ESLint → exit 0; additive-only diff preserved; `/projects` index lists 20 project links and `/writing` 23 article links; remaining review routes still emit `noindex, nofollow`.
