/**
 * The /v3 colour options, one source of truth. Each palette sets the page's
 * tokens for both themes, the intro's colours, and the "camera palette" the
 * hero feed and the hover scans read through, the way a thermal camera offers
 * ironbow, green-hot, arctic, and so on. CSS is generated from this list
 * (paletteCss) and rendered once in the layout, so a choice applies before
 * first paint.
 */

export interface Palette {
  id: string
  name: string
  /** How it reads, for the picker. */
  family: string
  /** The camera palette the hero feed shows in this colourway. */
  camera: string
  backlog?: boolean
  dark: { bg: string; surface: string; raised: string; sunk: string; ink: string; brand: string; brandStrong: string; brandInk: string }
  light: {
    bg: string
    surface: string
    raised: string
    sunk: string
    hair: string
    hairStrong: string
    ink: string
    ink2: string
    ink3: string
    brand: string
    brandStrong: string
  }
  /** Eight stops, cold to hot: the camera's colour map. */
  ramp: [string, string, string, string, string, string, string, string]
  /**
   * How the lens splits light: which channel separates from the other two.
   * g = green against magenta (an achromat's secondary spectrum), r = red
   * against cyan, b = blue against yellow: the three fringes real glass shows.
   */
  split: 'r' | 'g' | 'b'
  /** The two fringe colours, outward then inward, per theme. */
  fringe: { dark: [string, string]; light: [string, string] }
}

