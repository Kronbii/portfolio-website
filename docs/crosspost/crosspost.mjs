#!/usr/bin/env node
/*
 * Cross-post the site's writing to DEV, Medium, and Hashnode, with every copy
 * pointing back to ramikronbi.com as its canonical URL.
 *
 *   node docs/crosspost/crosspost.mjs export            write posts/*.md
 *   node docs/crosspost/crosspost.mjs publish devto     dry run: what would be posted
 *   node docs/crosspost/crosspost.mjs publish devto --go [--limit=3]
 *   node docs/crosspost/crosspost.mjs publish medium --go [--draft]
 *   node docs/crosspost/crosspost.mjs publish hashnode --go
 *
 * Keys come from the environment or the repo's .env (never printed):
 *   DEVTO_API_KEY                       dev.to → Settings → Extensions → DEV API Keys
 *   MEDIUM_TOKEN                        Medium integration token (legacy accounts only)
 *   HASHNODE_TOKEN, HASHNODE_PUBLICATION_ID   Hashnode Pro only (the API is paid since May 2026)
 *
 * What was posted is recorded in published.json, so a rerun never posts twice.
 * Posts that already exist on DEV and Medium in an older form are skipped
 * unless --include-existing is passed.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..', '..')
const SITE = 'https://ramikronbi.com'
const STATE = join(HERE, 'published.json')

/** Already on DEV and Medium as earlier posts ("We Built Sign Language AI…", "Seeing in the Dark…"). */
const EXISTING = new Set([
  'building-real-time-lebanese-sign-language-translation',
  'adapting-super-resolution-to-thermal-imagery',
])

/** Topic → a DEV-style tag (lowercase letters and digits only). */
const TAG = {
  'computer-vision': 'computervision',
  'robotics-perception': 'robotics',
  robotics: 'robotics',
  'embedded-systems': 'embedded',
  'control-systems': 'controlsystems',
  'edge-ai': 'edgeai',
  'open-source-engineering': 'opensource',
  'applied-ai': 'ai',
  'health-technology': 'healthtech',
  'document-intelligence': 'ocr',
  'civic-technology': 'civictech',
  'information-integrity': 'civictech',
  'full-stack-systems': 'webdev',
  'local-first-software': 'localfirst',
  flutter: 'flutter',
  'product-engineering': 'product',
  'education-technology': 'edtech',
  lebanon: 'lebanon',
  'frontend-engineering': 'react',
  'infrastructure-inspection': 'computervision',
}
/** Writing with no topics of its own. */
const TAGS_FOR = {
  'engineering-a-five-inch-fpv-drone-from-first-principles': ['drones', 'embedded', 'robotics', 'controlsystems'],
  'what-four-years-of-technical-mentoring-taught-me': ['mentoring', 'hackathon', 'nasa', 'career'],
  'building-technology-around-crisis-response-operations': ['humanitarian', 'opensource', 'react', 'firebase'],
  'talks-workshops-and-teaching': ['speaking', 'ai', 'git', 'career'],
}

// ---- content ------------------------------------------------------------

function loadTs(rel) {
  const require = createRequire(join(ROOT, 'package.json'))
  const ts = require('typescript')
  const src = readFileSync(join(ROOT, rel), 'utf8').replace(/^import[^\n]*\n/gm, '')
  const out = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const m = { exports: {} }
  new Function('module', 'exports', 'require', out)(m, m.exports, () => ({}))
  return m.exports
}

const { readyArticles } = loadTs('src/content/authority/articles.ts')
const { readyProjects } = loadTs('src/content/authority/projects.ts')
const projectOf = (a) => readyProjects.find((p) => p.slug === a.projectSlug)

/** The race car's article photo is shown on the site in its refined version. */
const photo = (src) =>
  src === '/images/authority/race-car/front.jpeg' ? '/images/vneo/race-refined.jpg' : src

function cover(a) {
  if (a.heroMedia) return { src: SITE + photo(a.heroMedia.src), alt: a.heroMedia.alt }
  const p = projectOf(a)
  if (p?.hero.kind === 'image') return { src: SITE + p.hero.media.src, alt: p.hero.media.alt }
  return { src: `${SITE}/images/vneo/rami-kronbi-card.jpg`, alt: 'Rami Kronbi' }
}

