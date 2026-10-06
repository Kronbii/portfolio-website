---
name: ARMED — Rami Kronbi showreel
description: The /v2 Engineering Notebook at full throttle. Warm near-black, cream ink, burgundy signal; cut on a 128 BPM grid.
source: ../../DESIGN.md
colors:
  ground: "#0e0b0b"
  surface: "#1a1414"
  sunk: "#0a0808"
  hair: "rgba(251, 245, 234, 0.12)"
  hair-strong: "rgba(251, 245, 234, 0.24)"
  ink: "#fbf5ea"
  ink-2: "rgba(251, 245, 234, 0.7)"
  ink-3: "rgba(251, 245, 234, 0.52)"
  burgundy: "#c9686a"
  burgundy-strong: "#e08a8b"
typography:
  display:
    fontFamily: "Manrope"
    fontWeight: 800
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Manrope"
    fontWeight: 700
    letterSpacing: "-0.035em"
  emphasis:
    fontFamily: "Instrument Serif"
    fontStyle: italic
    fontWeight: 400
  label:
    fontFamily: "JetBrains Mono"
    fontWeight: 500
    letterSpacing: "0.12em"
  figure:
    fontFamily: "JetBrains Mono"
    fontWeight: 600
    letterSpacing: "-0.04em"
rounded:
  plate: "18px"
  pill: "999px"
---

## Overview

The site's world, played loud. The rules stay the same as the notebook: warm black, cream ink, and one burgundy accent. The pace is what changes. Every beat is a cut, a slam, or a new layer coming online.

## The Frame

- The ground is #0e0b0b. There are no full-screen linear gradients; depth comes from radial burgundy glows, film grain, and the 3D layer.
- Burgundy #c9686a is the machine's signal: OSD states, lock brackets, features, the trace, entry numbers, and the one italic word. Inversion frames (cream ground, ground-coloured ink) are allowed for one beat at a time as strobe accents.
- Real media sits in plates with an 18px radius. The vision passes are drawn in palette colours: edges in ink, features and locks in burgundy.
- Chromatic ghosting uses a burgundy copy, never an RGB/cyan split.

## Type at frame scale

- Display slams: Manrope 800, 240–420px, cropped by the frame edge on purpose, tracking -0.04em.
- Titles: Manrope 700, 64–96px. One Instrument Serif italic word per title, in burgundy.
- Figures: JetBrains Mono 600, tabular, 96–160px. Units at 0.4em in ink-3.
- Labels and OSD: JetBrains Mono 500, 20–26px, uppercase, 0.12em tracking.
- Frame chrome (the beat counter and credit): JetBrains Mono 500, 17–18px, ink-3. It is chrome, never content.

## Motion

- 128 BPM; a beat is 0.46875s and a bar is 1.875s. Cuts land on beats, and impacts land on bar downbeats.
- Exits accelerate and entrances decelerate, with velocity matched at the cut. Impacts get a decaying shake and a one-frame flash.
- One idea per beat. No element enters without a verb.

## Don't

- No neon, no cyan, no gradient text, no glass, no second accent hue, no emoji, no icon tiles.
- No claims beyond the ready authority records. Drones are motion design; the review-state drone projects are not shown.
