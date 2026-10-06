import type { MapItem } from '@/content/v5/mission'

import { GRID, WORLD, type Terrain } from './terrain'

/*
 * Draws the mission as an aeronautical chart. The world (tinted relief and
 * contours) is cached once in world units and transformed by the camera;
 * symbols and lettering are drawn in screen space, crisp and the same size at
 * any zoom. Symbology borrows the sectional's: a compass rose on the base,
 * triangles for route waypoints, airport rings for projects, hatched sectors
 * for the regions, and a magenta route.
 */

export interface Cam {
  x: number
  y: number
  /** Screen pixels per world unit. */
  z: number
}

type RGB = [number, number, number]

export interface Chart {
  paper: string
  ink: string
  ink2: string
  ink3: string
  rule: string
  magenta: string
  blue: string
  green: string
  onAccent: string
  water: RGB
  low: RGB
  mid: RGB
  high: RGB
  contour: string
  contourMajor: string
  night: boolean
  display: string
  mono: string
}

export interface Scene {
  route: MapItem[]
  projects: MapItem[]
  regions: { id: string; label: string; code: string; x: number; y: number }[]
  home: { x: number; y: number; label: string; coords: string }
  reached: number
  trail: number[]
  drone: { x: number; y: number; h: number; spin: number }
  active: string | null
  hover: string | null
}

export function parseColor(v: string): RGB {
  const s = v.trim()
  const hex = s.match(/^#([0-9a-f]{6})$/i)
  if (hex) {
    const n = parseInt(hex[1], 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  }
  const m = s.match(/rgba?\(([^)]+)\)/)
  if (m) {
    const [r, g, b] = m[1].split(',').map((x) => parseFloat(x))
    return [r, g, b]
  }
  return [128, 128, 128]
}

const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]

/** Hypsometric tints, lit from the north-west, one pixel per grid cell. */
export function relief(t: Terrain, c: Chart): HTMLCanvasElement {
  const { cols, rows } = GRID
  const cv = document.createElement('canvas')
  cv.width = cols
  cv.height = rows
  const g = cv.getContext('2d')!
  const img = g.createImageData(cols, rows)
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const h = t.heights[j * cols + i]
      const k = (j * cols + i) * 4
      let col: RGB
      if (h < 0) {
        col = mix(c.water, c.night ? [4, 10, 20] : [150, 190, 214], Math.min(1, -h / 0.6) * 0.5)
      } else {
        const u = Math.min(1, h / 1.45)
        col = u < 0.4 ? mix(c.low, c.mid, u / 0.4) : mix(c.mid, c.high, (u - 0.4) / 0.6)
        const e = t.heights[j * cols + Math.min(cols - 1, i + 1)] - t.heights[Math.min(rows - 1, j + 1) * cols + i]
        const shade = Math.max(-1, Math.min(1, e * 8)) * (c.night ? 10 : 16)
        col = [col[0] + shade, col[1] + shade, col[2] + shade]
      }
      img.data[k] = col[0]
      img.data[k + 1] = col[1]
      img.data[k + 2] = col[2]
      img.data[k + 3] = 255
    }
  }
  g.putImageData(img, 0, 0)
  return cv
}

/** The contours as one Path2D per level, in world units. */
export function contourPaths(t: Terrain) {
  return t.levels.map((l) => {
    const p = new Path2D()
    const s = l.segments
    for (let i = 0; i < s.length; i += 4) {
      p.moveTo(s[i], s[i + 1])
      p.lineTo(s[i + 2], s[i + 3])
    }
    return { path: p, major: l.major, coast: l.coast }
  })
}

export const toScreen = (cam: Cam, w: number, h: number, x: number, y: number) => ({
  x: w / 2 + (x - cam.x) * cam.z,
  y: h / 2 + (y - cam.y) * cam.z,
})
export const toWorld = (cam: Cam, w: number, h: number, sx: number, sy: number) => ({
  x: cam.x + (sx - w / 2) / cam.z,
  y: cam.y + (sy - h / 2) / cam.z,
})

