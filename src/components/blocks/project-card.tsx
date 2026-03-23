import Link from 'next/link'
import Image from 'next/image'

import { type Project } from '@/content/schema'
import { Card } from '@/components/ui/card'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const href = project.externalUrl ?? `/projects/${project.slug}`

  return (
    <Card className="group overflow-hidden p-0">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-surface-2">
        <Image
          src={project.media.src}
          alt={project.media.alt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Selected work
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
          {project.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {project.summary}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((technology) => (
            <span
              key={technology}
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              {technology}
            </span>
          ))}
        </div>
        <Link
          href={href}
          className="mt-6 inline-flex text-sm font-semibold text-foreground transition-opacity hover:opacity-70"
        >
          {project.externalUrl ? 'View project' : 'Reserved project route'}
        </Link>
      </div>
    </Card>
  )
}
