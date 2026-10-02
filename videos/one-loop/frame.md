---
name: One Loop — Rami Kronbi showreel
description: The /v2 Engineering Notebook at frame scale. Warm near-black, cream ink, one burgundy signal.
source: ../../DESIGN.md
colors:
  ground: "#0e0b0b"
  surface: "#1a1414"
  sunk: "#0a0808"
  hair: "rgba(251, 245, 234, 0.12)"
  hair-strong: "rgba(251, 245, 234, 0.24)"
  grid: "rgba(251, 245, 234, 0.045)"
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
    lineHeight: 0.9
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
  arabic:
    fontFamily: "Noto Naskh Arabic"
    fontWeight: 700
rounded:
  plate: "18px"
  page: "28px"
  pill: "999px"
---

## Overview

The site's world at frame scale. One idea owns every frame: a single burgundy control signal that never breaks, writing a notebook page row by row.

## The Frame

- Ground is #0e0b0b everywhere. No full-screen linear gradients (they band under H.264); depth comes from a radial burgundy glow and film grain.
- Burgundy #c9686a belongs to the signal: the line, its head, the setpoint, entry numbers, and the one italic word per title. Nothing else is colored.
- Structure is hairlines, never filled cards. Real media sits in plates with an 18px radius and a hair border.
- The signal is the notebook's rule: titles sit above it, figures below it.

## Type at frame scale

- Display (the name): Manrope 800, about 220px, tracking -0.04em.
- Station titles: Manrope 700, 64–76px; one Instrument Serif italic word in burgundy, never more.
- Figures: JetBrains Mono 600, tabular, 96–120px; units at 0.4em in ink-3.
- Labels: JetBrains Mono 500, 20–22px, uppercase, 0.12em tracking, ink-3.
- Entry numbers (No. 01): JetBrains Mono 500, 26px, burgundy; they index the page, so they sit one step above labels.
- Frame chrome (HUD, roll readout keys, footer credit): JetBrains Mono 500, 17–18px, ink-2/ink-3. It is chrome, never content, so it stays quieter than any label.
- Arabic: Noto Naskh Arabic 700 for the one Arabic word, دليل (Daleel's own name), stroked in burgundy. No other script.

## Composition Rules

- The virtual camera follows the signal's head; stations are places it passes through and holds on.
- Titles are edge-anchored on a left column; nothing centered-and-floating until the page reveal.
- Every simulation is labelled simulated; every number comes from the authority records.

## Don't

- No neon, no cyan, no gradient text, no glass, no second accent hue, no emoji, no icon tiles.
- No claims beyond the records.
