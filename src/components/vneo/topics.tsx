import Link from 'next/link'

import { hubs, topicHref } from '@/content/vneo/topics'

/** The fields a project or a note belongs to, each a link to its hub. */
export function TopicLinks({
  slugs,
  label = 'Topics',
}: {
  slugs: string[]
  label?: string
}) {
  const list = hubs.filter((t) => slugs.includes(t.slug))
  if (!list.length) return null
  return (
    <nav className="vn-topics" aria-label={label}>
      <span className="vn-topics-k">{label}</span>
      <ul>
        {list.map((t) => (
          <li key={t.slug}>
            <Link href={topicHref(t.slug)}>{t.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