function tags(a) {
  const t = TAGS_FOR[a.slug] ?? [...new Set(a.topics.map((s) => TAG[s]).filter(Boolean))]
  return t.slice(0, 4)
}

function body(a, { withTitle = false } = {}) {
  const url = `${SITE}/writing/${a.slug}`
  const p = projectOf(a)
  const c = cover(a)
  const out = []
  if (withTitle) out.push(`# ${a.title}`, '', `*${a.dek}*`, '', `![${c.alt}](${c.src})`, '')
  for (const b of a.body) {
    out.push(b.kind === 'p' ? b.text : `${b.kind === 'h2' ? '##' : '###'} ${b.text}`, '')
  }
  if (a.sources.length) {
    out.push('## Links', '')
    for (const s of a.sources) out.push(`- [${s.label}](${s.href})`)
    out.push('')
  }
  out.push(
    '---',
    '',
    `*Originally published at [ramikronbi.com](${url})${
      p ? `. The project: [${p.title.split(' — ')[0]}](${SITE}/projects/${p.slug})` : ''
    }.*`,
    ''
  )
  return out.join('\n')
}

const post = (a) => ({
  slug: a.slug,
  title: a.title,
  description: a.dek,
  canonical: `${SITE}/writing/${a.slug}`,
  tags: tags(a),
  cover: cover(a).src,
})

// ---- export -------------------------------------------------------------

function exportAll() {
  const dir = join(HERE, 'posts')
  mkdirSync(dir, { recursive: true })
  for (const a of readyArticles) {
    const p = post(a)
    const front = [
      '---',
      `title: ${JSON.stringify(p.title)}`,
      `description: ${JSON.stringify(p.description)}`,
      `canonical_url: ${p.canonical}`,
      `cover_image: ${p.cover}`,
      `tags: ${p.tags.join(', ')}`,
      'published: false',
      '---',
      '',
    ].join('\n')
    writeFileSync(join(dir, `${a.slug}.md`), front + body(a))
  }
  console.log(`wrote ${readyArticles.length} posts to docs/crosspost/posts/`)
}

// ---- publish ------------------------------------------------------------

