# Handoff

Written at the end of a trial session. The design work from that session was
explored and set aside; this document exists so the next session starts with the
context, not the conclusions.

**Nothing here constrains the design direction.** Where this document says "we
tried X", that is information about what has already been seen, not a rule.
Rami has seen those attempts and wants to go again. Form your own view.

---

## 1. Where the repo is right now

| Branch / ref | What it is |
|---|---|
| `main` (`940d740`) | Exactly what ramikronbi.com serves today. Title still reads "Rami Kronbi \| AI Systems Engineer". |
| **`redesign/v2`** | **The working branch.** Branched off `main`, plus the content rewrite and the 3D/video assets. This is where new work goes. |
| `redesign/vatn-inspired-3d` | Archived exploration. Full drone system, video stage, rebuilt sections, project detail pages. Not merged, not deployed. |
| tag `drone-system-v1` | Points at the archive tip. Use this to retrieve anything from it. |

Retrieve any file from the archive without switching branches:

```bash
git checkout drone-system-v1 -- src/components/three/drone
git checkout drone-system-v1 -- src/components/ui/video-stage.tsx
git show drone-system-v1:src/components/sections/home-about.tsx
```

`redesign/v2` currently renders the **old visual design with corrected copy**.
That is deliberate: the copy work was worth keeping, the layout was not.

Nothing has been pushed to `origin`. The archive is local only.

---

## 2. Who Rami is — the positioning that matters

An engineer who builds systems that sense the physical world and act on it.

The site must hold three categories apart and never blur them:

1. **Done professionally** — Embedded Systems & Vision Engineer at Oreyeon since
   2024, working on the Runway Surface Monitoring System: real-time perception on
   edge hardware, running in live airport operations.
