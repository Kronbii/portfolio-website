/*
 * The ground under the mission: a deterministic heightfield and its contour
 * lines. It is a stylised coast-and-ranges landscape (sea to the west, a
 * coastal shelf, a high ridge, a valley, a second range), with fractal noise
 * on top, so it reads as real terrain without claiming to be a real map. The
 * same field feeds the 2D map (contours) and the LiDAR view (heights).
 */

export const WORLD = { w: 4000, h: 2600 }
const CELL = 12.5
export const GRID = { cols: Math.round(WORLD.w / CELL) + 1, rows: Math.round(WORLD.h / CELL) + 1, cell: CELL }

/* ---------- seeded value noise ---------- */

function hash(x: number, y: number) {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263)
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295
}
const smooth = (t: number) => t * t * (3 - 2 * t)
function value(x: number, y: number) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const tx = smooth(x - xi)
  const ty = smooth(y - yi)
  const a = hash(xi, yi)
  const b = hash(xi + 1, yi)
  const c = hash(xi, yi + 1)
  const d = hash(xi + 1, yi + 1)
  return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty
}
function fbm(x: number, y: number) {
  let s = 0
  let amp = 0.5
  let f = 1
  for (let o = 0; o < 5; o++) {
    s += amp * value(x * f, y * f)
    f *= 2.03
    amp *= 0.5
  }
  return s
}

/** Where the sea meets the land, for each northing. */
export const coastX = (y: number) => 640 + 90 * Math.sin(y * 0.0021) + 46 * Math.sin(y * 0.0057 + 1.3) + 20 * Math.sin(y * 0.017)

/** Elevation in field units: below 0 is sea, the high ridge tops out near 1.6. */
export function elevation(x: number, y: number) {
  const d = x - coastX(y)
  const n = fbm(x * 0.0019, y * 0.0019) - 0.5
  if (d < 0) return Math.max(-0.6, d / 500 + n * 0.12)
  const ridge = 1.15 * Math.exp(-(((d - 1250) / 560) ** 2))
  const range = 0.85 * Math.exp(-(((d - 2750) / 520) ** 2))
  const shelf = Math.min(1, d / 260) * 0.12
  const valley = 0.32 * smooth(Math.min(1, Math.max(0, (d - 1600) / 700)))
  return shelf + ridge + range + valley * (1 - Math.exp(-(((d - 2750) / 900) ** 2))) + n * 0.55 * Math.min(1, d / 400)
}

export interface Terrain {
  heights: Float32Array
  /** Contour segments per level, in world units: [x1, y1, x2, y2, ...]. */
  levels: { level: number; major: boolean; coast: boolean; segments: Float32Array }[]
  sample(x: number, y: number): number
}

let cached: Terrain | null = null

/** Builds (once) the height grid and its contours by marching squares. */
export function terrain(): Terrain {
  if (cached) return cached
  const { cols, rows, cell } = GRID
  const heights = new Float32Array(cols * rows)
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) heights[j * cols + i] = elevation(i * cell, j * cell)

  const levels: Terrain['levels'] = []
  const STEP = 0.1
  for (let k = 0; k <= 16; k++) {
    const level = k === 0 ? 0 : k * STEP
    const out: number[] = []
    for (let j = 0; j < rows - 1; j++) {
      for (let i = 0; i < cols - 1; i++) {
        const a = heights[j * cols + i]
        const b = heights[j * cols + i + 1]
        const c = heights[(j + 1) * cols + i + 1]
        const d = heights[(j + 1) * cols + i]
        const idx = (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0)
        if (idx === 0 || idx === 15) continue
        const x = i * cell
        const y = j * cell
        // where the level crosses each edge
        const top = () => [x + ((level - a) / (b - a)) * cell, y]
        const right = () => [x + cell, y + ((level - b) / (c - b)) * cell]
        const bottom = () => [x + ((level - d) / (c - d)) * cell, y + cell]
        const left = () => [x, y + ((level - a) / (d - a)) * cell]
        const seg = (p: number[], q: number[]) => out.push(p[0], p[1], q[0], q[1])
        switch (idx) {
          case 1:
          case 14:
            seg(left(), bottom())
            break
          case 2:
          case 13:
            seg(bottom(), right())
            break
          case 3:
          case 12:
            seg(left(), right())
            break
          case 4:
          case 11:
            seg(top(), right())
            break
          case 5:
            seg(left(), top())
            seg(bottom(), right())
            break
          case 6:
          case 9:
            seg(top(), bottom())
            break
          case 7:
          case 8:
            seg(left(), top())
            break
          case 10:
            seg(left(), bottom())
            seg(top(), right())
            break
        }
      }
    }
    levels.push({ level, major: k % 5 === 0, coast: k === 0, segments: new Float32Array(out) })
  }

  const sample = (x: number, y: number) => {
    const fx = Math.min(cols - 1.001, Math.max(0, x / cell))
    const fy = Math.min(rows - 1.001, Math.max(0, y / cell))
    const i = Math.floor(fx)
    const j = Math.floor(fy)
    const tx = fx - i
    const ty = fy - j
    const a = heights[j * cols + i]
    const b = heights[j * cols + i + 1]
    const c = heights[(j + 1) * cols + i]
    const d = heights[(j + 1) * cols + i + 1]
    return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty
  }

  cached = { heights, levels, sample }
  return cached
}