function env(name) {
  if (process.env[name]) return process.env[name]
  const f = join(ROOT, '.env')
  if (!existsSync(f)) return undefined
  const line = readFileSync(f, 'utf8')
    .split('\n')
    .find((l) => l.startsWith(`${name}=`))
  return line ? line.slice(name.length + 1).trim().replace(/^["']|["']$/g, '') : undefined
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const state = () => (existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : {})
function record(platform, slug, url) {
  const s = state()
  s[platform] = { ...(s[platform] ?? {}), [slug]: url }
  writeFileSync(STATE, JSON.stringify(s, null, 2) + '\n')
}
const norm = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

const platforms = {
  devto: {
    key: 'DEVTO_API_KEY',
    gap: 35_000,
    async existing(key) {
      const r = await fetch('https://dev.to/api/articles/me/all?per_page=1000', {
        headers: { 'api-key': key, accept: 'application/vnd.forem.api-v1+json' },
      })
      if (!r.ok) throw new Error(`DEV: listing your posts failed (${r.status})`)
      const list = await r.json()
      return new Set(list.flatMap((x) => [x.canonical_url, norm(x.title)]))
    },
    async send(key, a, draft) {
      const p = post(a)
      const r = await fetch('https://dev.to/api/articles', {
        method: 'POST',
        headers: {
          'api-key': key,
          'content-type': 'application/json',
          accept: 'application/vnd.forem.api-v1+json',
        },
        body: JSON.stringify({
          article: {
            title: p.title,
            body_markdown: body(a),
            published: !draft,
            canonical_url: p.canonical,
            description: p.description,
            tags: p.tags,
            main_image: p.cover,
          },
        }),
      })
      if (!r.ok) throw new Error(`DEV ${r.status}: ${(await r.text()).slice(0, 200)}`)
      return (await r.json()).url
    },
  },
  medium: {
    key: 'MEDIUM_TOKEN',
    gap: 5_000,
    async existing() {
      return new Set() // Medium's API cannot list posts; published.json guards reruns
    },
    async send(key, a, draft) {
      const p = post(a)
      const h = { authorization: `Bearer ${key}`, 'content-type': 'application/json' }
      const me = await fetch('https://api.medium.com/v1/me', { headers: h })
      if (!me.ok) throw new Error(`Medium: token rejected (${me.status})`)
      const id = (await me.json()).data.id
      const r = await fetch(`https://api.medium.com/v1/users/${id}/posts`, {
        method: 'POST',
        headers: h,
        body: JSON.stringify({
          title: p.title,
          contentFormat: 'markdown',
          content: body(a, { withTitle: true }),
          canonicalUrl: p.canonical,
          tags: p.tags.slice(0, 5),
          publishStatus: draft ? 'draft' : 'public',
        }),
      })
      if (!r.ok) throw new Error(`Medium ${r.status}: ${(await r.text()).slice(0, 200)}`)
      return (await r.json()).data.url
    },
  },
  hashnode: {
    key: 'HASHNODE_TOKEN',
    gap: 5_000,
    async existing() {
      return new Set()
    },
    async send(key, a, draft) {
      if (draft) throw new Error('Hashnode: --draft is not supported here; publish or use the dashboard')
      const publicationId = env('HASHNODE_PUBLICATION_ID')
      if (!publicationId) throw new Error('Hashnode: set HASHNODE_PUBLICATION_ID')
      const p = post(a)
      const r = await fetch('https://gql.hashnode.com', {
        method: 'POST',
        headers: { authorization: key, 'content-type': 'application/json' },
        body: JSON.stringify({
          query:
            'mutation P($input: PublishPostInput!) { publishPost(input: $input) { post { url } } }',
          variables: {
            input: {
              publicationId,
              title: p.title,
              subtitle: p.description.slice(0, 250),
              contentMarkdown: body(a),
              originalArticleURL: p.canonical,
              coverImageOptions: { coverImageURL: p.cover },
              tags: p.tags.map((t) => ({ slug: t, name: t })),
            },
          },
        }),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok || j.errors) throw new Error(`Hashnode ${r.status}: ${JSON.stringify(j.errors ?? j).slice(0, 200)}`)
      return j.data.publishPost.post.url
    },
  },
}

async function publish(name, { go, draft, includeExisting, limit }) {
  const pf = platforms[name]
  if (!pf) throw new Error(`unknown platform "${name}" (devto, medium, hashnode)`)
  const key = env(pf.key)
  const done = state()[name] ?? {}
  const queue = readyArticles
    .filter((a) => !done[a.slug] && (includeExisting || !EXISTING.has(a.slug)))
    .slice(0, limit)
  if (!go || !key) {
    if (!key) console.log(`${pf.key} is not set; showing what would be posted.`)
    for (const a of queue) console.log(`  would post: ${a.title}  [${tags(a).join(', ')}]`)
    console.log(`${queue.length} posts. Pass --go to post them${draft ? ' as drafts' : ''}.`)
    return
  }
  const seen = await pf.existing(key)
  for (const [i, a] of queue.entries()) {
    const p = post(a)
    if (seen.has(p.canonical) || seen.has(norm(p.title))) {
      console.log(`skip (already there): ${a.title}`)
      record(name, a.slug, 'existing')
      continue
    }
    const url = await pf.send(key, a, draft)
    record(name, a.slug, url)
    console.log(`posted: ${a.title} → ${url}`)
    if (i < queue.length - 1) await sleep(pf.gap)
  }
}

const [cmd, platform, ...flags] = process.argv.slice(2)
if (cmd === 'export') exportAll()
else if (cmd === 'publish' && platform)
  await publish(platform, {
    go: flags.includes('--go'),
    draft: flags.includes('--draft'),
    includeExisting: flags.includes('--include-existing'),
    limit: Number(flags.find((f) => f.startsWith('--limit='))?.slice(8)) || undefined,
  })
else console.log(readFileSync(fileURLToPath(import.meta.url), 'utf8').split('*/')[0])
