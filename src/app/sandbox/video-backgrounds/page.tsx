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

const CLIPS = [
  { id: 'none', label: 'None', note: 'Current: flat ground.' },
  { id: 'ridge', label: 'Ridge', note: 'Terrain from altitude. Reads as survey.' },
  { id: 'cloud', label: 'Cloud', note: 'Soft, abstract. Least literal.' },
  { id: 'pylon', label: 'Pylon', note: 'Infrastructure — closest to the RSMS subject.' },
  { id: 'wing', label: 'Wing', note: 'Fixed-wing in flight.' },
  { id: 'launch', label: 'Launch', note: 'Take-off. High energy, best for a hero.' },
  { id: 'flight', label: 'Flight', note: 'Steady cruise. Calm enough to sit under copy.' },
  { id: 'ridge-scrub', label: 'Ridge (scrub)', note: 'Keyframe-dense — only advances as you scroll.' },
  { id: 'cloud-scrub', label: 'Cloud (scrub)', note: 'Keyframe-dense — only advances as you scroll.' },
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
          one per section and scroll the result. Clips are stock footage, not
          yours — they work as atmosphere, never as evidence of your own work.
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
