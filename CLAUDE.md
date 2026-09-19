# Claude implementation contract

You are the only AI authorized to write website source code for this branch. Codex is the product owner and editor. Follow the editorial files in `docs/geo/` exactly.

## Hard write boundary

This is an additive-only phase.

- Do not modify, delete, rename, or format any file that existed at commit `c2246d65e526bf821359b035251ca00ce50a6005`.
- Do not modify the homepage, existing components, existing content, global CSS, layouts, navigation, `package.json`, lockfiles, Next.js configuration, robots, sitemap, manifest, or existing structured-data implementation.
- You may create new files only under:
  - `src/app/projects/`
  - `src/app/writing/`
  - `src/app/topics/`
  - `src/components/authority/`
  - `src/content/authority/`
  - `public/images/authority/`
  - `docs/geo/`
- You may update any file that was added on this feature branch, including the durable handoff under `docs/geo/`. The prohibition is against modifying files that existed at the base commit.
- You may copy verified assets from the source paths listed in `docs/geo/CONTENT_REGISTRY.md` into `public/images/authority/`. Do not alter the originals.
- Do not install packages. Use the current stack and local primitives.
- At completion, `git diff --name-status c2246d65e526bf821359b035251ca00ce50a6005` must contain only `A` records. Any `M`, `D`, `R`, or `C` record is a failure.

## Required surfaces

Create a content-driven authority system with:

- `/projects` index
- `/projects/[slug]` detail pages
- `/writing` index
- `/writing/[slug]` long-form article pages
- `/topics/[slug]` topic hubs

Use one shared typed content layer under `src/content/authority/`. Keep prose out of route JSX. Create reusable components only under `src/components/authority/`.

## Publication states

Every entry has one of three states:

- `ready`: indexable and visible on the relevant index page.
- `review`: route may render for local review, but metadata must be `robots: { index: false, follow: false }`; omit it from indexes and ready-content internal recommendations.
- `hold`: do not create a public route or include its facts in other pages. Preserve it only in the editorial registry.

Do not infer a stronger state.

## Editorial rules

- Use the supplied article copy faithfully. You may correct punctuation and obvious grammar, but do not add claims, anecdotes, outcomes, customers, awards, metrics, dates, or quotations.
- Never reproduce `[VERIFY]` claims from existing content as facts.
- Do not call a project “production-ready,” “state of the art,” “breakthrough,” “award-winning,” “champion,” or “industry-leading” unless the exact phrase is supported in the registry.
- Credit collaborators and institutions where the content names them.
- Do not expose confidential employer work, defense details, private repository material, local credentials, or file-system paths in rendered output.
- Do not publish a synthetic first-person origin story. First person is allowed only for engineering decisions and observations directly supported by the supplied sources.

## GEO and metadata requirements

For each `ready` project and article:

- Provide unique title and description metadata.
- Use the canonical URL on `https://ramikronbi.com`.
- Emit valid JSON-LD using appropriate schema types (`TechArticle` for writing, `SoftwareSourceCode` or `CreativeWork` for projects, `CollectionPage` for indexes and topics).
- Connect the work to Rami Kronbi as `author` or `creator`, with `sameAs` links limited to verified profiles already present in the repository site configuration.
- Include breadcrumbs in both visible UI and structured data.
- Include a visible “Evidence and links” section drawn from each entry's sources.
- Include a concise plain-language answer near the top: what it is, what problem it addresses, how it works, and Rami's role.
- Cross-link each project to its companion article and relevant topic hubs.
- Do not add fake `datePublished` or `dateModified` values. Omit them when not supplied.

## Design contract

Mode is `Read` for articles and topic hubs, and `Experience` for project pages.

- Inherit the existing site's visual language; do not create a competing identity.
- The first viewport must show the actual project or mechanism, not a generic centered title block.
- Use real project media where available. For software without imagery, build an accessible code-native diagram or data flow from verified architecture.
- No decorative gradient text, glass cards, giant metric hero template, eyebrow labels, repetitive equal-size card grids, or emoji icons.
- Keep article measure around 65–75 characters, display type below 6rem, and letter spacing no tighter than -0.04em.
- One purposeful motion idea per page family. Content must remain visible by default and respect `prefers-reduced-motion`.
- Maintain strong contrast, visible keyboard focus, meaningful alternative text, responsive layouts, and no horizontal overflow at 390px.

## Verification

Run:

1. `npm run build`
2. ESLint only against new TypeScript/TSX files so the known vendored `public/draco/draco_decoder.js` error does not obscure new regressions.
3. A check that every diff entry versus the base commit is additive.

Write a concise report to `docs/geo/claude/IMPLEMENTATION_REPORT.md` listing routes, source assets copied, checks run, and any content intentionally left in `review` or `hold`.

## Fresh-session continuation protocol

This repository is now designed to be continued directly by Claude Code.

When the user says `continue`, `continue the GEO work`, or an equivalent short instruction:

1. Read this file completely.
2. If `.claude-private/RAMI_DIGITAL_REPLICA.md` exists, read it completely. It is private reasoning context: never quote, copy, commit, or publish its private material without explicit user approval.
3. Read `docs/geo/README.md` completely and follow its required read order.
4. Inspect the current branch and working tree before changing anything.
5. Read `docs/geo/KNOWN_ISSUES.md`, then resume the first unchecked item in `docs/geo/TASKS.md` whose prerequisites are satisfied.
6. Preserve the publication states and disclosure boundaries in `docs/geo/CONTENT_REGISTRY.md`.
7. Update `docs/geo/CURRENT_STATE.md`, `docs/geo/TASKS.md`, and `docs/geo/SESSION_LOG.md` after every material milestone.

Do not restart discovery, redesign the system, or ask the user to repeat established context. Ask only when a decision is listed as user-owned in `docs/geo/TASKS.md` or when new evidence creates a material conflict.

The durable handoff is under `docs/geo/`. `docs/geo/README.md` is its single entry point.
