import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/v2/json-ld'
import { liveCrumbs, collectionJsonLd } from '@/components/v2/schema'
import { BackButton } from '@/components/vneo/back'
import { ProjectGrid, type GridItem } from '@/components/vneo/project-grid'
import { projectImages } from '@/content/v2/record'
import { fields } from '@/content/v3/work'
import { VN, racePhoto, showcase, workHref, works } from '@/content/vneo/site'

const copy = {
  title: 'Projects',
  description:
    'Every project Rami Kronbi has published: robots and drones, vision and AI, health, civic, open-source work, and tools, each in one plain sentence with one fact to check.',
  lede: (n: number) =>
    `${n} projects. Each in a sentence, with the one fact you can check; the whole story is a click away.`,
  all: 'All',
}

/** Imagen's photographs belong to its client. */
const PRIVATE_MEDIA = new Set(['imagen-raw-to-edit-dataset-pipeline'])

export const metadata: Metadata = {
  title: { absolute: 'Projects — Rami Kronbi' },
  description: copy.description,
  alternates: { canonical: '/projects' },
  robots: { index: false, follow: false },
}

export default function VneoProjects() {
  const items: GridItem[] = works
    // REE is superseded by Juno
    .filter(({ project: p }) => p.slug !== 'ree-personal-finance-tracker')
    .map(({ project: p, plain }) => {
      const raw = PRIVATE_MEDIA.has(p.slug)
        ? undefined
        : (plain.image ??
          projectImages(p).find((m) => !/\.(gif|svg)$/.test(m.src)))
      const img = raw ? racePhoto(raw) : undefined
      return {
        slug: p.slug,
        title: p.title.split(' — ')[0],
        kind: plain.kind,
        line: plain.line,
        proof: plain.proof,
        field: plain.field,
        href: workHref(p.slug, VN),
        image: img
          ? {
              src: img.src,
              position: plain.image?.position,
              contain: /sign-|schematic|\.png$/.test(img.src),
            }
          : undefined,
      }
    })
  const juno = showcase.find((t) => t.slug === 'juno')!
  items.push({
    slug: juno.slug,
    title: juno.title,
    kind: juno.kind,
    line: juno.line,
    proof: juno.proof,
    field: 'tools',
    href: juno.href,
    external: true,
    image: juno.image
      ? { src: juno.image.src, position: juno.image.position }
      : undefined,
  })
  return (
    <>
      <JsonLd
        data={[
          collectionJsonLd({
            path: '/projects',
            name: 'Projects',
            description: copy.description,
            projects: works.map((w) => w.project),
          }),
          liveCrumbs([
            { label: 'Home', href: '/' },
            { label: 'Projects', href: '/projects' },
          ]),
        ]}
      />
      <section className="v7-index vn-index">
        <div className="vn-backbar">
          <BackButton fallback={VN} label="Back" />
          <nav className="v7-crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href={VN}>Home</Link>
              </li>
              <li aria-current="page">{copy.title}</li>
            </ol>
          </nav>
        </div>
        <h1 className="v7-index-title" data-lens="">
          {copy.title}
        </h1>
        <p className="v7-more-lede">{copy.lede(works.length)}</p>
        <ProjectGrid items={items} fields={fields} all={copy.all} />
      </section>
    </>
  )
}
