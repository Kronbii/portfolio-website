import { palettes, rampTables } from '@/content/v3/palettes'

/** Colour-matrix rows that keep only the named channels (the lens's channel split). */
const CHANNELS: Record<string, string> = {
  r: '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0',
  g: '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0',
  b: '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0',
  gb: '0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0',
  rb: '1 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0',
  rg: '1 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0',
}

/**
 * The page's optical filters. Channel filters (v3-ch-*) keep only some of an
 * image's colour channels; a photo seen through the lens is two of them,
 * shifted against each other and added back together, which is exactly how
 * chromatic aberration separates light. Ramp filters, one per palette and
 * referenced through the palette's --ramp token
 * (`filter: var(--ramp)`): each reads an image's brightness and maps it through
 * that palette's camera colour map, the way a thermal camera shows heat.
 * Bright reads hot, dark reads cold.
 */
export function ThermalFilter() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
      <defs>
        {Object.entries(CHANNELS).map(([id, values]) => (
          <filter key={id} id={`v3-ch-${id}`} colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values={values} />
          </filter>
        ))}
        {palettes.map((p) => {
          const t = rampTables(p.ramp)
          return (
            <filter key={p.id} id={`v3-ramp-${p.id}`} colorInterpolationFilters="sRGB">
              <feColorMatrix
                type="matrix"
                values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0"
              />
              <feComponentTransfer>
                <feFuncR type="table" tableValues={t.r} />
                <feFuncG type="table" tableValues={t.g} />
                <feFuncB type="table" tableValues={t.b} />
              </feComponentTransfer>
            </filter>
          )
        })}
      </defs>
    </svg>
  )
}
