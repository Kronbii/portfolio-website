import { siteConfig } from '@/lib/site'

export function StructuredData() {
  const personId = `${siteConfig.url}/#person`
  const orgId = `${siteConfig.url}/#organization`

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': personId,
      name: siteConfig.name,
      url: siteConfig.url,
      email: siteConfig.email,
      jobTitle: 'Embedded Systems & Vision Engineer',
      description: siteConfig.description,
      homeLocation: {
        '@type': 'Place',
        name: siteConfig.location,
      },
      sameAs: [siteConfig.socials.github, siteConfig.socials.linkedin],
      worksFor: {
        '@id': orgId,
      },
      image: `${siteConfig.url}/images/shared/profile.webp`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': orgId,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/icons/icon-512.png`,
      sameAs: [siteConfig.socials.github, siteConfig.socials.linkedin],
    },
  ]

  return (
    <>
      {schemas.map((schema) => (
        <script
          key={schema['@id']}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
