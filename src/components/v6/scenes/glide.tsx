'use client'

import { v6Copy } from '@/content/v6/reel'

import { B, BAR, driver, type Impact } from '../armed'
import { Chase } from '../gl/chase'
import { Shot } from '../shot'

/* 03 GLIDE: the breakdown. A chase over the field, the claim word by word, then a strobe recap of real frames. */

const IMPACTS: Impact[] = [
  { t: 0, k: 0.4, flash: 0.5 },
  { t: 2 * B, k: 0.2 },
]
const STROBE = 6 * B // the last two beats
const AT = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.25, 4.5]
const c = v6Copy.glide

function build(root: HTMLElement, tl: gsap.core.Timeline) {
  const frames = Array.from(root.querySelectorAll<HTMLElement>('.s12-f'))
  const words = Array.from(root.querySelectorAll<HTMLElement>('.s12-claim .w'))
  tl.fromTo(
    '.s12-horizon',
    { opacity: 0, scale: 0.7 },
    { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
    0
  )
  tl.fromTo(
    '.s12-cam, .s12-k',
    { opacity: 0 },
    { opacity: 1, duration: 0.4, ease: 'none', stagger: 0.1 },
    0.1
  )
  // the claim, one word per eighth; the hot word lands on the beat with weight
  words.forEach((w, i) => {
    const big = w.dataset.hot != null
    tl.fromTo(
      w,
      {
        opacity: 0,
        y: big ? 0 : 50,
        scale: big ? 1.8 : 1,
        filter: 'blur(12px)',
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: big ? 0.22 : 0.3,
        ease: big ? 'expo.out' : 'power3.out',
        transformOrigin: '0% 80%',
      },
      (AT[i] ?? 4.5) * B
    )
  })
  // the strobe recap: eight real frames on sixteenths, hard cuts, and back to the claim on the hold
  const strobe = driver((l) => {
    const k =
      l >= STROBE && l < 2 * BAR - 1e-3
        ? Math.min(7, Math.floor((l - STROBE) / (B / 4) + 1e-6))
        : -1
    frames.forEach((f, i) => {
      f.style.opacity = i === k ? '1' : '0'
      if (i === k) {
        const u = (l - STROBE - k * (B / 4)) / (B / 4)
        f.style.transform = `scale(${(1.1 - 0.08 * u).toFixed(4)})`
      }
    })
  })
  tl.fromTo(
    strobe,
    { p: 0 },
    { p: 2 * BAR, duration: 2 * BAR, ease: 'none' },
    0
  )
}

export function GlideShot({
  label,
  replay,
}: {
  label: string
  replay?: string
}) {
  return (
    <Shot
      scene="s12"
      label={label}
      impacts={IMPACTS}
      build={build}
      hold={2 * BAR}
      replay={replay}
      gl={(clock) => <Chase clock={clock} />}
    >
      <div className="s12-horizon" />
      <div className="m s12-k">{c.k}</div>
      <div className="s12-claim">
        {c.claim.map((line, j) => (
          <span key={j} className="ln">
            {line.map((w, i) => (
              <span
                key={i}
                className="w"
                data-hot={w === c.hot ? '' : undefined}
              >
                {w === c.hot ? <em>{w}</em> : w}
              </span>
            ))}
          </span>
        ))}
      </div>
      <div className="m s12-cam">{c.cam}</div>
      <div className="s12-strobe">
        {c.strobe.map((f) => (
          <div
            key={f.src}
            className={`s12-f${f.fit ? ' ink' : ''}`}
            style={{
              backgroundImage: `url('${f.src}')`,
              backgroundPosition: f.pos,
              imageRendering: f.pixel ? 'pixelated' : undefined,
              backgroundColor: f.paper ? 'var(--paper)' : undefined,
            }}
          >
            <span className="s12-cap">
              <b>{f.b}</b> {f.rest}
            </span>
          </div>
        ))}
      </div>
    </Shot>
  )
}
