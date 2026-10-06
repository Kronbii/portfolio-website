/** Map units to degrees, anchored so the base sits at Beirut's real coordinates (33.89° N, 35.50° E). */
export function latLon(x: number, y: number) {
  const lat = 33.89 - (y - 1250) * 0.0004
  const lon = 35.5 + (x - 790) * 0.0004
  return `${lat.toFixed(3)}° N · ${lon.toFixed(3)}° E`
}

/** Field height to metres: the high ridge peaks near 2,900 m. */
export const metres = (h: number) => Math.round(Math.max(0, h) * 1850)
