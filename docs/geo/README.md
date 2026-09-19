# GEO authority workspace

This directory is the durable source of truth for turning Rami Kronbi's public work into evidence-backed website pages and later syndicating selected articles to Medium and DEV.

It is written so a fresh Claude Code session can continue without access to the original Codex conversation.

## Start here

Read these files in order before taking action:

1. `../../CLAUDE.md` — hard write boundary, implementation contract, and continuation protocol.
2. `../../.claude-private/README.md`, when present — entry point to the private identity, career, project-discovery, chronology, organization, publication, and voice suite. Follow its read order. Never publish or commit it.
3. `CURRENT_STATE.md` — what exists now, what has been verified, and what is intentionally not done.
4. `TASKS.md` — the ordered execution queue and the exact next task.
5. `KNOWN_ISSUES.md` — blockers and risks that must be resolved before deployment.
6. `DECISIONS.md` — decisions that must not be silently reopened.
7. `CONTENT_REGISTRY.md` — complete content inventory and `ready` / `review` / `hold` states.
8. `ENTITY_FACTS.md` — canonical public-safe identity and entity relationships.
9. `PUBLICATION_REGISTRY.md` — known writing, profiles, conflicts, and live-audit requirements.
10. `EDITORIAL_POLICY.md` — evidence, conflict, voice, disclosure, and media rules.
11. `AUTHOR_COPY_READY.md` and `AUTHOR_COPY_REVIEW.md` — canonical article prose.
12. `GEO_AND_PUBLISHING_PLAN.md` — canonical-site, structured-data, integration, syndication, and indexing plan.
13. `SURFACE_BRIEF.md` and `../../.impeccable/surfaces/src-app-projects-slug-page-tsx.md` — route-level visual direction.
14. `claude/IMPLEMENTATION_REPORT.md` — detailed implementation and verification record.

Use `KNOWLEDGE_TRANSFER.md` when reasoning about Rami's broader positioning, intended audience, and long-term direction. Use `SESSION_LOG.md` for chronology.

For a copy-paste launch instruction and preflight checklist, use `START_NEW_CLAUDE_SESSION.md`.

## One-line continuation prompt

From the portfolio repository root, the user should be able to start a fresh Claude Code session and say:

> Read `CLAUDE.md` and continue the GEO authority workspace from `docs/geo/README.md`. Resume the first actionable item in `docs/geo/TASKS.md`. Preserve all publication states and the additive-only boundary.

If the user says only `continue`, the continuation protocol in the root `CLAUDE.md` means the same thing.

## Workspace location

- Active repository checkout: `/home/kronbii/repos/portfolio-website`
- Branch: `claude/geo-authority-pages`
- Base commit: `c2246d65e526bf821359b035251ca00ce50a6005`
- Live site: `https://ramikronbi.com`

The repository root is checked out on the feature branch. The `main` branch and live site have not been changed.

## Operating model

- The website is the canonical source.
- Medium and DEV are later syndication channels.
- `ready` content may be indexable.
- `review` content is rendered locally for editorial work but remains `noindex, nofollow` and absent from public indexes.
- `hold` content is not rendered or placed in source code.
- Existing site files remain read-only until the user explicitly approves integration changes.
- Claude Code owns implementation. The editorial documents own facts and scope.
- Claude owns the read-only discovery audit of accessible repositories and public profiles. It must present proposed classifications to the user before changing public content.

## Definition of done for the overall program

The program is complete only when:

- the user has pruned or approved the inventory;
- Claude has completed the private repository census and live publication audit, and the user has approved any additions to the public registry;
- every public page has passed factual, collaborator-credit, media-rights, responsive, accessibility, metadata, and structured-data review;
- the user has explicitly approved the minimal integration changes needed for navigation and sitemap discovery;
- the approved branch has been merged and deployed through an authorized workflow;
- the live site has been crawled and its canonical tags, robots behavior, JSON-LD, internal links, and performance have been verified;
- selected articles have been syndicated with canonical links back to ramikronbi.com;
- indexing has been requested through the appropriate search-console workflows;
- a maintenance cadence exists for stale claims, broken links, and new work.

Do not call the program complete merely because the pages build locally.
