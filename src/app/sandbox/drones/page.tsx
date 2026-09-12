'use client'

import { useState } from 'react'

import { DroneStage } from '@/components/three/drone/drone-stage'
import { type DroneVariant } from '@/components/three/drone/behaviors'

/**
 * Drone gallery — every model and every archived behaviour in one place.
 *
 * One WebGL context, switched, rather than a grid of live canvases: contexts
 * cap around 16 per page and a grid crashes the renderer.
 */

const MODELS = [
  { id: 'procedural', label: 'Procedural', note: 'Built in code from geometry.ts — named part handles, so behaviours can drive rotors, booms, gimbal and nav lights individually.' },
  { id: '/models/quadcopter.glb', label: 'Quadcopter', note: 'Consumer-drone silhouette with props, landing gear and gimbal. The best of the three.' },
  { id: '/models/racing-quad.glb', label: 'Racing quad', note: 'Lighter, more aggressive frame.' },
  { id: '/models/fixed-wing-uav.glb', label: 'Fixed-wing UAV', note: 'Predator-style fixed wing — reads as surveillance rather than consumer.' },
] as const

// The sourced models ship as light grey plastic and the archive's body colour
// is near-black, which disappears on this ground. Offer the realistic options.
const TINTS = [
  { id: 0x3a434e, label: 'Graphite' },
  { id: 0x1a1e24, label: 'Body (archive)' },
  { id: 0x9d201a, label: 'Accent' },
  { id: 0xb8bfc7, label: 'Bare' },
] as const

const VARIANTS: { id: DroneVariant; label: string; note: string }[] = [
  { id: 'orbit', label: 'Orbit', note: 'Camera circles a hovering airframe. The safest hero loop.' },
  { id: 'turntable', label: 'Turntable', note: 'Product-shot rotation, camera fixed.' },
  { id: 'exploded', label: 'Exploded', note: 'Parts separate along their axes — reads as a systems diagram.' },
  { id: 'plan', label: 'Plan', note: 'Top-down orthographic-feeling view.' },
  { id: 'approach', label: 'Approach', note: 'Flies toward camera and settles.' },
  { id: 'descent', label: 'Descent', note: 'Controlled landing, gear-first.' },
  { id: 'scan', label: 'Scan', note: 'Gimbal sweeps while the airframe holds — the RSMS motion.' },
  { id: 'bank', label: 'Bank', note: 'Rolls into a turn and recovers.' },
  { id: 'swarm', label: 'Swarm', note: 'Four extra low-poly airframes in formation.' },
  { id: 'scrub', label: 'Scrub', note: 'Pose driven purely by progress — meant for scroll, looping here.' },
]

export default function DronesSandboxPage() {
  const [model, setModel] = useState<string>(MODELS[1].id)
  const [variant, setVariant] = useState<DroneVariant>('orbit')
  const [tint, setTint] = useState<number>(TINTS[0].id)
  const [wireframe, setWireframe] = useState(false)
  const [draggable, setDraggable] = useState(false)

  const activeModel = MODELS.find((m) => m.id === model)
  const activeVariant = VARIANTS.find((v) => v.id === variant)

  const chip =
    'border border-border px-3 py-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] transition-colors duration-base'

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto w-full max-w-[90rem] px-5 pt-40 sm:px-8">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.3em] text-muted-foreground">
          Sandbox — drone models &amp; behaviours
        </p>
        <h2 className="mt-6 text-5xl leading-[0.95] tracking-tight sm:text-6xl">
          Everything in the archive.
        </h2>
        <p className="mt-8 max-w-[60ch] text-base leading-[1.7] text-muted-foreground">
          Three sourced models plus the procedural airframe, against all ten
          behaviours from <code className="text-foreground">behaviors.ts</code>.
          Rendered with raw three.js — react-three-fiber cannot run on this
          branch. Drag mode works on any model.
        </p>
      </div>

      <div className="mx-auto mt-16 grid w-full max-w-[90rem] gap-10 px-5 pb-32 sm:px-8 lg:grid-cols-[1fr_20rem]">
        <div className="relative h-[68svh] overflow-hidden rounded-[2px] border border-border bg-surface">
          <DroneStage
            key={`${model}-${variant}-${wireframe}-${draggable}-${tint}`}
            source={model}
            variant={variant}
            wireframe={wireframe}
            draggable={draggable}
            tint={tint}
            className="h-full w-full"
          />
          <p className="pointer-events-none absolute bottom-0 left-0 bg-background px-3 py-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
            {activeModel?.label} · {draggable ? 'drag' : activeVariant?.label}
          </p>
        </div>

        <aside className="flex flex-col gap-8">
          <div>
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
              Model
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  className={`${chip} ${model === m.id ? 'bg-foreground text-background' : 'hover:bg-surface'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {activeModel?.note}
            </p>
          </div>

          <div>
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
              Behaviour
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {VARIANTS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setVariant(v.id)
                    setDraggable(false)
                  }}
                  disabled={draggable}
                  className={`${chip} ${variant === v.id && !draggable ? 'bg-foreground text-background' : 'hover:bg-surface'} disabled:opacity-40`}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {activeVariant?.note}
            </p>
          </div>

          <div className="border-t border-border pt-8">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
              Tint
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {TINTS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setTint(c.id)}
                  className={`${chip} flex items-center gap-2 ${tint === c.id ? 'bg-foreground text-background' : 'hover:bg-surface'}`}
                >
                  <span
                    className="inline-block h-3 w-3 border border-border"
                    style={{ background: `#${c.id.toString(16).padStart(6, '0')}` }}
                  />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-border pt-8">
            <button
              onClick={() => setDraggable((v) => !v)}
              className={`${chip} ${draggable ? 'bg-brand text-brand-foreground' : 'hover:bg-surface'}`}
            >
              Drag mode
            </button>
            <button
              onClick={() => setWireframe((v) => !v)}
              className={`${chip} ${wireframe ? 'bg-brand text-brand-foreground' : 'hover:bg-surface'}`}
            >
              Wireframe
            </button>
          </div>

          <p className="border-t border-border pt-8 text-xs leading-relaxed text-muted-foreground">
            The three .glb models are CC-BY from Poly Pizza and ship as light
            grey plastic; they are retinted at runtime. Attribution is required
            before any of this goes public, and the individual creator names are
            still missing from public/models/CREDITS.md.
          </p>
        </aside>
      </div>
    </main>
  )
}
