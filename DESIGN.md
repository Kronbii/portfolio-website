---
name: Rami Kronbi — The Engineering Notebook (/v2)
description: Rami's engineering record kept as a notebook; warm near-black and cream ink, one burgundy accent, hairline structure, mono figures.
colors:
  ground: "#0e0b0b"
  surface: "#1a1414"
  raised: "#221a1a"
  sunk: "#0a0808"
  hair: "rgba(251, 245, 234, 0.12)"
  hair-strong: "rgba(251, 245, 234, 0.24)"
  grid: "rgba(251, 245, 234, 0.045)"
  ink: "#fbf5ea"
  ink-2: "rgba(251, 245, 234, 0.7)"
  ink-3: "rgba(251, 245, 234, 0.52)"
  burgundy: "#c9686a"
  burgundy-strong: "#e08a8b"
  burgundy-ink: "#0e0b0b"
  burgundy-tint: "rgba(201, 104, 106, 0.1)"
  burgundy-wash: "rgba(201, 104, 106, 0.18)"
  warn: "#e3b341"
  paper-ground: "#ffffff"
  paper-surface: "#f6f4f0"
  paper-raised: "#efebe4"
  paper-hair: "#e7e3dc"
  paper-hair-strong: "#cfc9bf"
  paper-ink: "#15171a"
  paper-ink-2: "#3a3d42"
  paper-ink-3: "#64676d"
  paper-burgundy: "#8c3839"
  paper-burgundy-strong: "#6b2a2b"
  paper-warn: "#9a6700"
typography:
  display:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(3.25rem, 7.4vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 5.6vw, 4.75rem)"
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: "-0.04em"
  entry-title:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(2.375rem, 5.2vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 2.7vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  row-title:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "-0.015em"
  lede:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1.4vw, 1.25rem)"
    fontWeight: 500
    lineHeight: 1.55
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.55
    fontFeature: "'ss01' 1"
  article-body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1.25vw, 1.1875rem)"
    fontWeight: 500
    lineHeight: 1.72
  emphasis:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "1.08em"
    fontWeight: 400
    letterSpacing: "-0.01em"
  margin-note:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    letterSpacing: "0.12em"
  figure:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "1.25rem"
    fontWeight: 500
    letterSpacing: "-0.02em"
    fontFeature: "'tnum' 1"
rounded:
  tile: "26px"
  card: "20px"
  plate: "14px"
  chip: "12px"
  pill: "999px"
spacing:
  gutter: "clamp(1rem, 3.2vw, 2rem)"
  wrap: "1440px"
  nav-h: "64px"
  column-gap: "clamp(1.5rem, 3vw, 3rem)"
  section-block: "clamp(3.5rem, 7vw, 6rem)"
  cell: "clamp(1.25rem, 2.6vw, 2rem)"
components:
  pill:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "40px"
  pill-hover:
    backgroundColor: "{colors.surface}"
  pill-primary:
    backgroundColor: "{colors.burgundy}"
    textColor: "{colors.burgundy-ink}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "40px"
  pill-primary-hover:
    backgroundColor: "{colors.burgundy-strong}"
  filter-pill:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "36px"
  filter-pill-pressed:
    backgroundColor: "{colors.burgundy-tint}"
    textColor: "{colors.ink}"
  tag:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    height: "26px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "38px"
  nav-link-active:
    backgroundColor: "{colors.burgundy-tint}"
    textColor: "{colors.ink}"
  plate:
    backgroundColor: "{colors.sunk}"
    rounded: "{rounded.plate}"
  panel-cell:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "clamp(1.25rem, 2.6vw, 2rem)"
---

# Design System: Rami Kronbi — The Engineering Notebook (/v2)

> **Scope.** This world applies only inside `/v2`, a parallel `noindex` preview of every page (home, projects, project entries, writing, articles, topics, topic hubs) that Rami is exploring before promoting parts of it to the live routes. Every token is scoped to the `[data-v2]` root (`src/components/v2/v2.css`). The live site at the root routes still runs the older system (Zalando Sans, Fraunces, black and neutral), and PRODUCT.md's brand commitments still describe that older system. Nothing here describes the live root routes. Which parts get promoted, and when, is unresolved.

## Overview

**Creative North Star: "The Engineering Notebook"**

The site is kept as Rami's engineering record: numbered entries, figures, margin notes, cross-references, a witness line, and his real signature closing the record. Every entry shows a system working, its limits, and where the evidence lives. The world refuses the portrait hero, the bio block, and the equal-card developer-portfolio grid; pages open on the mechanism itself (a draggable procedural quadrotor specimen on the home spread, an entry's plate or a live signal-flow figure on project pages).

