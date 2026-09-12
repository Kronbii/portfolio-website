'use client'

import { useState } from 'react'

import { VideoStage, type VideoMode } from '@/components/ui/video-stage'
import { homeContent } from '@/content/home'

/**
 * Video-background picker.
 *
 * Every homepage section rendered over every clip, so the choice can be made
 * per section rather than in the abstract. VideoStage is restored from the
 * drone-system-v1 tag unmodified — it is plain React with no R3F, so it runs
 * on this branch as-is.
 *
 * The clips are stock (Coverr), not Rami's footage. They stay atmosphere: none
 * is captioned or framed so a visitor would read it as documentation of his
 * own work.
 */

// Pexels clips are 3840x2160 sources encoded down to 1080p; Coverr clips were
// only ever 1080p. Both sets are capped at 2.2 Mbps because these sit under a
// heavy veil, where bitrate spent on hidden detail is wasted.
const CLIPS = [
  { id: 'none', label: 'None', group: '', note: 'Current: flat ground.' },

  { id: 'dusk-drone', label: 'Dusk drone', group: 'Pexels', note: 'Airframe silhouetted against a sunset sky. The most cinematic of the set.' },
  { id: 'field-drone', label: 'Field drone', group: 'Pexels', note: 'Drone on the ground against industrial cranes. Reads as field hardware, not product shot.' },
  { id: 'thermal-rail', label: 'Thermal rail', group: 'Pexels', note: 'Monochrome night aerial over rail infrastructure — reads as thermal. Ties to the super-resolution project.' },
  { id: 'thermal-city', label: 'Thermal city', group: 'Pexels', note: 'Monochrome night aerial. Same register, wider subject.' },
  { id: 'night-grid', label: 'Night grid', group: 'Pexels', note: 'Night aerial, warm sodium lights. Dark enough to sit under type.' },
  { id: 'inspection', label: 'Inspection', group: 'Pexels', note: 'Aerial infrastructure inspection — closest to the RSMS subject.' },
  { id: 'survey', label: 'Survey', group: 'Pexels', note: 'Monochrome aerial of warehouses. Reads as mapping and survey.' },
  { id: 'machine', label: 'Machine', group: 'Pexels', note: 'CNC cutting, dark with sparks. Hardware texture rather than aerial.' },

  { id: 'launch', label: 'Launch', group: 'Coverr', note: 'Drone pre-launch on the pad.' },
  { id: 'landing', label: 'Landing', group: 'Coverr', note: 'Quadcopter touching down.' },
  { id: 'flight', label: 'Flight', group: 'Coverr', note: 'Airframe in steady cruise against sky.' },
  { id: 'handoff', label: 'Hand-off', group: 'Coverr', note: 'Operator catching a drone out of the air.' },
  { id: 'radar', label: 'Radar', group: 'Coverr', note: 'Rotating radar station.' },
  { id: 'pylon', label: 'Pylon', group: 'Coverr', note: 'Infrastructure inspection.' },
  { id: 'industrial', label: 'Industrial', group: 'Coverr', note: 'Plant and hardware.' },
  { id: 'ridge', label: 'Ridge', group: 'Coverr', note: 'Terrain from altitude. Generic.' },
  { id: 'cloud', label: 'Cloud', group: 'Coverr', note: 'Soft and abstract.' },
  { id: 'wing', label: 'Wing', group: 'Coverr', note: 'Fixed-wing through cloud.' },

  { id: 'launch-scrub', label: 'Launch (scrub)', group: 'Scrub', note: '5-frame GOP — advances only as you scroll.' },
  { id: 'ridge-scrub', label: 'Ridge (scrub)', group: 'Scrub', note: '5-frame GOP — advances only as you scroll.' },
  { id: 'cloud-scrub', label: 'Cloud (scrub)', group: 'Scrub', note: '5-frame GOP — advances only as you scroll.' },
] as const

