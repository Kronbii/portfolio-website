# UI branch — resume here

Updated: 2026-10-01.

## Why this branch exists

Rami wants to redesign the homepage **Selected Work** and **Community** sections, which currently use an identical mirrored sticky lineup. The `geo` branch finished the authority-page system and shipped a design exploration of three alternative pairings for these two sections; those pairings are cherry-picked onto this branch as the starting point.

## Branch layout

- `main` — production (what `ramikronbi.com` serves).
- `geo` — authority-page system and remaining GEO work (Search Console submission, syndication, review items). Do not merge from here.
- `ui` — this branch. UI edits for the homepage sections, built on top of `main` plus the sandbox exploration.

Do not merge `geo` ↔ `ui` directly. Each branch merges one-way into `main`.

## What is already here

Under `src/app/sandbox/work/`:

- `data.ts` — curated homepage work items with real titles, roles, and canonical links.
- `chapters.tsx`, `filmstrip.tsx`, `spreads.tsx`, `ledger.tsx`, `wall.tsx`, `shared.tsx` — six section treatments.
- `work.module.css` — one stylesheet for all pairings.
- `a/page.tsx`, `b/page.tsx`, `c/page.tsx` — the three pairings:
  - **A — Chapters and film strip.** Full-bleed project plates that cover each other, title set in the plate; Community is a horizontal dated strip.
  - **B — Spreads and ledger.** Magazine diptychs with a varied rhythm; Community is a dated ledger with one hover plate.
  - **C — Evidence wall and chapters.** Mixed-size wall of real media; Community takes the cinema (chapters) treatment.
- `page.tsx` — sandbox index page.

Supporting assets created for the pairings:

- `public/images/authority/easypid/pid-loop.svg` — authored dark-ground diagram plate.
- `public/images/authority/thermal-super-resolution/thermal-plate.webp` — cropped plate without baked labels.
- `.impeccable/surfaces/src-components-sections-home-projects-tsx.md` — direction contract (seed key 891fff7c, dealt structures 6/7/2).

Routes available in dev:

- `/sandbox/work` — index.
- `/sandbox/work/a`, `/sandbox/work/b`, `/sandbox/work/c` — the three pairings; a switcher at the top of each moves between them.

## Current live sections (do not edit without Rami's approval)

- `src/components/sections/home-projects.tsx` — the current Selected Work (mirrored sticky lineup).
- `src/components/sections/home-community.tsx` — the current Community (same pattern).
- `src/content/home.ts` — homepage content including Projects.spotlightSlugs and Community.items.

These are base-commit files. Only promote a pairing to them after Rami locks the choice.

## Next moves

1. Rami picks a pairing (or a mix: one Projects treatment, one Community treatment).
2. Promote the chosen treatments to the real sections, carrying over the authority-record copy and canonical links. Delete the stale homepage project summaries that contradict the new pages (e.g., "WRO 2023 Champion" project title, 229+ FPS thermal line).
3. Finish review, detector pass, build, PR into `main`.
4. Delete `src/app/sandbox/work/` once a pairing is live.