Material is a warm near-black ground with cream ink and a single burgundy accent, inverted to a paper-white light theme that follows the system setting with a stored toggle. Structure is drawn, not filled: 1px hairlines divide rows, panels, and grids; panels built from cells use a 1px gap over a hairline background so the rule lines are the only fill. Words are Manrope, every figure and data label is JetBrains Mono, and one Instrument Serif italic word per heading carries the voice. Everything pressable is a pill.

Density is editorial, not dashboard: a 3/9 margin-and-body grid on records, a 7/5 spread on home, sticky section heads in the margin, generous section breaks. Motion is mechanical and purposeful: sheets slide over the contents with mass, index rows rerank in place, plates develop into view; nothing else enters on scroll.

**Key Characteristics:**
- Warm near-black ground, cream ink, burgundy as the only non-ink colour.
- Hairline structure (1px rules at 12% and 24% ink); fills only for state.
- Manrope words, JetBrains Mono figures and labels, one Instrument Serif italic word per heading.
- Every pressable control is a fully rounded pill.
- Real media as numbered FIG. plates in hairline frames; code-native diagrams where no imagery exists.
- A short burgundy tick (22×2) above a mono caps panel label.
- Graph paper as an 80px hairline grid inside specimen plates and the topic tray.

## Colors

One warm dark ground in three depths, cream ink in three strengths, and a single burgundy that does all the signalling.

### Primary
- **Notebook Burgundy** (`burgundy`; `paper-burgundy` on light): primary pills, the contact pill, the active dock item, the italic heading word, entry and step numbers, the 22×2 panel tick, the scroll progress rule, selection, focus outlines, moved-row marks, and live readout steps.
- **Burgundy Strong** (`burgundy-strong`; `paper-burgundy-strong`): hover state for burgundy fills only.
- **Burgundy Tint / Wash** (`burgundy-tint`, `burgundy-wash`): pressed filter pills, the active nav link, cursor press and drag rings, the faint radial glow at the base of specimen and light-field plates.
- **Burgundy Ink** (`burgundy-ink`): text on burgundy fills (ground black on dark, white on paper).

### Tertiary
- **Review Amber** (`warn`; `paper-warn`): reserved for the review-state notice on records that render for local review only. Not a decorative colour.

### Neutral
- **Warm Near-Black** (`ground`): the page ground and the fill of panel cells, so the hairline gap reads as the rule.
- **Ember Surface** (`surface`): hover fill for rows, pills, and links; the signal-flow figure ground; the phone dock.
- **Raised** (`raised`): the third ground step.
- **Sunk** (`sunk`): plate and media frames, the ticker strip.
- **Cream Ink** (`ink`), **Ink 2** (`ink-2`, 70%), **Ink 3** (`ink-3`, 52%): headings and body; secondary copy and ledes; labels, meta, and captions.
- **Hairline** (`hair`, 12%) and **Hairline Strong** (`hair-strong`, 24%): every row rule, frame, and pill border; strong for pill outlines, rails, and list heads.
- **Graph Rule** (`grid`, 4.5%): the 80px graph-paper lines.
- **Paper** (`paper-ground`, `paper-surface`, `paper-raised`, `paper-hair`, `paper-hair-strong`, `paper-ink` to `paper-ink-3`): the light theme; same roles, swapped under `data-theme='light'`.

### Named Rules
**The One Accent Rule.** Burgundy is the only colour that is not ink. Amber exists only to mark review-state records. No second accent, no gradients between hues.

**The Hairline-Not-Fill Rule.** Structure comes from 1px rules. Surface fills appear only as state (hover, pressed, active) or as the ground of a figure; panels are cells over a hairline gap, never filled cards.

## Typography

**Display Font:** Manrope (with system-ui, sans-serif), weights 400–800, stylistic set `ss01` on.
**Emphasis Font:** Instrument Serif italic (with Georgia, serif).
**Label/Mono Font:** JetBrains Mono (with ui-monospace, monospace), tabular figures.

**Character:** A tight, heavy grotesque does the talking; one serif italic word per heading lends a handwritten notebook voice; mono carries every number, unit, and label like an instrument readout.

### Hierarchy
- **Display** (`display`): the home name only, the largest type in the world, kept below 6rem.
- **Headline** (`headline`): home section headings and the marquee words.
- **Entry Title** (`entry-title`): project and article titles at the head of a record, held to 18ch (22ch for long titles at a smaller clamp, 2.125–3.75rem).
- **Title** (`title`): record section headings in the sticky margin.
- **Row Title** (`row-title`): evidence and cross-reference rows, role rows, flow node titles; index titles scale to clamp(1.125rem, 1.9vw, 1.5rem).
- **Lede** (`lede`): the plain-language opener under a title, held to 62ch, ink-2.
- **Body** (`body`) and **Article Body** (`article-body`): UI copy at 1rem; long-form articles at 1.0625–1.1875rem / 1.72, measure 68ch; the first paragraph lifts to 1.15em.
- **Emphasis** (`emphasis`): one italic serif word inside a heading, burgundy, lifted to 1.08em to match the sans x-height.
- **Margin Note** (`margin-note`): limits and field notes in the procedure margin and entry notes, ink-2.
- **Label** (`label`): mono, uppercase, 0.6875rem, 0.10–0.12em tracking, ink-3: breadcrumbs, panel labels, row kinds, figure labels, table heads, meta labels.
- **Figure** (`figure`): entry numbers and readings; reading values cap at 2.125rem and size to their container.

