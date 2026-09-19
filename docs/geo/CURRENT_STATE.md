# Current state

Last updated: 2026-09-20.

## Git state

- Isolated branch: `claude/geo-authority-pages`.
- Active repository checkout: `/home/kronbii/repos/portfolio-website`.
- The feature branch is checked out directly in the repository root so Claude can be launched there. The earlier auxiliary worktree has been removed.
- Base commit: `c2246d65e526bf821359b035251ca00ce50a6005` on `main`.
- The checkpoint at `ca38e9d` contains 67 added files relative to the base commit and no modified, deleted, renamed, or copied base files. The 2026-09-20 session changed only branch-added files under `docs/geo/` (uncommitted).
- Nothing has been pushed, merged, deployed, or published.

## Implemented content system

New public route families:

- `/projects`
- `/projects/[slug]`
- `/writing`
- `/writing/[slug]`
- `/topics`
- `/topics/[slug]`

Inventory implemented:

- 19 ready projects (11 original plus, on 2026-09-20, OmniSign, BEMO desk, upstream contributions, Hantawatch, Basira, Imagen, Lumiscan, Evoid, water-shooting robot).
- 23 ready articles (companions plus the NASA Space Apps mentoring, NASNA, and talks articles, which have no project record).
- 3 review-only project pages (runway UAV, FPV drone, emotion recognition).
- 4 review-only articles (the three above plus physics outreach).
- 9 eligible topic hubs.
- Hold items remain only in `CONTENT_REGISTRY.md`.

The content layer lives under `src/content/authority/`. The shared page system lives under `src/components/authority/`. Real media and its provenance manifest live under `public/images/authority/`.

## Verified safeguards

- Ready pages use route-specific canonical URLs and are indexable.
- Review pages emit `noindex, nofollow`, display an editorial-review notice, and do not appear in ready indexes or recommendations.
- Unknown slugs return `notFound()`.
- JSON-LD is emitted for projects, articles, collections, and breadcrumbs.
- Dead topic labels render as labels rather than links to nonexistent hubs.
- Existing fragment-only header links are rewritten at runtime only on authority pages so they return to homepage sections. The incumbent header source was not modified.
- Confidential employer, defense, landmine, private-repository, and beneficiary-sensitive material is not rendered.
- Race-car copy uses the verified 2023 third-place result, never “champion.”
- Thermal copy uses the reviewed quality figures and approximately 45 FPS on Jetson AGX Orin; unreconciled SOTA and 250–270 FPS claims are not published.
- No fabricated project photographs or results are used.

## Latest verification

Claude's implementation report records:

- `npm run build` succeeds and generates 63 static pages.
- ESLint against the new authority TypeScript/TSX exits cleanly.
- Live development-server checks pass for ready project, article, and topic routes.
- Live review-route checks confirm `noindex, nofollow` and visible review notices.
- At 390 × 844, the flagship project, OmniSign review project, and flagship article report document scroll width equal to the viewport width.
- At 1440 × 900, the flagship project reports no horizontal overflow.

Re-run these checks in a fresh session before making claims about the current state because generated output and dependencies can drift.

## Deliberately not done

- No existing homepage, navigation, global style, root layout, robots, sitemap, package, lockfile, or configuration file was changed.
- New pages are therefore not linked from the existing homepage navigation and are not included in the existing sitemap. Runtime header repair only makes the old header usable while visiting a new route.
- No branch has been pushed or merged.
- No preview or production deployment has been created.
- No Medium or DEV article has been published.
- No search-console indexing request has been made.
- No public review item has been promoted to `ready` without user confirmation.
- No generated marketing imagery has been created; authentic project media and code-native diagrams were preferred.

## Historical environment detail

In the earlier auxiliary worktree, its `node_modules` symlink was incompatible with Next 16 Turbopack because it resolved outside that worktree's filesystem root. Claude temporarily replaced it with a local hardlink copy. That auxiliary worktree has since been removed. The repository-root checkout uses its existing ignored `node_modules`; no package or lockfile change was made.

## Phase 0.5 discovery (completed 2026-09-20)

- Every direct child of `/home/kronbii/repos` (66 entries, 59 Git repositories), the Space² sources, and the 70-repository GitHub account were inspected read-only. The private census `.claude-private/PROJECT_CENSUS.md` classifies each entry; local counts: 11 ready, 11 review, 20 hold, 24 exclude.
- The live publication audit found the thermal article on four platforms (Medium, DEV, Hashnode, Substack) within 35 minutes with no canonical link; a Medium copy of the OmniSign article not previously recorded; exact timestamps for all three articles; two Arduino Library Manager releases of easyPID; a verified RHU 2025 award record; a verified 2022 Space Apps volunteer record; verified CodewithSerah bootcamp sessions; and no public corroboration for Physics Day, INJAZ, Space², or an organizing role at Space Apps.
- Material conflicts surfaced: OmniSign attribution (live team page omits Rami), NASNA role and dates, Oreyeon title, thermal edge FPS provenance, and Daleel collaborator credit.
- Nothing in the content registry or typed content layer was changed. The decision list in `TASKS.md` must be answered before any registry change.
- The live canonical CV could not be read (Drive connector unauthenticated); a local April 2026 PDF copy was read instead and used only as `reviewed` evidence.

## Immediate next action

Rami answered the decision list on 2026-09-20 and the approved changes were applied to the typed content and registry (build and new-file lint pass; diff still additive-only). Drafted the same day as review routes: `/projects/upstream-open-source-contributions`, `/writing/what-small-upstream-fixes-teach-about-firmware`, `/writing/talks-workshops-and-teaching`; expanded the NASNA article from the public README. Rami answered the consolidated list and twelve records were promoted to `ready`; Basira omits model names at his request; the WRO page keeps RHU's third place and discloses the CV's second-place line. Build generates 78 pages; the projects index lists 20 links and the writing index 23; remaining review routes stay noindex. Next: collect Rami's outstanding documents (Physics Day, INJAZ, Space Apps images, DevFest slides), voice pass over all ready prose, then Phase 1 pruning and Phase 3 integration approval. The existing 19-record content registry remains the first implemented publishing wave.

Before any deployment, resolve every deployment blocker in `KNOWN_ISSUES.md`.