export const palettes: Palette[] = [
  {
    // An achromatic doublet brings red and blue to one focus; what it cannot fix,
    // the secondary spectrum, fringes green and magenta. The page keeps the green
    // as its colour and leaves the magenta to the aberration.
    id: 'achromat',
    name: 'Achromat',
    family: 'Green + magenta fringe · from aberration',
    camera: 'Secondary spectrum',
    dark: {
      bg: '#08080b',
      surface: '#101015',
      raised: '#17171e',
      sunk: '#050507',
      ink: '#f1f0f5',
      brand: '#8ef5bd',
      brandStrong: '#b6fbd4',
      brandInk: '#04200f',
    },
    light: {
      bg: '#f7f7f6',
      surface: '#ffffff',
      raised: '#ededea',
      sunk: '#efefec',
      hair: '#dededa',
      hairStrong: '#c5c5bf',
      ink: '#111114',
      ink2: '#3c3c44',
      ink3: '#63636d',
      brand: '#0f7a45',
      brandStrong: '#0b5e35',
    },
    ramp: ['#05040a', '#170c33', '#2e1a5e', '#3b3f8c', '#2f7d96', '#34b38f', '#8ef0b5', '#f4fff8'],
    split: 'g',
    fringe: { dark: ['#5cf5a0', '#e65cff'], light: ['#00a35a', '#b81fd6'] },
  },
  {
    id: 'mint',
    name: 'Mint',
    family: 'Green–aqua · pastel',
    camera: 'Aurora',
    dark: {
      bg: '#061010',
      surface: '#0b1918',
      raised: '#112321',
      sunk: '#030909',
      ink: '#e9f5f2',
      brand: '#7fe6cb',
      brandStrong: '#a9f3de',
      brandInk: '#032019',
    },
    light: {
      bg: '#f1f7f5',
      surface: '#ffffff',
      raised: '#e5efec',
      sunk: '#e8f1ee',
      hair: '#d5e3df',
      hairStrong: '#b9cdc7',
      ink: '#0b1715',
      ink2: '#34433f',
      ink3: '#5a6b66',
      brand: '#0d7560',
      brandStrong: '#0a5c4b',
    },
    ramp: ['#02060c', '#071a2e', '#0a3550', '#0e5a6a', '#138a7f', '#34bc97', '#8fe9c8', '#f0fff9'],
    split: 'g',
    fringe: { dark: ['#5cf0c8', '#ff6fb0'], light: ['#00a07c', '#c92a76'] },
  },
  {
    id: 'sage',
    name: 'Sage',
    family: 'Green · muted pastel',
    camera: 'Moss',
    dark: {
      bg: '#0b0d0c',
      surface: '#121614',
      raised: '#191e1b',
      sunk: '#070908',
      ink: '#eef1ec',
      brand: '#b7d3a8',
      brandStrong: '#d0e6c4',
      brandInk: '#10180d',
    },
    light: {
      bg: '#f4f4ef',
      surface: '#ffffff',
      raised: '#ebebe3',
      sunk: '#edede6',
      hair: '#deded5',
      hairStrong: '#c7c7bb',
      ink: '#161a16',
      ink2: '#3e443e',
      ink3: '#646b63',
      brand: '#4d6b40',
      brandStrong: '#3b5431',
    },
    ramp: ['#050605', '#111a14', '#213126', '#36503c', '#557457', '#7e9e78', '#b7d3a8', '#f4f8ee'],
    split: 'g',
    fringe: { dark: ['#a6e68f', '#e08fd0'], light: ['#4b8a35', '#a03f8c'] },
  },
  {
    id: 'phosphor',
    name: 'Phosphor',
    family: 'Green · bold, night vision',
    camera: 'Green hot',
    dark: {
      bg: '#070a08',
      surface: '#0e130f',
      raised: '#151c17',
      sunk: '#040605',
      ink: '#ecf3ec',
      brand: '#8df26b',
      brandStrong: '#b2ff95',
      brandInk: '#071204',
    },
    light: {
      bg: '#f4f6f1',
      surface: '#ffffff',
      raised: '#eaeee5',
      sunk: '#eceee7',
      hair: '#dce1d6',
      hairStrong: '#c2caba',
      ink: '#0d130e',
      ink2: '#39433a',
      ink3: '#5f6a60',
      brand: '#2f7a12',
      brandStrong: '#245f0d',
    },
    ramp: ['#020503', '#06140a', '#0b2f14', '#145a22', '#23902f', '#4cc63a', '#a5f27a', '#f2ffe6'],
    split: 'g',
    fringe: { dark: ['#7dff55', '#c455ff'], light: ['#2a9a0f', '#8a24c2'] },
  },
  {
    id: 'sky',
    name: 'Sky',
    family: 'Blue · pastel',
    camera: 'Sky',
    dark: {
      bg: '#0a0e14',
      surface: '#111721',
      raised: '#18202d',
      sunk: '#06090d',
      ink: '#edf2f8',
      brand: '#9ecbff',
      brandStrong: '#c2deff',
      brandInk: '#071628',
    },
    light: {
      bg: '#f3f6fa',
      surface: '#ffffff',
      raised: '#e7edf4',
      sunk: '#eaf0f6',
      hair: '#d8e1eb',
      hairStrong: '#bcc9d8',
      ink: '#0e1520',
      ink2: '#384456',
      ink3: '#5e6a7c',
      brand: '#2b66a8',
      brandStrong: '#214f84',
    },
    ramp: ['#04070c', '#0c1a2e', '#16304f', '#234c74', '#3a6e9c', '#5f96c6', '#9ecbff', '#f2f8ff'],
    split: 'b',
    fringe: { dark: ['#6fb8ff', '#ffd36b'], light: ['#1f6fd0', '#b08600'] },
  },
  {
    id: 'electric',
    name: 'Electric',
    family: 'Blue · bold',
    camera: 'Arctic',
    dark: {
      bg: '#05070e',
      surface: '#0b0f1b',
      raised: '#111727',
      sunk: '#03040a',
      ink: '#eaf0fb',
      brand: '#5b95ff',
      brandStrong: '#8ab4ff',
      brandInk: '#020a1c',
    },
    light: {
      bg: '#f4f6fb',
      surface: '#ffffff',
      raised: '#e8ecf6',
      sunk: '#ebeff8',
      hair: '#d9dfec',
      hairStrong: '#bcc6db',
      ink: '#0b1020',
      ink2: '#36405a',
      ink3: '#5c6680',
      brand: '#1f4fd6',
      brandStrong: '#183fae',
    },
    ramp: ['#02030a', '#06103a', '#0a2275', '#1442b8', '#2a6ef0', '#5b9bff', '#a8ccff', '#f2f7ff'],
    split: 'r',
    fringe: { dark: ['#ff5470', '#45d6ff'], light: ['#d01f3c', '#0b8fbf'] },
  },
  {
    id: 'periwinkle',
    name: 'Periwinkle',
    family: 'Blue-violet · pastel',
    camera: 'Lilac',
    dark: {
      bg: '#0b0b12',
      surface: '#13131d',
      raised: '#1a1a27',
      sunk: '#07070c',
      ink: '#efeef8',
      brand: '#b4b0ff',
      brandStrong: '#cfccff',
      brandInk: '#120f2e',
    },
    light: {
      bg: '#f5f4fa',
      surface: '#ffffff',
      raised: '#ebe9f4',
      sunk: '#eeecf6',
      hair: '#dedbea',
      hairStrong: '#c5c1d9',
      ink: '#13111f',
      ink2: '#3d3a52',
      ink3: '#636079',
      brand: '#5047c4',
      brandStrong: '#3e369f',
    },
    ramp: ['#05040b', '#141136', '#262066', '#3b3496', '#5a51c2', '#8780e6', '#c1bdff', '#f8f7ff'],
    split: 'b',
    fringe: { dark: ['#8f88ff', '#fff07a'], light: ['#4a40c8', '#9c8a00'] },
  },
  {
    id: 'thermal',
    name: 'Thermal',
    family: 'Amber · backlog',
    camera: 'Ironbow',
    backlog: true,
    dark: {
      bg: '#08090d',
      surface: '#10121a',
      raised: '#171a24',
      sunk: '#050609',
      ink: '#edf0f7',
      brand: '#ffa53a',
      brandStrong: '#ffc46e',
      brandInk: '#150b02',
    },
    light: {
      bg: '#f6f6f3',
      surface: '#ffffff',
      raised: '#ecece7',
      sunk: '#eeeee9',
      hair: '#dfdfd8',
      hairStrong: '#c4c4bb',
      ink: '#0e1016',
      ink2: '#3a3e49',
      ink3: '#62666f',
      brand: '#9a4e00',
      brandStrong: '#7a3d00',
    },
    ramp: ['#05040f', '#1b0b4a', '#4a0e7a', '#8e1a86', '#d2364f', '#f46d1e', '#ffb23f', '#ffe9a8'],
    split: 'r',
    fringe: { dark: ['#ff4d4d', '#3de0ff'], light: ['#d01f1f', '#0e9bc0'] },
  },
]