### Named Rules
**The One Italic Word Rule.** A heading carries at most one Instrument Serif italic word, chosen in content, never a whole line and never in body copy.

**The Mono Figure Rule.** Every number, unit, period, count, and data label is JetBrains Mono with tabular figures. Words are never set in mono except labels.

**The Tracking Floor Rule.** Display tracking stops at -0.04em; caps labels open to 0.10–0.12em (the ticker to 0.18em).

## Layout

A 1440px wrap with a fluid gutter (`gutter`), centred. Records use a 3/9 margin-and-body grid (`column-gap`): the margin holds the entry number, meta, topics, sticky section heads, and the article contents list; the body holds the lede, panels, and prose. The home spread is 7/5 (specimen plate left, name, claim, and numbered contents right) and fills the viewport under a 64px bar and the ticker. Home entries alternate named layouts (wide 3/6/3, left 7/5, right 5/7, compare, figure) so no two neighbours repeat a shape. Figures pack as two balanced columns (min 300px) keeping their own proportions. Section breaks are a hairline plus `section-block` padding.

Responsive: at 960px the margin grids collapse to one column, sticky heads release, and the entry number hangs on the title's baseline; at 900px the top nav and contact pill give way to a floating bottom dock and the cursor companion and hover plates switch off; at 760px the signal flow turns vertical; at 640px two-cell panels stack and rows drop their kind column; at 420px the brand tag hides. No horizontal overflow at 390px.

**The Margin Column Rule.** Metadata, numbers, and section heads live in the left margin column; the body column is reserved for the record itself.

## Elevation & Depth

Flat by default. Depth comes from the three ground steps (sunk, ground, surface) and hairlines, not shadow. One soft drop (`0 24px 60px -24px` at 70% black; 28% ink on paper) is reserved for things that float above the page: the phone dock and the cursor-following hover plate on index rows. The forward sheet transition casts a single upward shadow under the incoming page while it travels.

### Shadow Vocabulary
- **Float** (`--shadow`): phone dock, index hover plate.
- **Sheet edge** (`0 -30px 80px rgba(0,0,0,0.45)`): only on the incoming page during a forward sheet transition.
- **Knob** (`0 6px 18px -6px rgba(0,0,0,0.6)`): the wipe-compare handle over media.

**The Flat-At-Rest Rule.** Nothing on the page surface casts a shadow; only floating chrome and moving sheets do.

## Shapes

Rounded but not soft. Four container radii by scale: tile (26px) for the large interactive fields (specimen, topic tray), card (20px) for panels, signal-flow figures, readings, and continue links, plate (14px) for media frames and hover plates, chip (12px) for the review notice. Every pressable control is a full pill (999px); step and flow nodes are 40px circles; the panel tick is 22×2 with a 1px radius. Frames clip their media (`overflow: hidden`) and carry a 1px hairline border.

**The Everything-Pressable-Is-A-Pill Rule.** Buttons, nav links, filters, tags, the dock, and the skip link are pills; nothing pressable has a square or card corner.

## Components

### Buttons (pills)
- **Shape:** full pill (999px), 40px tall, 16px inline padding, 0.875rem semibold Manrope at -0.01em.
- **Primary:** burgundy fill, burgundy-ink text, bold; hover to burgundy-strong.
- **Secondary:** transparent with a hair-strong border and ink text; hover fills surface and the border lifts to ink-3.
- **Hover / Focus:** 180ms colour transitions on `cubic-bezier(0.2, 0.8, 0.2, 1)`; a trailing arrow nudges 2px up-right on hover; press scales to 0.97; focus is a 2px burgundy outline at 3px offset.
- **Icon button:** 40px circle with a hair-strong ring (theme toggle).

### Chips (filters and tags)
- **Filter:** 36px pill, hairline border, ink-2; pressed fills burgundy-tint with a 50% burgundy border and turns its mono count burgundy.
- **Tag:** 26px pill, hairline border, mono 0.6875rem at 0.04em; as a link, hover turns border and text burgundy.

### Cards / Containers (panels)
- **Corner Style:** card (20px), clipping its cells.
- **Background:** cells on ground over a hairline gap of 1px; hover fills surface where a cell is a link.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Internal Padding:** `cell`.
- The plain-terms answer panel is two by two (what, problem, how, role), each cell headed by a tick label; readings auto-fill at min 220px with mono values.

