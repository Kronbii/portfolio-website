---
version: 1
slug: "src-app-v2-page-tsx"
primary_target: "src/app/v2/page.tsx"
related_targets: ["src/app/v2/projects/page.tsx","src/app/v2/projects/[slug]/page.tsx","src/app/v2/writing/page.tsx","src/app/v2/writing/[slug]/page.tsx","src/app/v2/topics/page.tsx","src/app/v2/topics/[slug]/page.tsx"]
---

# /v2 redesign — the engineering notebook

## Direction contract

**THESIS:** The site is Rami's engineering record kept as a notebook: numbered entries, figures, margin notes, cross-references, a witness line. Every entry shows a system working, its limits, and who vouches for it. Refuses the portrait-hero, bio, card-grid developer portfolio.

**OWN-WORLD:** Juno's synthesis, pinned by the user. Warm near-black #0E0B0B ground with cream ink and burgundy as the only accent (Tayseer); Lazpress paper white as the light theme. Structure from 1px hairlines, never fills; a 22×2 accent tick above a panel's caps label (Bikey). Manrope for words, one Instrument Serif italic word per page heading, JetBrains Mono for every figure, number, unit, and data label. Everything pressable is a pill. Graph paper is Lazpress's 80px hairline grid, masked, not a paper skeuomorph. Real media as numbered FIG. plates. Rami's real signature closes the record.

**STORY:** The visitor opens the contents spread, disturbs a live quadrotor specimen, and reads what the record holds. Entries prove mechanism with plates, readings, and limits; a light-tracker field lets them feel PD control; field notes, roles, and topics follow. They leave knowing what Rami built, where he stood, and where the evidence lives, then contact him.

**FIRST VIEWPORT:** Home: a ticker strip on top; left seven columns, a hairline plate holding a burgundy GLSL terrain field with the procedural quadrotor at life scale, draggable, self-levelling on release, leader-lined part callouts and a live roll/pitch/yaw readout in mono; right five columns, "Rami Kronbi" large, one claim with an italic word, then the numbered contents of six real entries. Primary actions are two pills under the contents. Project pages open on the entry's plate or a live signal-flow figure built from its stages.

**FORM:** Engineering notebook, candidate 7 of 7 on my grounded list (1 datasheet, 2 ground station, 3 perception window, 4 ROS graph, 5 board layout, 6 scope capture, 7 notebook); seed key e0e9ec26; the user kept the roll. Raised by the exposure-record sheets: opening an entry slides its sheet over the contents with mass and slight overshoot, and the contents slide back on return. Raised by the gate board: topic filters rerank rows in place, each row keeping identity and holding its highlight until noticed. Raised by Studio Dumbar: thrown topic pills always settle back onto the module grid. Signature interactions: the drone specimen (home), the light-tracker PD field (home), sheet transitions (site), in-place rerank (indexes), the physics topic tray (topics). Motion grammar: plates develop into view with a clip and focus pull; nothing else enters on scroll.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Scope

- Parallel preview of every page under `/v2`: home, `/v2/projects`, `/v2/projects/[slug]`, `/v2/writing`, `/v2/writing/[slug]`, `/v2/topics`, `/v2/topics/[slug]`. The live site stays untouched; Rami compares and promotes what he likes.
- Visitor modes: Experience for home and project entries; Read for writing, articles, and topic hubs.
- Theme: warm dark by default, Lazpress paper light, follows the system setting with a stored toggle.
- Elements the user asked for: shader fields, the drone in 3D, physics and cursor play, ticker, marquee, scroll progress, custom cursor. "Be creative, I am exploring."
- Packages approved: `@paper-design/shaders-react`, `matter-js`.

## Constraints

- One content layer: `src/content/authority` plus `src/lib/site.ts`; new v2-only copy lives in `src/content/v2`. No prose in route JSX.
- Respect publication states: review records render only where `isRenderable` allows and never appear in indexes; no hold facts.
- Never reproduce `[VERIFY]` homepage claims (counters, Space², INJAZ, Space Apps organizer years, Physics Day scope). Roles come from `docs/geo/ENTITY_FACTS.md` verified items and ready records only.
- Every `/v2` page is `noindex, nofollow` with a canonical to its live route; JSON-LD mirrors the live pages so promotion carries it over.
- Visible breadcrumbs, a plain-language answer near the top, and an "Evidence and links" section on every ready project and article.
- The drone is a procedural model, captioned as such; stock drone video is never presented as Rami's footage.
- PRODUCT.md's brand commitments (Zalando Sans, Fraunces, black/neutral) describe the live site; this exploration supersedes them only inside `/v2` until Rami promotes it.

## Unresolved

- Which parts of `/v2` get promoted to the live routes, and when.