function quad(ctx: CanvasRenderingContext2D, x: number, y: number, heading: number, spin: number, c: Chart) {
  ctx.save()
  ctx.translate(x + 6, y + 8)
  ctx.rotate(heading)
  ctx.fillStyle = c.night ? 'rgba(0,0,0,0.45)' : 'rgba(60,45,20,0.22)'
  ctx.fillRect(-10, -7, 20, 14)
  ctx.restore()
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(heading)
  ctx.strokeStyle = c.ink
  ctx.lineWidth = 2.4
  ctx.beginPath()
  ctx.moveTo(-12, -12)
  ctx.lineTo(12, 12)
  ctx.moveTo(12, -12)
  ctx.lineTo(-12, 12)
  ctx.stroke()
  for (const [px, py] of [
    [-12, -12],
    [12, -12],
    [-12, 12],
    [12, 12],
  ]) {
    ctx.save()
    ctx.translate(px, py)
    ctx.rotate(spin * (px * py > 0 ? 1 : -1))
    ctx.strokeStyle = c.magenta
    ctx.lineWidth = 1.6
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.arc(0, 0, 8, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }
  ctx.fillStyle = c.magenta
  ctx.beginPath()
  ctx.roundRect(-6, -7, 15, 14, 3)
  ctx.fill()
  ctx.fillStyle = c.onAccent
  ctx.fillRect(6, -1.5, 3, 3)
  ctx.restore()
}

/** The base's compass rose, in world units around the base, lettered in screen space. */
function rose(ctx: CanvasRenderingContext2D, cx: number, cy: number, cam: Cam, c: Chart) {
  const R = 240
  ctx.strokeStyle = c.blue
  ctx.lineWidth = 1.2 / cam.z
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  for (let d = 0; d < 360; d += 5) {
    const a = ((d - 90) * Math.PI) / 180
    const len = d % 30 === 0 ? 34 : d % 10 === 0 ? 20 : 10
    ctx.moveTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R)
    ctx.lineTo(cx + Math.cos(a) * (R - len), cy + Math.sin(a) * (R - len))
  }
  ctx.stroke()
}

