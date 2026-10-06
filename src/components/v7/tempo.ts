/*
 * v7's clock: 96 BPM, three quarters of the reel's tempo, so a scene breathes.
 * One beat is 0.625 s and one bar 2.5 s. Motion here is focus, not impact:
 * things arrive out of blur and colour fringe and settle sharp, the way a
 * lens finds focus. The easing and driver helpers are the reel's.
 */

export { E, clamp, driver, hash, lerp, prog } from '../v6/armed'

export const BPM = 96
export const B = 60 / BPM
export const BAR = 4 * B

/** The aberration's two colours, as the Sage palette's fringe: green out, magenta in. */
export const FRINGE = { g: '166, 230, 143', m: '224, 143, 208' } as const

interface Pull {
  dur?: number
  blur?: number
  /** Fringe width at the start, in stage pixels. */
  ca?: number
  y?: number
  x?: number
  scale?: number
  stagger?: number
}

/**
 * A focus pull: the targets come out of blur and chromatic fringe into a sharp
 * image. Text with the `fx` class fringes through text-shadow, an Optic image
 * through its two channel layers, and a fringed SVG line through its copies;
 * all read the same --ca.
 */
export function focusIn(
  tl: gsap.core.Timeline,
  targets: gsap.TweenTarget,
  at: number,
  o: Pull = {}
) {
  const {
    dur = 1.3 * B,
    blur = 12,
    ca = 9,
    y = 0,
    x = 0,
    scale = 1.025,
    stagger = 0,
  } = o
  tl.fromTo(
    targets,
    { opacity: 0, filter: `blur(${blur}px)`, '--ca': ca, y, x, scale },
    {
      opacity: 1,
      filter: 'blur(0px)',
      '--ca': 0,
      y: 0,
      x: 0,
      scale: 1,
      duration: dur,
      ease: 'power2.out',
      stagger,
      clearProps: 'filter',
    },
    at
  )
}

/** A soft defocus out: the inverse pull, for things that give way. */
export function focusOut(
  tl: gsap.core.Timeline,
  targets: gsap.TweenTarget,
  at: number,
  o: Pull = {}
) {
  const { dur = 0.9 * B, blur = 10, ca = 7, y = 0 } = o
  tl.to(
    targets,
    {
      opacity: 0,
      filter: `blur(${blur}px)`,
      '--ca': ca,
      y,
      duration: dur,
      ease: 'power1.in',
    },
    at
  )
}

/** Draws fringed lines: the stroke runs on, and its colour fringe converges as it lands. */
export function drawIn(
  tl: gsap.core.Timeline,
  targets: gsap.TweenTarget,
  at: number,
  dur = 1.2 * B,
  stagger = 0
) {
  tl.fromTo(
    targets,
    { '--draw': 1, '--ca': 6 },
    { '--draw': 0, '--ca': 0, duration: dur, ease: 'sine.inOut', stagger },
    at
  )
}
