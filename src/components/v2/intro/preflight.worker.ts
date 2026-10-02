/// <reference lib="webworker" />
/*
 * The preflight's 3D layer, off the main thread. The page hands over its canvas
 * (an OffscreenCanvas), the model bytes it already fetched, and the moment the
 * arm switch fired; from then on this draws on its own clock, so the page
 * hydrating or building underneath cannot drop a frame of the flight. Readouts
 * for the display go back with every frame.
 */
import { createPreflight, type PreflightScene, type PreflightSize } from './preflight-scene'

type Msg =
  | { type: 'init'; canvas: OffscreenCanvas; size: PreflightSize; armAbs: number }
  | { type: 'model'; bytes: ArrayBuffer | null }
  | { type: 'arm'; armAbs: number }
  | { type: 'size'; size: PreflightSize }
  | { type: 'stop' }

const ctx = self as unknown as DedicatedWorkerGlobalScope

// GLTFLoader probes WebP support by decoding a 1px image with `new Image()`, which
// workers lack. Workers that can run this decode WebP through createImageBitmap
// (Safari takes the page path), so answer the probe: supported.
if (typeof (ctx as unknown as { Image?: unknown }).Image === 'undefined') {
  ;(ctx as unknown as { Image: unknown }).Image = class {
    height = 1
    width = 1
    onload: (() => void) | null = null
    onerror: (() => void) | null = null
    set src(_: string) {
      queueMicrotask(() => this.onload?.())
    }
  }
}
let scene: PreflightScene | null = null
let armAbs = 0
let running = false
let giveModel: (bytes: ArrayBuffer | null) => void = () => {}
const model = new Promise<ArrayBuffer | null>((r) => (giveModel = r))

const clock = () => performance.timeOrigin + performance.now()
const nextFrame = (cb: () => void) =>
  typeof ctx.requestAnimationFrame === 'function' ? ctx.requestAnimationFrame(cb) : setTimeout(cb, 1000 / 60)

function loop() {
  if (!running || !scene) return
  const r = scene.frame((clock() - armAbs) / 1000)
  ctx.postMessage({ type: 'frame', r })
  nextFrame(loop)
}

ctx.onmessage = (e: MessageEvent<Msg>) => {
  const m = e.data
  if (m.type === 'init') {
    armAbs = m.armAbs
    try {
      scene = createPreflight(m.canvas, m.size, model)
    } catch {
      ctx.postMessage({ type: 'fail' })
      return
    }
    scene.ready.then(
      () => {
        ctx.postMessage({ type: 'ready' })
        running = true
        loop()
      },
      () => ctx.postMessage({ type: 'fail' }),
    )
  } else if (m.type === 'model') giveModel(m.bytes)
  else if (m.type === 'arm') armAbs = m.armAbs
  else if (m.type === 'size') scene?.resize(m.size)
  else if (m.type === 'stop') {
    running = false
    scene?.dispose()
    scene = null
    ctx.close()
  }
}
