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

## Dormant: the drone system

Nothing drone-related was lost in the cleanup. Three layers exist.

### Alive on this branch, usable today

- `public/models/` — 19 licensed `.glb` drone models (DJI Matrice 300, DJI FPV, Parrot, tricopter, FPV racers, fixed-wing UAV, Beta85x, Eachine, etc.), all draco-compressed and texture-compressed. Credits and sources: `public/models/CREDITS.md`.
- `public/videos/dusk-drone.*` and `public/videos/field-drone.*` — drone atmosphere clips (stock, not Rami's footage; HANDOFF.md flags this).
- `src/components/three/drone/drone-stage.tsx`, `behaviors.ts`, `geometry.ts` — raw three.js stage with ten behaviors (Orbit, Turntable, Exploded, Plan, Approach, Descent, Scan, Bank, Swarm, Scrub) and a procedural quadrotor with named part handles. Deliberately not react-three-fiber because R3F v9 + the project's React 18 is documented as fatal in `HANDOFF.md`.
- `src/app/sandbox/drones/` — working gallery at `/sandbox/drones` where every model runs against every behavior, with tint and context controls. One WebGL context, switched, to stay under the ~16-context browser cap.

### Archived in tag `drone-system-v1` (commit `1a07c75`)

Not on any branch. Protected by the tag.

- `src/components/three/drone/drone-flight-path.tsx` — a page-wide scroll flight path.
- `src/components/three/drone/drone-view.tsx`, `gltf-drone.tsx`, `gltf-drone.client.tsx`, `lazy-drone.tsx` — react-three-fiber scaffolding (abandoned over the React 18 incompatibility).
- `src/components/three/drone/use-canvas-slot.ts` — WebGL context budget manager.
- `src/components/sections/drone-lab.tsx`, `one-drone-probe.tsx` — section-level compositions.
- `src/components/ui/drone-plant.tsx`.

Retrieve any of these without switching branches:

```
git checkout drone-system-v1 -- src/components/three/drone/drone-flight-path.tsx
git show drone-system-v1:src/components/sections/drone-lab.tsx > /tmp/drone-lab.tsx
```

### History and status

The drones were the center of the earlier `redesign/vatn-inspired-3d` exploration (video stage + procedural drones + three.js canvases, vatn.com-inspired). That direction was set aside, the branch was archived behind the tag, and the models + sandbox gallery stayed. Nothing on the current homepage uses them. Rami named "the procedural drone machines" and "the draggable quadcopter" as things he specifically wanted to keep.

### Three ways to bring them back on this branch, from least to most ambitious

1. **Reuse `/sandbox/drones`** as a project detail page (FPV drone review record is still in `review` and would fit naturally), or as a hero inset.
2. **One tinted drone on the homepage.** Place quadcopter.glb or beta85x-scan.glb as a hero element running the Orbit or Scan behavior, with `dusk-drone.mp4` as the backdrop. Minimal footprint on React 18.
3. **The full drone system.** Pull `drone-flight-path.tsx` from the tag and build a page-wide scroll flight path across the homepage sections, with per-section behaviors handed over. This is what HANDOFF.md calls "the full drone system". Likely needs React 19 and R3F v9 per the HANDOFF's technical landmines section; cost is a package upgrade.

### Constraints to remember before touching this

- The models ship as light grey plastic; retint before use (the sandbox gallery exposes four tints including the archive body color).
- Stock video clips are atmosphere, not documentation; never caption or frame one so a visitor reads it as Rami's own footage.
- `public/draco/draco_decoder.js` is a vendored library file; the project ESLint config has a known failure on it that `npm run lint` surfaces. Lint only against new TypeScript/TSX, as the GEO workflow did, until that is resolved.