export const DEFAULT_PALETTE = 'achromat'
export const paletteIds = palettes.map((p) => p.id)
export const paletteById = (id: string | undefined) => palettes.find((p) => p.id === id) ?? palettes[0]

const rgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}
const rgbList = (hex: string) => rgb(hex).join(', ')
const a = (hex: string, alpha: number) => `rgba(${rgbList(hex)}, ${alpha})`

/** The ramp as feComponentTransfer table values, per channel. */
export function rampTables(ramp: string[]) {
  const ch = (i: number) => ramp.map((h) => (rgb(h)[i] / 255).toFixed(3)).join(' ')
  return { r: ch(0), g: ch(1), b: ch(2) }
}

/** The channel pair a split leaves: shifting one against the other is the fringe. */
export const others = { r: 'gb', g: 'rb', b: 'rg' } as const

/** Every palette's rules, for one <style> in the layout. */
export function paletteCss(): string {
  return palettes
    .map((p) => {
      const d = p.dark
      const l = p.light
      const sel = `[data-v3][data-palette='${p.id}']`
      const stops = p.ramp.map((c, i) => `--t${i}: ${c};`).join(' ')
      return [
        `${sel} { --bg: ${d.bg}; --surface: ${d.surface}; --raised: ${d.raised}; --sunk: ${d.sunk};`,
        ` --hair: ${a(d.ink, 0.1)}; --hair-strong: ${a(d.ink, 0.22)}; --grid: ${a(d.ink, 0.04)};`,
        ` --ink: ${d.ink}; --ink-2: ${a(d.ink, 0.72)}; --ink-3: ${a(d.ink, 0.54)};`,
        ` --brand: ${d.brand}; --brand-strong: ${d.brandStrong}; --brand-ink: ${d.brandInk};`,
        ` --brand-tint: ${a(d.brand, 0.09)}; --brand-wash: ${a(d.brand, 0.17)};`,
        ` --signal: ${d.brand}; --signal-ink: ${d.brandInk}; --media-ink: ${d.ink}; --media-ground: ${p.ramp[0]};`,
        ` ${stops} --ramp: url(#v3-ramp-${p.id});`,
        ` --ca-a: ${p.fringe.dark[0]}; --ca-b: ${p.fringe.dark[1]};`,
        ` --ch-a: url(#v3-ch-${p.split}); --ch-b: url(#v3-ch-${others[p.split]}); }`,
        `${sel}[data-theme='light'] { --bg: ${l.bg}; --surface: ${l.surface}; --raised: ${l.raised}; --sunk: ${l.sunk};`,
        ` --hair: ${l.hair}; --hair-strong: ${l.hairStrong}; --grid: ${a(l.ink, 0.045)};`,
        ` --ink: ${l.ink}; --ink-2: ${l.ink2}; --ink-3: ${l.ink3};`,
        ` --brand: ${l.brand}; --brand-strong: ${l.brandStrong}; --brand-ink: #ffffff;`,
        ` --brand-tint: ${a(l.brand, 0.07)}; --brand-wash: ${a(l.brand, 0.13)};`,
        ` --ca-a: ${p.fringe.light[0]}; --ca-b: ${p.fringe.light[1]}; }`,
        `${sel} [data-intro-overlay] { --i-bg: ${d.bg}; --i-sunk: ${d.sunk}; --i-ink: ${d.ink}; --i-ink-rgb: ${rgbList(d.ink)};`,
        ` --i-brand: ${d.brand}; --i-brand-strong: ${d.brandStrong}; --i-brand-rgb: ${rgbList(d.brand)};`,
        ` --ca-a: ${p.fringe.dark[0]}; --ca-b: ${p.fringe.dark[1]}; }`,
        `html:has(${sel}) { background: ${d.bg}; scrollbar-color: ${a(d.ink, 0.22)} ${d.bg}; }`,
        `html:has(${sel}[data-theme='light']) { background: ${l.bg}; scrollbar-color: ${l.hairStrong} ${l.bg}; }`,
        `html:has(${sel}[data-intro='on']), html:has(${sel}[data-intro='playing']) { scrollbar-color: ${d.sunk} ${d.sunk}; }`,
      ].join('')
    })
    .join('\n')
}
