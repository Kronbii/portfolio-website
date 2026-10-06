import { siteConfig } from '@/lib/site'

import { HOME, missionData, V5, v5Copy } from './mission'

/** Everything the ground-control app needs, assembled on the server. */
export function groundProps() {
  const { route, projects, regions } = missionData()
  return {
    pilot: v5Copy.hero,
    creds: v5Copy.creds,
    route,
    projects,
    regions,
    home: HOME,
    profiles: [
      { label: 'GitHub', href: siteConfig.socials.github },
      { label: 'LinkedIn', href: siteConfig.socials.linkedin },
      { label: 'Medium', href: siteConfig.socials.medium },
      { label: 'Arduino Libraries', href: siteConfig.socials.arduinolibraries },
    ],
    copy: { hud: v5Copy.hud, briefing: { ...v5Copy.briefing, projectsLede: v5Copy.briefing.projectsLede(projects.length) } },
    base: V5,
    preview: 'v5 preview',
  }
}
