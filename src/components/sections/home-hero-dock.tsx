'use client'

import { useMemo } from 'react'
import { BriefcaseBusiness, Github, Linkedin, Mail } from 'lucide-react'

import MagicDock, { type DockItemData } from '@/components/ui/magicdock'
import { homeContent } from '@/content/home'

const { hero, contact } = homeContent

const githubChannel = contact.channels.find((channel) =>
  channel.label.toLowerCase().includes('github')
)
const linkedInChannel = contact.channels.find((channel) =>
  channel.label.toLowerCase().includes('linkedin')
)
const emailChannel = contact.channels.find((channel) =>
  channel.href.startsWith('mailto:')
)

function navigateToHash(hash: string) {
  if (window.location.pathname !== '/') {
    window.location.assign(`/${hash}`)
    return
  }

  const target = document.querySelector(hash)
  if (target instanceof HTMLElement) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  window.history.replaceState(null, '', hash)
}

function runAction(href: string) {
  if (href.startsWith('#')) {
    navigateToHash(href)
    return
  }

  if (href.startsWith('mailto:')) {
    window.location.href = href
    return
  }

  if (href.startsWith('http')) {
    window.open(href, '_blank', 'noopener,noreferrer')
    return
  }

  window.location.assign(href)
}

export function SiteDock() {
  const items = useMemo<DockItemData[]>(
    () => [
      {
        id: 1,
        icon: <BriefcaseBusiness className="size-5 text-white" />,
        label: 'Work',
        description: 'Selected projects',
        onClick: () => runAction(hero.primaryCta.href),
      },
      {
        id: 2,
        icon: <Github className="size-5 text-white" />,
        label: 'GitHub',
        description: githubChannel?.sublabel ?? 'Case studies',
        onClick: () => runAction(githubChannel?.href ?? 'https://github.com/Kronbii'),
      },
      {
        id: 3,
        icon: <Linkedin className="size-5 text-white" />,
        label: 'LinkedIn',
        description: linkedInChannel?.sublabel ?? 'Professional updates',
        onClick: () =>
          runAction(
            linkedInChannel?.href ?? 'https://www.linkedin.com/in/rami-kronbi/'
          ),
      },
      {
        id: 4,
        icon: <Mail className="size-5 text-white" />,
        label: 'Email',
        description: emailChannel?.sublabel ?? 'Best for briefs',
        onClick: () => runAction(emailChannel?.href ?? 'mailto:ramykronby@gmail.com'),
      },
    ],
    []
  )

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60]">
      <MagicDock
        items={items}
        variant="default" //default, gradient, tooltip
        panelHeight={50}
        baseItemSize={50}
        magnification={60}
        distance={70}
        className="pointer-events-auto bottom-3 sm:bottom-4 lg:bottom-5 border-white/20 bg-black/65"
      />
    </div>
  )
}
