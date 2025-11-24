export default function StructuredData() {
  const baseUrl = 'https://ramikronbi.com'
  const siteName = 'Rami Kronbi'
  const profileImage = `${baseUrl}/profile.jpg`
  const logoImage = `${baseUrl}/icon-512.png`
  const ogImage = `${baseUrl}/og-image.jpg`

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${baseUrl}/#person`,
    name: siteName,
    jobTitle: 'AI & Computer Vision Engineer',
    url: baseUrl,
    image: profileImage,
    logo: logoImage,
    sameAs: [
      'https://github.com/Kronbii',
      'https://www.linkedin.com/in/rami-kronbi/',
    ],
    description:
      'AI and Computer Vision Engineer specializing in machine learning, deep learning, and computer vision.',
  }

  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${baseUrl}/#profilepage`,
    mainEntity: { '@id': `${baseUrl}/#person` },
    name: `${siteName} - AI & Computer Vision Engineer`,
    description: 'Professional portfolio and contact information for Rami Kronbi.',
    url: baseUrl,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: ogImage,
      width: 1200,
      height: 630,
    },
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: siteName,
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: logoImage,
      width: 512,
      height: 512,
    },
    sameAs: [
      'https://github.com/Kronbii',
      'https://www.linkedin.com/in/rami-kronbi/',
    ],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: siteName,
        item: baseUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(profilePageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  )
}