const SECTIONS = [
  { id: 'hero', label: 'Hero', title: homeContent.hero.title, body: homeContent.hero.description },
  { id: 'about', label: 'About', title: homeContent.about.titleLeading, body: homeContent.about.intro },
  { id: 'work', label: 'Selected work', title: homeContent.projects.title, body: homeContent.projects.description },
  { id: 'community', label: 'Community', title: homeContent.community.title, body: homeContent.community.description },
  { id: 'contact', label: 'Contact', title: homeContent.contact.title, body: homeContent.contact.description },
] as const

export default function VideoBackgroundsSandboxPage() {
  const [choice, setChoice] = useState<Record<string, string>>(
    Object.fromEntries(SECTIONS.map((s) => [s.id, 'none']))
  )
  const [veil, setVeil] = useState(0.72)
  const [mode, setMode] = useState<VideoMode>('loop')

  const chip =
    'border border-border px-3 py-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] transition-colors duration-base'

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto w-full max-w-[90rem] px-5 pt-40 sm:px-8">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.3em] text-muted-foreground">
          Sandbox — video backgrounds
        </p>
        <h2 className="mt-6 text-5xl leading-[0.95] tracking-tight sm:text-6xl">
          Pick a ground per section.
        </h2>
        <p className="mt-8 max-w-[60ch] text-base leading-[1.7] text-muted-foreground">
          Each section below is a real homepage section over a live clip. Set
          one per section and scroll the result. All clips are now 1920x1080 —
          the previous set was 1600x900 at 130-880 kbps, which was the source of
          the blockiness. Still stock footage, not yours: atmosphere only,
          never evidence of your own work.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-border pt-8">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
            Veil {Math.round(veil * 100)}%
          </span>
          <input
            type="range"
            min={0}
            max={95}
            value={veil * 100}
            onChange={(e) => setVeil(Number(e.target.value) / 100)}
            className="w-48 accent-[var(--brand)]"
          />
          <button
            onClick={() => setMode(mode === 'loop' ? 'scrub' : 'loop')}
            className={`${chip} ml-4 hover:bg-surface`}
          >
            Mode: {mode}
          </button>
        </div>
      </div>

      <div className="mt-16">
        {SECTIONS.map((section) => {
          const clip = choice[section.id]
          const body = (
            <div className="mx-auto flex h-full w-full max-w-[90rem] flex-col justify-center px-5 sm:px-8">
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.3em] text-muted-foreground">
                {section.label}
              </p>
              <h3 className="mt-6 max-w-[18ch] text-5xl leading-[0.95] tracking-tight text-foreground sm:text-7xl">
                {section.title}
              </h3>
              <p className="mt-8 max-w-[52ch] text-base leading-[1.7] text-muted-foreground">
                {section.body}
              </p>

              <div className="mt-12 flex flex-wrap gap-2">
                {CLIPS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() =>
                      setChoice((prev) => ({ ...prev, [section.id]: c.id }))
                    }
                    className={`${chip} ${clip === c.id ? 'bg-foreground text-background' : 'bg-background/60 hover:bg-surface'}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                {CLIPS.find((c) => c.id === clip)?.note}
              </p>
            </div>
          )

          return (
            <section
              key={section.id}
              id={`vb-${section.id}`}
              className="relative h-svh border-b border-border"
            >
              {clip === 'none' ? (
                <div className="h-full bg-background">{body}</div>
              ) : (
                <VideoStage
                  src={clip}
                  mode={mode}
                  veil={veil}
                  scrollTargetId={`vb-${section.id}`}
                  className="h-full"
                >
                  {body}
                </VideoStage>
              )}
            </section>
          )
        })}
      </div>

      <div className="mx-auto w-full max-w-[90rem] px-5 py-24 sm:px-8">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
          Chosen
        </p>
        <ul className="mt-6">
          {SECTIONS.map((s) => (
            <li
              key={s.id}
              className="grid grid-cols-[minmax(0,12rem)_1fr] gap-6 border-t border-border py-4"
            >
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground">
                {s.label}
              </span>
              <span className="text-sm text-foreground">
                {CLIPS.find((c) => c.id === choice[s.id])?.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
