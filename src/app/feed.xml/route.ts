import { getProject, readyArticles } from '@/content/authority'
import { racePhoto } from '@/content/vneo/site'
import { siteConfig } from '@/lib/site'

/*
 * The writing as a full-text RSS feed. Besides readers, it is what DEV,
 * Hashnode, and Medium import from: each item links back to its page here,
 * which they keep as the canonical URL.
 */

export const dynamic = 'force-static'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const attr = (s: string) => esc(s).replace(/"/g, '&quot;')
const abs = (path: string) => `${siteConfig.url}${path}`

function content(a: (typeof readyArticles)[number]): string {
  const url = abs(`/writing/${a.slug}`)
  const project = a.projectSlug ? getProject(a.projectSlug) : undefined
  const companion = project && project.state === 'ready' ? project : undefined
  const hero = a.heroMedia ? racePhoto(a.heroMedia) : undefined
  const parts = [
    hero
      ? `<figure><img src="${attr(abs(hero.src))}" alt="${attr(hero.alt)}"/>${hero.caption ? `<figcaption>${esc(hero.caption)}</figcaption>` : ''}</figure>`
      : '',
    ...a.body.map((b) =>
      b.kind === 'p' ? `<p>${esc(b.text)}</p>` : `<${b.kind}>${esc(b.text)}</${b.kind}>`
    ),
    a.sources.length
      ? `<h2>Links</h2><ul>${a.sources
          .map((s) => `<li><a href="${attr(s.href)}">${esc(s.label)}</a></li>`)
          .join('')}</ul>`
      : '',
    `<p><em>Originally published at <a href="${attr(url)}">ramikronbi.com</a>${
      companion
        ? `. The project: <a href="${attr(abs(`/projects/${companion.slug}`))}">${esc(companion.title.split(' — ')[0])}</a>`
        : ''
    }.</em></p>`,
  ]
  return parts.join('').replace(/]]>/g, ']]]]><![CDATA[>')
}

export function GET() {
  const items = readyArticles
    .map((a) => {
      const url = abs(`/writing/${a.slug}`)
      return `    <item>
      <title>${esc(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${esc(a.dek)}</description>
      <dc:creator>${esc(siteConfig.name)}</dc:creator>
${a.keywords.map((k) => `      <category>${esc(k)}</category>`).join('\n')}
      <content:encoded><![CDATA[${content(a)}]]></content:encoded>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Writing — ${esc(siteConfig.name)}</title>
    <link>${abs('/writing')}</link>
    <atom:link href="${abs('/feed.xml')}" rel="self" type="application/rss+xml"/>
    <description>How the work was done: the decisions, the failures, and what was measured.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`
  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
