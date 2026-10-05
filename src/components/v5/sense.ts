/*
 * Hand control, with no model and no library: the kind of vision that runs on
 * a small embedded board. Each camera frame is shrunk to 64×48, turned to
 * brightness, and compared with the last one; pixels that changed enough are
 * motion. Their weighted centre is where your hand is, their share of the
 * frame is how much it is moving. The panel draws exactly that: the frame,
 * the motion mask, the centre, and its bounding box. Frames stay in memory on
 * this device and are dropped each step.
 */

const W = 64
const H = 48
const THRESHOLD = 26

export interface HandReading {
  /** −1 (left) … 1 (right), mirrored like a mirror. */
  x: number
  /** −1 (top) … 1 (bottom). */
  y: number
  /** Share of the frame in motion, 0 … 1. */
  energy: number
}

export class HandTracker {
  private stream: MediaStream | null = null
  private video: HTMLVideoElement | null = null
  private small = document.createElement('canvas')
  private sctx: CanvasRenderingContext2D
  private prev = new Float32Array(W * H)
  private mask = new ImageData(W, H)
  private view: CanvasRenderingContext2D | null = null
  private raf = 0
  private last = 0
  private primed = false
  private state: HandReading = { x: 0, y: 0, energy: 0 }
  private box: [number, number, number, number] | null = null

  constructor(private colors: { motion: string; box: string; dim: string }) {
    this.small.width = W
    this.small.height = H
    this.sctx = this.small.getContext('2d', { willReadFrequently: true })!
  }

  async start(video: HTMLVideoElement, view: HTMLCanvasElement): Promise<boolean> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: 'user' }, audio: false })
    } catch {
      return false
    }
    this.video = video
    video.srcObject = this.stream
    video.muted = true
    video.playsInline = true
    await video.play().catch(() => {})
    this.view = view.getContext('2d')
    const loop = (t: number) => {
      this.raf = requestAnimationFrame(loop)
      if (t - this.last < 45) return
      this.last = t
      this.step()
    }
    this.raf = requestAnimationFrame(loop)
    return true
  }

  read(): HandReading {
    return this.state
  }

  stop() {
    cancelAnimationFrame(this.raf)
    this.stream?.getTracks().forEach((t) => t.stop())
    this.stream = null
    if (this.video) this.video.srcObject = null
    this.state = { x: 0, y: 0, energy: 0 }
    this.primed = false
  }

  private step() {
    const v = this.video
    if (!v || v.readyState < 2) return
    const g = this.sctx
    // mirrored, so moving your hand right moves the reading right
    g.setTransform(-1, 0, 0, 1, W, 0)
    g.drawImage(v, 0, 0, W, H)
    g.setTransform(1, 0, 0, 1, 0, 0)
    const px = g.getImageData(0, 0, W, H).data
    const out = this.mask.data
    let sx = 0
    let sy = 0
    let sw = 0
    let n = 0
    let x0 = W
    let y0 = H
    let x1 = 0
    let y1 = 0
    for (let i = 0; i < W * H; i++) {
      const l = px[i * 4] * 0.299 + px[i * 4 + 1] * 0.587 + px[i * 4 + 2] * 0.114
      const d = this.primed ? Math.abs(l - this.prev[i]) : 0
      this.prev[i] = l
      const k = i * 4
      if (d > THRESHOLD) {
        const x = i % W
        const y = (i / W) | 0
        sx += x * d
        sy += y * d
        sw += d
        n++
        if (x < x0) x0 = x
        if (y < y0) y0 = y
        if (x > x1) x1 = x
        if (y > y1) y1 = y
        out[k] = 255
        out[k + 1] = 95
        out[k + 2] = 180
        out[k + 3] = 255
      } else {
        const gl = l * 0.35
        out[k] = gl
        out[k + 1] = gl
        out[k + 2] = gl + 8
        out[k + 3] = 255
      }
    }
    this.primed = true
    const energy = n / (W * H)
    if (sw > 0 && energy > 0.004) {
      const tx = (sx / sw / (W - 1)) * 2 - 1
      const ty = (sy / sw / (H - 1)) * 2 - 1
      this.state = { x: this.state.x + (tx - this.state.x) * 0.35, y: this.state.y + (ty - this.state.y) * 0.35, energy: this.state.energy + (energy - this.state.energy) * 0.4 }
      this.box = [x0, y0, x1, y1]
    } else {
      this.state = { ...this.state, energy: this.state.energy * 0.7 }
      this.box = null
    }
    this.paint()
  }

  private paint() {
    const v = this.view
    if (!v) return
    const cw = v.canvas.width
    const ch = v.canvas.height
    this.sctx.putImageData(this.mask, 0, 0)
    v.imageSmoothingEnabled = false
    v.drawImage(this.small, 0, 0, cw, ch)
    const sx = cw / W
    const sy = ch / H
    if (this.box) {
      v.strokeStyle = this.colors.box
      v.lineWidth = 2
      v.strokeRect(this.box[0] * sx, this.box[1] * sy, (this.box[2] - this.box[0] + 1) * sx, (this.box[3] - this.box[1] + 1) * sy)
    }
    if (this.state.energy > 0.004) {
      const cx = ((this.state.x + 1) / 2) * cw
      const cy = ((this.state.y + 1) / 2) * ch
      v.strokeStyle = '#ffffff'
      v.lineWidth = 2
      v.beginPath()
      v.moveTo(cx - 10, cy)
      v.lineTo(cx + 10, cy)
      v.moveTo(cx, cy - 10)
      v.lineTo(cx, cy + 10)
      v.stroke()
    }
  }
}