export function draw(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  dpr: number,
  cam: Cam,
  base: { relief: HTMLCanvasElement; contours: ReturnType<typeof contourPaths> },
  s: Scene,
  c: Chart,
) {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.fillStyle = c.paper
  ctx.fillRect(0, 0, w, h)

  // ---------- the world, in world units ----------
  const ox = w / 2 - cam.x * cam.z
  const oy = h / 2 - cam.y * cam.z
  ctx.save()
  ctx.setTransform(dpr * cam.z, 0, 0, dpr * cam.z, dpr * ox, dpr * oy)
  ctx.imageSmoothingEnabled = true
  ctx.drawImage(base.relief, 0, 0, WORLD.w, WORLD.h)
  const fine = cam.z > 0.3
  base.contours.forEach((l, i) => {
    if (!fine && !l.major && !l.coast && i % 2) return
    ctx.lineWidth = (l.coast ? 1.8 : l.major ? 1.1 : 0.6) / cam.z
    ctx.strokeStyle = l.coast ? c.blue : l.major ? c.contourMajor : c.contour
    ctx.stroke(l.path)
  })
  // graticule
  ctx.strokeStyle = c.blue
  ctx.globalAlpha = 0.28
  ctx.lineWidth = 0.7 / cam.z
  ctx.beginPath()
  for (let x = 0; x <= WORLD.w; x += 500) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, WORLD.h)
  }
  for (let y = 0; y <= WORLD.h; y += 500) {
    ctx.moveTo(0, y)
    ctx.lineTo(WORLD.w, y)
  }
  ctx.stroke()
  ctx.globalAlpha = 1
  // regions: restricted-area sectors, a thin line with a hatched band inside
  for (const r of s.regions) {
    ctx.strokeStyle = c.magenta
    ctx.lineWidth = 1.2 / cam.z
    ctx.beginPath()
    ctx.arc(r.x, r.y, 330, 0, Math.PI * 2)
    ctx.stroke()
    ctx.globalAlpha = 0.35
    ctx.lineWidth = 9 / cam.z
    ctx.setLineDash([1.5 / cam.z, 5 / cam.z])
    ctx.beginPath()
    ctx.arc(r.x, r.y, 330 - 5 / cam.z, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.globalAlpha = 1
  }
  rose(ctx, s.home.x, s.home.y, cam, c)
  // the route: planned dashed, flown solid
  const pts = [s.home, ...s.route]
  ctx.strokeStyle = c.magenta
  ctx.lineWidth = 2.2 / cam.z
  ctx.setLineDash([9 / cam.z, 6 / cam.z])
  ctx.globalAlpha = 0.75
  ctx.beginPath()
  pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)))
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1
  if (s.reached > 0) {
    ctx.lineWidth = 4 / cam.z
    ctx.beginPath()
    pts.slice(0, s.reached + 1).forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)))
    ctx.stroke()
  }
  ctx.restore()

  // ---------- symbols and lettering, in screen space ----------
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.textBaseline = 'middle'
  const scr = (x: number, y: number) => ({ x: ox + x * cam.z, y: oy + y * cam.z })
  const inView = (p: { x: number; y: number }, m = 80) => p.x > -m && p.y > -m && p.x < w + m && p.y < h + m

  // sector names, like a restricted area's label
  ctx.textAlign = 'center'
  for (const r of s.regions) {
    const p = scr(r.x, r.y - 330)
    if (!inView(p, 200)) continue
    ctx.font = `700 ${cam.z > 0.45 ? 15 : 13}px ${c.display}`
    const label = `${r.code} ${r.label.toUpperCase()}`
    const tw = ctx.measureText(label).width
    ctx.fillStyle = c.paper
    ctx.fillRect(p.x - tw / 2 - 6, p.y - 10, tw + 12, 20)
    ctx.fillStyle = c.magenta
    ctx.fillText(label, p.x, p.y + 1)
  }

  // projects: an airport ring with a runway, and its identifier
  ctx.textAlign = 'left'
  for (const it of s.projects) {
    const p = scr(it.x, it.y)
    if (!inView(p)) continue
    const on = s.active === it.id || s.hover === it.id
    ctx.strokeStyle = on ? c.magenta : c.blue
    ctx.fillStyle = c.paper
    ctx.lineWidth = on ? 2.4 : 1.8
    ctx.beginPath()
    ctx.arc(p.x, p.y, on ? 9 : 7, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(p.x - 4, p.y + 4)
    ctx.lineTo(p.x + 4, p.y - 4)
    ctx.stroke()
    const show = on || cam.z > 0.42
    ctx.font = `700 12px ${c.display}`
    ctx.fillStyle = on ? c.magenta : c.blue
    ctx.fillText(it.ident ?? '', p.x + 12, p.y - (show ? 7 : 0))
    if (show) {
      ctx.font = `600 13px ${c.display}`
      ctx.fillStyle = on ? c.ink : c.ink2
      ctx.fillText(it.label, p.x + 12, p.y + 8)
    }
  }

  // the base
  {
    const p = scr(s.home.x, s.home.y)
    if (inView(p, 300)) {
      ctx.fillStyle = c.paper
      ctx.strokeStyle = c.blue
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.rect(p.x - 8, p.y - 8, 16, 16)
      ctx.fill()
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
      ctx.fillStyle = c.blue
      ctx.fill()
      // the rose's cardinal letters
      ctx.font = `700 12px ${c.display}`
      ctx.textAlign = 'center'
      const R = 240 * cam.z - 44
      if (R > 30) {
        ;[
          ['N', 0, -1],
          ['E', 1, 0],
          ['S', 0, 1],
          ['W', -1, 0],
        ].forEach(([l, dx, dy]) => ctx.fillText(l as string, p.x + (dx as number) * R, p.y + (dy as number) * R))
      }
      ctx.textAlign = 'left'
      ctx.font = `800 16px ${c.display}`
      ctx.fillStyle = c.ink
      ctx.fillText(s.home.label.toUpperCase(), p.x + 14, p.y - 9)
      ctx.font = `500 10px ${c.mono}`
      ctx.fillStyle = c.ink2
      ctx.fillText(s.home.coords, p.x + 14, p.y + 9)
    }
  }

  // route waypoints: triangles, filled green once reached
  s.route.forEach((it, i) => {
    const p = scr(it.x, it.y)
    if (!inView(p)) return
    const on = s.active === it.id || s.hover === it.id
    const done = i < s.reached
    const r = on ? 14 : 11
    ctx.beginPath()
    ctx.moveTo(p.x, p.y - r)
    ctx.lineTo(p.x + r * 0.9, p.y + r * 0.62)
    ctx.lineTo(p.x - r * 0.9, p.y + r * 0.62)
    ctx.closePath()
    ctx.fillStyle = done ? c.green : on ? c.magenta : c.paper
    ctx.fill()
    ctx.strokeStyle = done ? c.green : c.magenta
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.font = `700 11px ${c.display}`
    ctx.textAlign = 'center'
    ctx.fillStyle = done || on ? c.onAccent : c.magenta
    ctx.fillText(String(i + 1), p.x, p.y + 2)
    ctx.font = `700 12px ${c.display}`
    ctx.fillStyle = c.ink
    ctx.fillText(it.label, p.x, p.y + 24)
  })

  // the trail, then the drone
  if (s.trail.length > 4) {
    ctx.strokeStyle = c.magenta
    ctx.lineWidth = 2
    for (let i = 2; i < s.trail.length; i += 2) {
      const a = scr(s.trail[i - 2], s.trail[i - 1])
      const b = scr(s.trail[i], s.trail[i + 1])
      ctx.globalAlpha = (i / s.trail.length) * 0.7
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  }
  const d = scr(s.drone.x, s.drone.y)
  quad(ctx, d.x, d.y, s.drone.h, s.drone.spin, c)
}

/** The nearest map item to a screen point, within a finger's reach. */
export function pick(cam: Cam, w: number, h: number, sx: number, sy: number, items: MapItem[], reach = 18) {
  let best: MapItem | null = null
  let bd = reach
  for (const it of items) {
    const p = toScreen(cam, w, h, it.x, it.y)
    const dd = Math.hypot(p.x - sx, p.y - sy)
    if (dd < bd) {
      bd = dd
      best = it
    }
  }
  return best
}
