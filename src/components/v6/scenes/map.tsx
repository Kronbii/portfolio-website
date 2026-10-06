'use client'

import { B, BAR, E, driver, prog, type Impact } from '../armed'
import { PanoSphere } from '../gl/pano-sphere'
import { Shot, type Rect } from '../shot'

/* 05 MAP: feature matches, 309 frames, one sheet, one sphere. */

const IMPACTS: Impact[] = [
  { t: 0, k: 0.6, flash: 0.35, ghost: 0.6 },
  { t: 2 * B, k: 0.4 },
]
const CROP: Rect = [60, 60, 1800, 980]
const N = 24
/** When the flat sheet hands over to the sphere (local seconds). */
export const CURL_AT = 0.94

function build(root: HTMLElement, tl: gsap.core.Timeline) {
  const cards = Array.from(root.querySelectorAll<HTMLElement>('.s05-card'))
  const framesEl = root.querySelector<HTMLElement>('.s05-frames')!
  // the sphere takes over only once it can draw; without WebGL the flat sheet stays
  const sphere = () =>
    root.parentElement?.querySelector('.v6-gl [data-ready]') != null

  // arrive through the zoom: the real feature matches, and the inlier count
  tl.fromTo(
    '.s05-match',
    { scale: 0.72, opacity: 0, filter: 'blur(18px)' },
    {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.3,
      ease: 'expo.out',
    },
    0
  )
  tl.fromTo(
    '.s05-no, .s05-title',
    { opacity: 0, y: -30 },
    { opacity: 1, y: 0, duration: 0.25, ease: 'expo.out', stagger: 0.04 },
    0.02
  )
  tl.fromTo(
    '.s05-match-k',
    { opacity: 0 },
    { opacity: 1, duration: 0.2, ease: 'none' },
    0.12
  )
  tl.fromTo(
    '.s05-inl',
    { opacity: 0, scale: 1.6, filter: 'blur(14px)' },
    {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 0.2,
      ease: 'expo.out',
    },
    0.08
  )
  tl.fromTo(
    '.s05-inl-k',
    { opacity: 0, x: 30 },
    { opacity: 1, x: 0, duration: 0.25, ease: 'expo.out' },
    0.16
  )
  // the pair is shoved off; the sweep's frames fan out across the frame
  tl.to(
    '.s05-match',
    { x: -900, rotation: -8, duration: 0.18, ease: 'power3.in' },
    B - 0.04
  )
  tl.to('.s05-match', { opacity: 0, duration: 0.05, ease: 'none' }, B + 0.14)
  tl.to(
    '.s05-match-k, .s05-inl, .s05-inl-k',
    { opacity: 0, duration: 0.08, ease: 'none' },
    B - 0.04
  )
  tl.fromTo(
    '.s05-frames, .s05-frames-k',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.2, ease: 'expo.out', stagger: 0.03 },
    B
  )
  // cards fly in fanned, then close ranks into one seamless sheet; the 3D sheet takes over from there
  const card = driver((l) => {
    const curled = l >= CURL_AT && sphere()
    const close = E.inOut(prog(l, 0.64, 0.9))
    cards.forEach((c, i) => {
      const k = i - (N - 1) / 2
      const d = i * 0.006
      const fi = E.out(prog(l, B + d, B + 0.2 + d))
      const fanX = 960 + k * 74 - 40
      const fanY = 70 + k * k * 1.6
      const homeX = i * 80
      const x = (1 - close) * (fanX + (1 - fi) * 1400) + close * homeX
      const y = (1 - close) * fanY
      const rot = (1 - close) * k * 2.2
      const s = (1 - close) * 0.62 + close
      c.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${s.toFixed(4)})`
      c.style.boxShadow =
        close < 0.98
          ? `0 0 0 ${(2 * (1 - close)).toFixed(2)}px rgba(251,245,234,0.5)`
          : 'none'
      c.style.opacity = l < B || curled ? '0' : '1'
    })
    framesEl.textContent = String(
      Math.round(309 * E.out(prog(l, B, B + 0.42)))
    ).padStart(3, '0')
  })
  tl.fromTo(card, { p: 0 }, { p: BAR, duration: BAR, ease: 'none' }, 0)
  tl.to(
    '.s05-frames, .s05-frames-k',
    { opacity: 0, duration: 0.08, ease: 'none' },
    0.86
  )
  tl.to('.s05-no, .s05-title', { opacity: 0, duration: 0.1, ease: 'none' }, 0.6)
  // the sphere spins up; the sweep it holds
  tl.fromTo(
    '.s05-deg',
    { opacity: 0, x: 140, filter: 'blur(18px)' },
    { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.22, ease: 'expo.out' },
    3 * B
  )
  tl.fromTo(
    '.s05-deg-k',
    { opacity: 0 },
    { opacity: 1, duration: 0.2, ease: 'none' },
    3 * B + 0.1
  )
  tl.fromTo(
    '.s05-left',
    { opacity: 0, x: -60 },
    { opacity: 1, x: 0, duration: 0.22, ease: 'expo.out' },
    3 * B + 0.04
  )
}

export function MapShot({ label, replay }: { label: string; replay?: string }) {
  return (
    <Shot
      scene="s05"
      label={label}
      impacts={IMPACTS}
      build={build}
      crop={CROP}
      replay={replay}
      gl={(clock) => <PanoSphere clock={clock} />}
    >
      <div className="s05-strip">
        {Array.from({ length: N }, (_, i) => (
          <div
            key={i}
            className="s05-card"
            style={{ backgroundPosition: `-${i * 80}px 0` }}
          />
        ))}
      </div>
      <div className="m s05-no">05 · Map</div>
      <div className="s05-title">
        360° <em>Spherical</em> panorama stitching
      </div>
      <div className="s05-match">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/v6/pano-matches.jpg" alt="" />
      </div>
      <div className="m s05-match-k">
        Stage 2 · matches between adjacent frames
      </div>
      <div className="fig s05-inl">921</div>
      <div className="m s05-inl-k">
        Median RANSAC inliers
        <br />
        per adjacent frame pair
      </div>
      <div className="fig s05-frames">000</div>
      <div className="m s05-frames-k">Frames · one handheld phone sweep</div>
      <div className="fig s05-deg">
        333<small>°</small>
      </div>
      <div className="m s05-deg-k">
        Recovered sweep
        <br />
        4096 × 2048 equirectangular
      </div>
      <div className="m s05-left">
        <b>309</b> frames
        <br />
        <b>1</b> sphere
      </div>
    </Shot>
  )
}
