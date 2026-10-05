/**
 * /v5, "Ground Control": the record as a drone mission. Nothing here is a new
 * fact: the route is v3's flight log (verified-current items), the points of
 * interest are v3's plain-language projects, and the words come from there.
 * What v5 adds is where things sit on the map.
 */

import { v3Home } from '@/content/v3/home'
import { fields, rebase, workHref, works, type Field } from '@/content/v3/work'
import { siteConfig } from '@/lib/site'

export const V5 = '/v5'

/** The base, on the coast. */
export const HOME = { x: 790, y: 1250, label: 'Beirut', coords: '33.89° N · 35.50° E' }

/** Where each kind of work lives on the map. */
export const REGIONS: Record<Field, { x: number; y: number }> = {
  machines: { x: 1500, y: 800 },
  vision: { x: 2380, y: 1060 },
  health: { x: 3150, y: 1660 },
  civic: { x: 1240, y: 1900 },
  open: { x: 2200, y: 2080 },
  tools: { x: 3200, y: 620 },
}

/** The career route, in order: v3's flight log, placed near the work each step belongs to. */
const ROUTE_AT: [number, number][] = [
  [1350, 990],
  [2140, 860],
  [2580, 1270],
  [1500, 1700],
  [1720, 640],
  [2920, 900],
  [1090, 2130],
  [2420, 2230],
]

export interface MapItem {
  id: string
  x: number
  y: number
  kind: 'route' | 'project'
  /** Short label on the map. */
  label: string
  title: string
  meta: string
  line: string
  proof?: string
  href: string
  field?: Field
  /** A chart identifier: four letters for a project, the waypoint number for the route. */
  ident?: string
}

/** Four letters from a title, the way a chart names a fix. */
function identOf(title: string) {
  const words = title
    .replace(/[^A-Za-z0-9 ]+/g, ' ')
    .split(' ')
    .filter((w) => /^[A-Za-z]/.test(w) && !/^(and|of|the|a|to|from|for)$/i.test(w))
  let id = words.map((w) => w[0]).join('')
  const rest = (words[0] ?? 'XXXX').slice(1)
  const extra = rest.replace(/[aeiou]/gi, '') + rest.replace(/[^aeiou]/gi, '')
  id = (id + extra + 'XXXX').slice(0, 4)
  return id.toUpperCase()
}

export { latLon } from '@/components/v5/geo'

export function missionData() {
  const route: MapItem[] = v3Home.log.points.map((p, i) => ({
    id: `wp-${i + 1}`,
    x: ROUTE_AT[i][0],
    y: ROUTE_AT[i][1],
    kind: 'route',
    label: `${p.when}`,
    title: p.what,
    meta: p.when,
    line: p.note,
    href: rebase(p.href, V5),
    ident: `WP${String(i + 1).padStart(2, '0')}`,
  }))

  // projects cluster around their region, on a little spiral so none overlap
  const byField: Record<string, number> = {}
  const projects: MapItem[] = works.map(({ project, plain }) => {
    const k = (byField[plain.field] = (byField[plain.field] ?? -1) + 1)
    const a = k * 2.4
    const r = 70 + k * 46
    const c = REGIONS[plain.field]
    return {
      id: project.slug,
      x: Math.round(c.x + Math.cos(a) * r),
      y: Math.round(c.y + Math.sin(a) * r * 0.8),
      kind: 'project',
      label: project.title.split(' — ')[0],
      title: project.title,
      meta: plain.kind,
      line: plain.line,
      proof: plain.proof,
      href: workHref(project.slug, V5),
      field: plain.field,
      ident: identOf(project.title),
    }
  })

  const regions = fields.map((f, i) => ({ id: f.id, label: f.label, code: `R-${String(i + 1).padStart(2, '0')}`, ...REGIONS[f.id] }))
  return { route, projects, regions }
}

export const v5Copy = {
  meta: {
    title: 'Rami Kronbi — Ground Control (v5 preview)',
    description:
      'Rami Kronbi is a Lebanese robotics and embedded-systems engineer. His career as a drone mission: fly the route, visit the projects, read the briefing.',
  },
  hero: v3Home.hero,
  creds: v3Home.creds.map((c) => ({ ...c, href: rebase(c.href, V5) })),
  briefing: {
    pilot: 'Pilot',
    mission: 'Mission',
    missionLede: 'The path so far, as a route: every waypoint is a step you can check.',
    projects: 'Projects on the map',
    projectsLede: (n: number) => `${n} projects, placed by what they are for. Pick one and the drone flies to it.`,
    contact: 'Contact',
    email: siteConfig.email,
  },
  hud: {
    sim: 'Simulated flight',
    mode: { idle: 'Standby', mission: 'Mission', manual: 'Manual', sense: 'Hand control', goto: 'Go to' },
    wp: 'WP',
    alt: 'ALT',
    gs: 'GS',
    hdg: 'HDG',
    fly: 'Fly the mission',
    pause: 'Hold',
    recenter: 'Recenter',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    zoomHint: 'Ctrl + scroll to zoom · drag to pan',
    keys: 'Map focused: WASD or arrows to fly · Space for the next waypoint',
    hand: 'Fly with your hand',
    handStop: 'Stop the camera',
    handNote: 'Your camera stays on this device: frames are analysed here and never stored or sent.',
    handHint: 'Move your hand left or right to turn, up to speed up.',
    handDenied: 'No camera, or permission declined. The keyboard and the map still fly it.',
    sound: 'Sound',
    lidar: 'LiDAR',
    lidarNote: 'Simulated scan of the terrain under the drone',
    sees: 'What the tracker sees',
    open: 'Open the case',
    source: 'Source',
    close: 'Close',
    north: 'N',
  },
}
