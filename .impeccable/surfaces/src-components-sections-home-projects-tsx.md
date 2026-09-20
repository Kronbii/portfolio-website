---
version: 1
slug: "src-components-sections-home-projects-tsx"
primary_target: "src/components/sections/home-projects.tsx"
related_targets: ["src/components/sections/home-community.tsx"]
---

# Homepage work sections — Selected Work and Community

## Direction contract

**THESIS:** The homepage stops telling the same story twice. Selected Work is a cinema of systems: each project fills the viewport as one large plate with the title set into it. Community is a different instrument entirely, a record of moments and roles laid out along time. Two sections, two grammars, one identity.

**OWN-WORLD:** Inherit the near-black field, warm white type, restrained red accent, Zalando Sans for display, Fraunces for the italic dek, hairline rules, sharp corners. No cards, no eyebrows, no numbering, no repeated equal tiles. Real project media only; stock clips stay atmosphere and never stand for a project.

**STORY:** The visitor leaves the giant name and the About statement, and the screen goes dark and fills with the work: one system at a time, edge to edge, title anchored low, a quiet line to the canonical record and the source. Then the rhythm changes: Community reads as a dated strip or ledger of moments with people and institutions named, each opening to its article. The visitor ends knowing what was built and where Rami stood in each room.

**FIRST VIEWPORT:** Selected Work opens on a full-bleed plate of the 360° panorama with the title set large at the bottom-left and the canonical link beside it; no header block precedes the image. Community opens on a horizontal strip whose first frame is already partly visible so the direction of travel is obvious.

**FORM:** Seed key 891fff7c, surface scope, Experience mode, degraded roll. Ranked list: 1 horizontal cinematic reel; 2 evidence-wall collage; 3 scroll-driven zoom cut; 4 film-strip timeline; 5 contact-sheet index with hover plate; 6 full-bleed chapters with sticky title; 7 magazine diptych spreads. Dealt 6 (lead), 7, 2. Built as three sandbox pairings so the user compares systems, not fragments: A chapters + film-strip timeline; B diptych spreads + dated ledger with hover plate; C evidence wall + chapters. Signature interaction per pairing: A sticky title crossfade as plates cover each other; B the ledger row hover swaps one large plate; C the wall tile expands in place. All removed under reduced motion; content visible by default.

**FINISH:** unreviewed and undocumented is unfinished; sandbox variants end with one batched inspection at 1440 and 390, the detector, and the finish reviewer on the pairing the user locks in.

## Scope

- Primary target: `src/components/sections/home-projects.tsx`; related: `src/components/sections/home-community.tsx`, `src/app/sandbox/work/*`.
- Visitor mode: Experience.
- Constraint: sandbox routes only until the user locks a pairing; then the two section files change under explicit approval.
- Linking: each item links to its canonical `/projects` or `/writing` page and to its external evidence; items without a canonical page link externally only.