### Navigation
- **Bar:** sticky 64px, ground fill, hairline bottom; brand wordmark at 800 / -0.035em with a burgundy dot and a mono caps tag; centred pill links with mono counts; contact pill at the end. Active link fills burgundy-tint with a 45% burgundy border. A 2px burgundy scroll-progress rule rides the top edge.
- **Phone:** a floating pill dock at the bottom (surface, hair-strong ring, float shadow); items are 44px; the active item fills burgundy and shows its label.
- **Breadcrumbs:** mono caps label row, hair-strong separators, hover to burgundy.

### Plates (FIG.)
Hairline frame on sunk at plate radius; a caption row below pairs a mono caps FIG. label with ink-3 caption text. Plates develop into view once: a clip from 26% inset, a 6px blur and desaturation, and a 1.035 scale resolving to rest across entry 0% to cover 30%, from an already visible state, only where `animation-timeline: view()` is supported and motion is allowed.

### Link Rows
Evidence, cross-references, and index lists are hairline-ruled rows: a 9rem mono caps kind column, a bold title with an ink-2 note, and a mono end column with an arrow that nudges 3px up-right and turns burgundy on hover; the row fills surface on hover.

### Index Rerank
Topic filters rerank index rows in place: rows keep identity and animate to their new order; non-matching rows dim to 42% and restore on hover or focus; a moved row holds a 1px burgundy mark at its left edge and a burgundy number until noticed. A mono status line announces the result.

### Signal Flow
A code-native figure for software without imagery: 40px mono-numbered circular nodes on a hairline rail over a 40px graph ground at card radius; the rail fills burgundy to the active node, which fills burgundy and scales 1.12; a readout under a hairline shows the active stage. Vertical with inline details below 760px.

### Procedure and Margin Notes
Numbered steps on a hair-strong spine with 40px circular mono numbers (hover to burgundy); a sticky margin of serif-italic notes behind a hairline, headed by a tick label.

### Signature Interactions
- **Drone specimen (home):** procedural quadrotor on an 80px graph-paper plate at tile radius, draggable, self-levelling on release, with leader-lined mono callouts and a live roll/pitch/yaw readout; captioned as procedural.
- **Light-tracker field (home):** a PD-control field the visitor steers with the cursor, with a burgundy radial wash.
- **Sheet transitions (site):** opening an entry slides its sheet up from 16vh with a slight overshoot (640ms) while the contents scale to 0.955 and fade to 45% beneath; returning drops the sheet and raises the contents. The header is excluded from the transition. Disabled under reduced motion.
- **Physics topic tray (topics):** topic pills thrown in a physics field always settle back onto the 80px module grid.
- **Ticker and marquee (home):** a mono caps ticker on sunk with burgundy dot separators, and a two-row headline marquee; both pause on hover.
- **Cursor companion:** a 30px hairline ring that grows to 48px (press) and 64px (drag) with a burgundy tint; hidden on coarse pointers.
- **Sign-off:** Rami's real signature, masked, closes the home record.

## Do's and Don'ts

### Do:
- **Do** scope every token and rule under `[data-v2]`; the live site must never see it.
- **Do** keep burgundy as the only accent, and use amber only for the review notice.
- **Do** draw structure with 1px hairlines (`hair`, `hair-strong`) and build multi-cell panels as cells over a 1px hairline gap.
- **Do** set every number, unit, and data label in JetBrains Mono with tabular figures.
- **Do** give each heading at most one Instrument Serif italic word in burgundy.
- **Do** make every pressable control a pill (999px) with a 2px burgundy focus outline at 3px offset.
- **Do** head panels with the 22×2 burgundy tick above a mono caps label.
- **Do** show real media as numbered FIG. plates in hairline frames, and build a code-native signal flow from verified stages where no imagery exists.
- **Do** keep article measure at 68ch, display below 6rem, and tracking no tighter than -0.04em.
- **Do** keep content visible by default and honour `prefers-reduced-motion` on every motion idea.

### Don't:
- **Don't** describe the live root routes as using this world; they run the older Zalando Sans, Fraunces, black and neutral system until Rami promotes parts of `/v2`.
- **Don't** add a second accent colour, gradient text, or glass surfaces.
- **Don't** fill containers to separate them; use the ground steps and hairlines.
- **Don't** cast shadows on resting page surfaces; shadows belong to floating chrome and moving sheets.
- **Don't** animate anything into view on scroll except plates developing.
- **Don't** open a page on a centred title block, portrait hero, or bio; open on the mechanism.
- **Don't** lay entries out as a grid of equal-size cards.
- **Don't** present stock drone footage as Rami's; the specimen is procedural and captioned as such.
