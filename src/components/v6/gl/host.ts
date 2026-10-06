'use client'

import type * as THREE_NS from 'three'

/*
 * One WebGL canvas, set up in idle time (see the queue below). The drawing
 * buffer follows the canvas's displayed size (it sits inside a scaled stage,
 * so its CSS box is not its pixel size), and frames are drawn only while it
 * is on screen. `init` returns a per-frame
 * function and a disposer. Without WebGL it simply never starts.
 */

export type Three = typeof THREE_NS

export interface GLFrame {
  /** Draw one frame at `now` (ms). */
  frame: (now: number, size: { w: number; h: number }) => void
  dispose?: () => void
  /** What to compile ahead of the first frame (off the main thread where the driver allows). */
  warm?: { scene: THREE_NS.Scene; camera: THREE_NS.Camera }
}

/** Give the main thread back for a frame: heavy setup is cut into steps so scrolling never waits on it. */
export const yieldFrame = () =>
  new Promise<void>((r) => requestAnimationFrame(() => setTimeout(r, 0)))

/** three.js is large: parse it once, when the page is idle, before any canvas needs it. */
let threeModule: Promise<Three> | null = null
export function loadThree() {
  if (!threeModule) threeModule = import('three')
  return threeModule
}
type Idle = (cb: () => void, o?: { timeout: number }) => number
const idle: Idle = (cb, o) => {
  const ric = (window as Window & { requestIdleCallback?: Idle })
    .requestIdleCallback
  return ric ? ric(cb, o) : window.setTimeout(cb, 200)
}

/*
 * Every canvas on the page sets up in turn, in idle time, from the moment it
 * mounts: the costly one-off work (environment maps, shader compiles, the
 * model) happens while the reader is still on the first screen, one layer
 * at a time, instead of in the middle of a scroll. A canvas the reader
 * reaches first jumps the queue.
 */
const queue: (() => Promise<void>)[] = []
let busy = false

/*
 * While the preflight intro plays, the page's 3D waits: shader compiles and
 * environment maps would take the main thread from the intro's own flight.
 * Everything sets up the moment it hands over (or at once, with no intro).
 */
const INTRO_ON = ['on', 'playing', 'reveal']
let introGate: Promise<void> | null = null
function afterIntro(): Promise<void> {
  if (introGate) return introGate
  introGate = new Promise((resolve) => {
    const root = document.querySelector<HTMLElement>('[data-intro-root]')
    if (!root || !INTRO_ON.includes(root.dataset.intro ?? '')) return resolve()
    const mo = new MutationObserver(() => {
      if (INTRO_ON.includes(root.dataset.intro ?? '')) return
      mo.disconnect()
      resolve()
    })
    mo.observe(root, { attributes: true, attributeFilter: ['data-intro'] })
  })
  return introGate
}

// parse three.js in idle time, once the intro (if any) has handed over
if (typeof window !== 'undefined')
  void afterIntro().then(() => idle(() => void loadThree(), { timeout: 2500 }))

function pump() {
  if (busy) return
  const job = queue.shift()
  if (!job) return
  busy = true
  idle(
    () =>
      void job().finally(() => {
        busy = false
        pump()
      }),
    { timeout: 3000 }
  )
}

export function startGL(
  canvas: HTMLCanvasElement,
  init: (
    THREE: Three,
    renderer: THREE_NS.WebGLRenderer
  ) => Promise<GLFrame> | GLFrame,
  opts: { margin?: string; maxDpr?: number } = {}
) {
  let disposed = false
  let stop = () => {}
  let near = false
  let started = false

  const begin = async () => {
    if (started) return
    started = true
    await afterIntro()
    const THREE = await loadThree()
    await yieldFrame()
    if (disposed) return
    let renderer: THREE_NS.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
    } catch {
      return
    }
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    let gl: GLFrame
    try {
      gl = await init(THREE, renderer)
    } catch {
      renderer.dispose()
      return
    }
    if (gl.warm) {
      try {
        await renderer.compileAsync(gl.warm.scene, gl.warm.camera)
        await yieldFrame()
        // one throwaway draw uploads the buffers and textures, so the first visible frame is cheap
        renderer.render(gl.warm.scene, gl.warm.camera)
        renderer.clear()
      } catch {
        /* compiled on first draw instead */
      }
      await yieldFrame()
    }
    if (disposed) {
      gl.dispose?.()
      renderer.dispose()
      return
    }
    canvas.dataset.ready = ''

    let w = 0,
      h = 0
    const size = () => {
      const r = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, opts.maxDpr ?? 2)
      const nw = Math.max(2, Math.round(r.width * dpr))
      const nh = Math.max(2, Math.round(r.height * dpr))
      if (nw !== w || nh !== h) {
        w = nw
        h = nh
        renderer.setPixelRatio(1)
        renderer.setSize(w, h, false)
      }
    }
    const ro = new ResizeObserver(size)
    // the frame's layout box changes with the window; a scaled stage's own box never does
    ro.observe(canvas.closest('.v6-frame') ?? canvas.parentElement ?? canvas)
    size()

    let raf = 0
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (!near) return
      gl.frame(now, { w, h })
    }
    raf = requestAnimationFrame(loop)
    stop = () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      gl.dispose?.()
      renderer.dispose()
      delete canvas.dataset.ready
    }
  }

  const io = new IntersectionObserver(
    ([e]) => {
      near = e.isIntersecting
      if (near && !started) void begin()
    },
    { rootMargin: opts.margin ?? '90% 0px' }
  )
  io.observe(canvas)
  queue.push(begin)
  pump()

  return () => {
    disposed = true
    io.disconnect()
    stop()
  }
}

/** The E58's look under the reel's lights: warm key, burgundy rim (or a host's own accent). */
export function reelLights(
  THREE: Three,
  scene: THREE_NS.Scene,
  renderer: THREE_NS.WebGLRenderer,
  rimColor: THREE_NS.ColorRepresentation = 0xc9686a
) {
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  scene.add(new THREE.HemisphereLight(0xffe9dc, 0x1a0f0e, 1.1))
  const key = new THREE.DirectionalLight(0xfff3e8, 2.4)
  key.position.set(3.5, 5, 4)
  scene.add(key)
  const rim = new THREE.DirectionalLight(rimColor, 2.8)
  rim.position.set(-4, 1.5, -3.5)
  scene.add(rim)
}
