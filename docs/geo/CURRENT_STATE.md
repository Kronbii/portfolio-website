# Current state

Last updated: 2026-09-19.

## Git state

- Isolated branch: `claude/geo-authority-pages`.
- Isolated worktree: `/home/kronbii/repos/.worktrees/portfolio-website-geo`.
- Base commit: `c2246d65e526bf821359b035251ca00ce50a6005` on `main`.
- The checkpoint contains 65 added files relative to the base commit and no modified, deleted, renamed, or copied base files.
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

- 11 ready projects.
- 11 ready companion articles.
- 5 review-only project pages.
- 8 review-only articles.
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

## Known environment detail

The worktree's original `node_modules` symlink was incompatible with Next 16 Turbopack because it resolved outside the worktree filesystem root. Claude replaced it with a local hardlink copy of the existing dependency tree. No package install or lockfile change was required. `node_modules` remains ignored.

## Immediate next action

The first actionable item is the structured content and design review in `TASKS.md`: let the user prune the 11 ready pairs and 8 review articles from a local preview before any integration, deployment, or syndication work.

Before any deployment, resolve every deployment blocker in `KNOWN_ISSUES.md`.
