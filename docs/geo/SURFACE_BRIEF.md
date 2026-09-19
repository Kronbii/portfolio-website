# Authority surfaces

## Direction contract

**THESIS:** These pages are an annotated engineering record: the artifact leads, and the writing explains the decisions that made it work. They refuse the standard portfolio arrangement of a centered title, a row of metrics, and repeated feature cards.

**OWN-WORLD:** Inherit the incumbent near-black field, warm white typography, restrained red accent, Zalando Sans, Fraunces, sharp rules, and cinematic image scale. Components behave like captions, evidence plates, source notes, and technical annotations rather than SaaS cards. Article pages prioritize a calm 65–75 character reading column while media and diagrams can break wider.

**STORY:** A visitor sees the real artifact first, understands the problem and Rami's role in plain language, follows the mechanism and tradeoffs, inspects measured evidence and limits, then reaches source links and the companion project or article. Topic hubs answer what Rami has actually built in a field by connecting multiple pieces of evidence.

**FIRST VIEWPORT:** Project pages open on a large real image, comparison, or code-native system diagram occupying most of the viewport, with the title and one-sentence answer anchored beside or across it. Article pages open as an editorial spread with one decisive visual and the dek, not a centered blog masthead. The primary action is a quiet link to the evidence source, positioned with the artifact rather than isolated as a generic button.

**FORM:** Chosen form is the annotated system narrative, ranked third in the grounded structural list and assigned as the lead by surface seed `70dc7018`. Its signature interaction is evidence-linked reading: selecting or hovering a stage, claim, or source highlights the corresponding visual annotation without hiding content. Motion is one restrained image/annotation handoff per page family and is removed under reduced-motion preferences.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Scope

- Primary targets: `src/app/projects/[slug]/page.tsx`, `src/app/writing/[slug]/page.tsx`, `src/app/topics/[slug]/page.tsx`.
- Index targets: `src/app/projects/page.tsx`, `src/app/writing/page.tsx`.
- Visitor modes: Experience for project pages; Read for article and topic pages.
- Established visual world: preserve and extend the current portfolio.
- Build path for this session: code-first, not stored as a project default.
- Existing-site boundary: additive files only; no existing file modification.