2. **Demonstrated strengths** — embedded systems, computer vision, control,
   real-time software, system integration. Mechatronics engineering at Rafik
   Hariri University, graduated 2025 with the Nazik Rafik Hariri Graduate Studies
   Award (a full master's scholarship). `easyPID` published in the Arduino
   Library Manager. Three engineering essays on dev.to.
3. **Moving toward** — robotics, autonomous and aerial systems, and research
   collaboration. This is a direction and an ask, never a credential.

**He has no academic publications.** OpenAlex and Crossref both return zero. Never
write "research", "papers", or "researcher" as something he has. "Looking for
research collaborations" is the honest framing and it is already in the copy.

Two audiences, equally weighted: robotics researchers/professors, and engineering
hiring managers. Both cross-check against his GitHub in the next tab.

His own guiding sentence, asked directly: *"I care more about a good UI that
simply informs."* Not a funnel, not persuasion theatre.

Voice: technically credible, concrete, grounded. He explicitly rejects
"cutting-edge", "innovative", "passionate about", generic AI language, and being
reduced to "AI developer" or "computer vision guy".

---

## 3. What Rami said he wants, in his own words

- The style of **vatn.com** (underwater defence-tech site) — dark, industrial,
  cinematic, giant type, hardware as the visual anchor.
- His **old about page**: one enormous statement filling the screen. He picked
  this over an info-card layout when shown both.
- **High-quality video backgrounds with 3D models over them and text.**
- **Animations and video backgrounds that play as you scroll.**
- The **procedural drone machines** and the **draggable quadcopter** — he named
  both specifically as things to keep.
- **Use real component libraries, don't hand-roll.** He was explicit about this
  after a session that built too much from scratch.
- **Source 3D models and animations online first**; only build from scratch if
  nothing suitable exists.
- He described the work as **experimental** — "go all out, try all your ideas,
  I'll pick what I want later."

---

## 4. Assets already on `redesign/v2`

**`public/models/`** — 3 drone models, CC-BY from Poly Pizza, see `CREDITS.md`.
`quadcopter.glb` is the best of them (consumer-drone silhouette, props, landing
gear, gimbal). They ship as light grey plastic and need retinting to whatever
palette you choose. **Attribution is required** and the individual creator names
still need to be filled into `CREDITS.md` before this goes public.

**`public/videos/`** — 8 clips + posters from Coverr (free, no attribution
required), web-encoded. `ridge`, `cloud`, `pylon`, `wing`, `launch`, `flight`,
plus `cloud-scrub` and `ridge-scrub` which are keyframe-dense for scroll-scrubbed
playback. All daylight-bright; they need heavy grading to sit on a dark ground.

These are **stock, not Rami's footage** — he approved that knowingly after being
shown the implication. Keep them as atmosphere; never caption or frame one so a
visitor reads it as documentation of his own work. If he ever supplies real
footage (runway/MDU, the WRO car, bench work), it beats all of this.

**In the archive, not on this branch:** `src/components/three/drone/` — a
procedural quadrotor with named part handles and 10 behaviors (orbit, exploded,
scan, plan, turntable, approach, descent, bank, swarm, scrub), a drei-based GLB
viewer with a draggable mode, a whole-page scroll flight path, a lazy mount, and
a WebGL context budget. Also `video-stage.tsx` (full-bleed video with loop and
scroll-scrub modes, lazy loading, reduced-motion handling). Pull across whatever
is useful.

---

## 5. Technical landmines — these cost real time

**React 19 is required for anything using react-three-fiber.** `main` is on React
18. R3F's reconciler reads `ReactCurrentBatchConfig`, which Next 16's vendored
React does not expose, so *every* `<Canvas>` throws and the page dies with "This
page couldn't load". R3F v8 + React 18 fails identically. The fix is React 19 +
`@react-three/fiber` v9 + `@react-three/drei` v10. `framer-motion@10` does not
survive that upgrade — move its two imports to `motion/react` (v12, same API).
Raw three.js has no such problem and works fine on React 18.

**R3F must be client-only on routes.** Even as a `'use client'` component it gets
prerendered at build time and throws. Wrap it with
`dynamic(() => import('./x'), { ssr: false })`.

**shadcn registries are already wired** in `components.json`: `@magicui`,
`@aceternity`, `@react-bits`, `@scrollxui`. `lightswind` is installed with ~140
components including a `3d-model-viewer`. Note the magicui CLI injects **Tailwind
v4** syntax (`@theme inline`) into `globals.css` and this project is on **v3** —
move those keyframes to `tailwind.config.ts` and delete the v4 block. `@react-bits`
returns HTML instead of JSON; that registry URL appears broken.

**WebGL contexts cap around 16 per page.** A grid of live canvases will crash the
renderer. `use-canvas-slot.ts` in the archive solves this.

**Stale dev servers are a real trap.** This machine accumulated ~20 servers on
ports 3111–3300, several from other projects on a different Next version. One on
**:3199** served a cached mid-work snapshot for hours and convinced Rami nothing
had changed. Before telling him to look at anything, check what is actually
listening and what it serves:

```bash
ss -ltnp | grep -E ':3[0-9]{3}'
curl -s localhost:PORT | grep -o '<title>[^<]*'
```

And remember `main` is what's deployed — work on a branch is invisible on
ramikronbi.com until merged and pushed.

---

## 6. Facts that still need Rami to confirm

The copy on `redesign/v2` is written to be defensible, but these are unresolved.
Do not let new copy re-inflate them.

1. **WRO 2023 "Champion"** — his own repo README records participation and no
   placement. The only RHU record of a Brainiacs first place is the **2024**
   season with different members. The claim is currently in the project title.
   Highest-risk item on the site.
2. **229+ FPS** (thermal super-resolution) — contradicted by his own published
   article (~130 FPS at 2× on RTX 3070, 20–30 FPS on Jetson Orin). The corrected
   numbers are now in the copy; the origin of 229 is unknown.
3. **NASA Space Apps role** — softened to "organizing team". The one 2022 source
   calls him "the student volunteer from RHU" and names someone else as Local
   Lead.
4. **Nasna** — no independent trace of any kind. Founder status unconfirmed.
5. **space²** — zero public footprint. Everything about it is first-party from
   Rami. Currently appears as an Experience entry.
6. **The 4+ / 10+ / 5+ counters** — all three unverified and all three
   contradicted by the site's own content. The old About section still renders
   them on this branch. Removing them is a design decision, not just a copy one.
7. Also open: Oreyeon start date and exact job title (public sources say
   "Computer Vision Engineer", his site says "Embedded Systems & Vision
   Engineer"), the freelance period `2023 – 2026` which overlaps Oreyeon,
   OmniSign accuracy and award details, whether the smart desk is named "BEMO",
   and whether Physics Day is national or RHU's.

Oreyeon's own published figures were used to correct several claims already —
`$23B` not `$4B`, "aligned with ICAO and FAA" never "certified", "under five
minutes" not "3–4 minutes", Madrid as offices and trials rather than a
deployment. Those corrections are load-bearing; don't undo them.

---

## 7. What the next session is actually for

Rami wants to redesign the site, starting from this baseline, implementing edits
he will describe. He has not yet given those edits — the trial session ended
before that started.

Open when the trial ended:

- The old About section renders an empty `paragraphs` array and the unverified
  counters.
- Nothing has been pushed to `origin`.
- `agents.md` holds the project's engineering conventions (content lives in
  `src/content`, vendor components get wrapped under `src/components/ui`, strict
  import boundaries). Those are real conventions, worth following. Its *design*
  defaults — `#0c0c0c`, `#9d201a`, Zalando Sans — were written for the current
  look and are open to change in a redesign.

Ask him what he wants and build it. Don't re-litigate the direction that was set
aside, and don't assume the archive's aesthetic is the target.
