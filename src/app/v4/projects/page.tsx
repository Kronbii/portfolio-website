import type { Metadata } from 'next'

import { JsonLd } from '@/components/v2/json-ld'
import { collectionJsonLd, liveCrumbs, v2Meta } from '@/components/v2/schema'
import styles from '@/components/v3/work/case.module.css'
import { Crumbs } from '@/components/v3/work/crumbs'
import { ProjectIndex, type IndexRow } from '@/components/v3/work/project-index'
import { v3Case, v3Index } from '@/content/v3/pages'
import { fields, workHref, works } from '@/content/v3/work'
import { V4 } from '@/content/v4/home'

export const metadata: Metadata = v2Meta('/projects', v3Index.meta.title.replace('v3', 'v4'), v3Index.meta.description)

export default function V4Projects() {
  const rows: IndexRow[] = works.map(({ project, plain }) => ({
    slug: project.slug,
    title: project.title,
    kind: plain.kind,
    line: plain.line,
    proof: plain.proof,
    part: plain.part,
    field: plain.field,
    href: workHref(project.slug, V4),
    image: plain.image,
  }))

  return (
    <>
      <JsonLd
        data={[
          collectionJsonLd({ path: '/projects', name: 'Projects', description: v3Index.meta.description, projects: works.map((w) => w.project) }),
          liveCrumbs([
            { label: 'Home', href: '/' },
            { label: 'Projects', href: '/projects' },
          ]),
        ]}
      />
      <div className={styles.page}>
        <Crumbs
          items={[
            { label: v3Case.crumbs.home, href: V4 },
            { label: v3Case.crumbs.projects, href: `${V4}/projects` },
          ]}
        />
        <header className={styles.indexHead}>
          <h1 className={styles.indexTitle}>{v3Index.title}</h1>
          <p className={styles.indexLede}>{v3Index.lede(rows.length)}</p>
        </header>
        <ProjectIndex rows={rows} fields={fields} allLabel={v3Index.all} empty={v3Index.empty} />
      </div>
    </>
  )
}
