# Task: implement the additive authority-page system

> Historical implementation brief. The implementation is complete. For current work, follow `README.md`, `CURRENT_STATE.md`, `KNOWN_ISSUES.md`, and `TASKS.md`; those files supersede conflicting instructions here.

Read `CLAUDE.md`, `PRODUCT.md`, `agents.md`, every file under `docs/geo/`, and the incumbent source files needed to understand the current visual system. Then implement the complete authority-page system on this feature branch.

## Required content coverage

- Implement all 11 `ready` project records from `CONTENT_REGISTRY.md`.
- Implement all 11 companion ready articles using the complete prose in `AUTHOR_COPY_READY.md`.
- Implement all `review` records for which a project slug or article slug is supplied, using `AUTHOR_COPY_REVIEW.md`; ensure they are noindex/nofollow and absent from indexes and ready-content recommendations.
- Implement every eligible topic hub in `TOPIC_HUBS.md`. Ready content may be listed; review content may be mentioned only as “in review” without linking to its draft route.
- Preserve every `hold` item only in the editorial registry. Do not place hold facts in source code or rendered output.

## Required implementation

- Create typed data modules under `src/content/authority/` for projects, articles, topics, sources, media, publication state, and cross-links.
- Create the dynamic and index routes listed in `CLAUDE.md`.
- Create reusable page and structured-data components under `src/components/authority/`.
- Use static generation for known slugs and return `notFound()` for unknown slugs.
- Add canonical metadata, robots directives by state, Open Graph/Twitter metadata using verified local imagery where available, and valid JSON-LD.
- Build visible evidence sections and breadcrumb navigation.
- Make each project/article pair link to one another and to relevant topic hubs.
- Copy the authorized assets in `CONTENT_REGISTRY.md` into organized folders under `public/images/authority/`; create a plain-text provenance manifest there with original repository path and public source URL for every copied raster/video.
- For entries without safe imagery, create code-native diagrams with HTML/CSS/SVG geometry only. Do not fabricate a project photo or result.
- Use route-local CSS modules if Tailwind cannot express the incumbent system without modifying existing files.

## Visual direction

Honor `.impeccable/surfaces/src-app-projects-slug-page-tsx.md`. This is a code-first extension of the existing site. Project pages should be artifact-led; articles should be readable editorial spreads; indexes should avoid a generic equal-card grid.

The 360° page should be the visual benchmark: real panorama, process stages, smoothing comparison, sample-run measurements in context, and explicit limitations. Other pages should reuse the design grammar without pretending they have the same media.

## Content safety

Do not repeat conflicting claims from existing `src/content/projects.ts`. In particular:

- The 2023 autonomous race car result is third place in Future Engineers, not champion.
- Thermal inference is approximately 45 FPS on Jetson AGX Orin in the canonical CV. Do not publish SOTA/first/15×/40×/250–270 FPS claims.
- Do not publish OmniSign awards or an invented origin story.
- Do not expose employer-confidential, defense, landmine, private-repository, or beneficiary-sensitive material.

## Completion

Run the verification required by `CLAUDE.md`. Fix all errors caused by new files. Do not modify a pre-existing file to silence a pre-existing warning or failure.

Finish by writing `docs/geo/claude/IMPLEMENTATION_REPORT.md`. In your terminal response, report the new routes, ready/review counts, verification results, and the additive-only diff check.
