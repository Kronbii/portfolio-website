// Render the showreel composition to PNG frames.
//
//   node videos/showreel/render.mjs --out <dir> [--workers 3] [--from 0] [--to 15] [--fps 60] [--at 1.2,3.4]
//
// Serves the repository root on a local port, opens N headless Chrome pages on
// videos/showreel/index.html, and has each page shoot an interleaved share of the
// frames by calling window.renderFrame(t). renderFrame is a pure function of
// time, so frames are identical however the work is split.
//
// Needs playwright-core and a Chrome binary. Point PLAYWRIGHT_CORE at a
// playwright-core install if it is not resolvable from here, and CHROME at the
// browser (default /usr/bin/google-chrome).
import { createServer } from 'node:http'
import { createRequire } from 'node:module'
import { mkdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_CORE ?? 'playwright-core')

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []),
)
const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const OUT = resolve(args.out ?? 'frames')
const WORKERS = Number(args.workers ?? 3)
const tl = JSON.parse(readFileSync(join(ROOT, 'videos/showreel/timeline.json'), 'utf8'))
const FPS = Number(args.fps ?? tl.fps)
const FROM = Number(args.from ?? 0)
const TO = Number(args.to ?? tl.duration)
mkdirSync(OUT, { recursive: true })

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.ttf': 'font/ttf', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif' }
const server = createServer((req, res) => {
  const path = normalize(join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname)))
  if (!path.startsWith(ROOT)) return res.writeHead(403).end()
  try {
    if (!statSync(path).isFile()) throw new Error('not a file')
    res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' })
    res.end(readFileSync(path))
  } catch {
    res.writeHead(404).end()
  }
})
await new Promise((r) => server.listen(0, '127.0.0.1', r))
const url = `http://127.0.0.1:${server.address().port}/videos/showreel/index.html`

// frame list: explicit stills, or the whole range
const frames = args.at
  ? args.at.split(',').map((s) => ({ t: Number(s), name: `still-${Number(s).toFixed(2)}` }))
  : Array.from({ length: Math.round((TO - FROM) * FPS) }, (_, i) => {
      const f = Math.round(FROM * FPS) + i
      return { t: f / FPS, name: String(f).padStart(5, '0') }
    })

const browser = await chromium.launch({
  executablePath: process.env.CHROME ?? '/usr/bin/google-chrome',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--force-color-profile=srgb', '--font-render-hinting=none'],
})
const started = Date.now()
let done = 0
await Promise.all(
  Array.from({ length: WORKERS }, async (_, w) => {
    const page = await browser.newPage({ viewport: { width: tl.width, height: tl.height }, deviceScaleFactor: 1 })
    page.on('pageerror', (e) => console.error(`[worker ${w}]`, e.message))
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 })
    for (let i = w; i < frames.length; i += WORKERS) {
      const { t, name } = frames[i]
      await page.evaluate((tt) => window.renderFrame(tt), t)
      await page.screenshot({ path: join(OUT, `${name}.png`), clip: { x: 0, y: 0, width: tl.width, height: tl.height } })
      done++
      if (done % 60 === 0 || done === frames.length) {
        const s = (Date.now() - started) / 1000
        console.log(`${done}/${frames.length} frames · ${s.toFixed(0)}s · ${(s / done).toFixed(3)}s/frame`)
      }
    }
    await page.close()
  }),
)
await browser.close()
server.close()
