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
      'https://www.linkedin.com/in/rami-kronbi/'
    ],
    knowsAbout: [
      'Artificial Intelligence',
      'Computer Vision',
      'Machine Learning',
      'Deep Learning',
      'TensorFlow',
      'PyTorch',
      'OpenCV',
      'Project Management'
    ],
    description:
      'AI and Computer Vision Engineer specializing in machine learning, deep learning, and computer vision solutions. Aspiring Project Manager.'
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    name: siteName,
    alternateName: ['Rami Kronbi Portfolio', 'ramikronbi.com'],
    url: baseUrl,
    description: 'Rami Kronbi - AI and Computer Vision Engineer Portfolio',
    image: ogImage,
    publisher: {
      '@id': `${baseUrl}/#person`
    },
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${baseUrl}/#profilepage`,
    mainEntity: {
      '@id': `${baseUrl}/#person`
    },
    name: 'Rami Kronbi - AI & Computer Vision Engineer',
    description: 'Professional portfolio and contact information for Rami Kronbi',
    url: baseUrl,
    inLanguage: 'en-US',
    isPartOf: {
      '@id': `${baseUrl}/#website`
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: ogImage,
      width: 1200,
      height: 630
    }
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
      height: 512
    },
    sameAs: [
      'https://github.com/Kronbii',
      'https://www.linkedin.com/in/rami-kronbi/'
    ],
    image: logoImage
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

  const navigationTargets = [
    { name: 'Home', hash: '#home' },
    { name: 'Services', hash: '#services' },
    { name: 'About', hash: '#about' },
    { name: 'Projects', hash: '#projects' },
    { name: 'Skills', hash: '#skills' },
    { name: 'Certifications', hash: '#certifications' },
    { name: 'Contact', hash: '#contact' },
  ]

  const siteNavigationSchema = navigationTargets.map((item) => ({
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: item.name,
    url: `${baseUrl}/${item.hash}`,
  }))

  return (
    <>
      {/* Person Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema)
        }}
      />

      {/* Website Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />

      {/* ProfilePage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(profilePageSchema)
        }}
      />

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema)
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />

      {/* Site Navigation Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(siteNavigationSchema)
        }}
      />
    </>
  )
}
