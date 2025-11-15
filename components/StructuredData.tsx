export default function StructuredData() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://ramikronbi.com/#person',
    name: 'Rami Kronbi',
    jobTitle: 'AI & Computer Vision Engineer',
    url: 'https://ramikronbi.com',
    image: 'https://ramikronbi.com/profile.jpg',
    logo: 'https://ramikronbi.com/icon-512.png',
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
    '@id': 'https://ramikronbi.com/#website',
    name: 'Rami Kronbi',
    alternateName: ['Rami Kronbi Portfolio', 'ramikronbi.com'],
    url: 'https://ramikronbi.com',
    description: 'Rami Kronbi - AI and Computer Vision Engineer Portfolio',
    publisher: {
      '@id': 'https://ramikronbi.com/#person'
    },
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://ramikronbi.com/?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }

  const profilePageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': 'https://ramikronbi.com/#profilepage',
    mainEntity: {
      '@id': 'https://ramikronbi.com/#person'
    },
    name: 'Rami Kronbi - AI & Computer Vision Engineer',
    description: 'Professional portfolio and contact information for Rami Kronbi',
    url: 'https://ramikronbi.com',
    inLanguage: 'en-US',
    isPartOf: {
      '@id': 'https://ramikronbi.com/#website'
    }
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://ramikronbi.com/#organization',
    name: 'Rami Kronbi',
    url: 'https://ramikronbi.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://ramikronbi.com/icon-512.png',
      width: 512,
      height: 512
    },
    sameAs: [
      'https://github.com/Kronbii',
      'https://www.linkedin.com/in/rami-kronbi/'
    ]
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Rami Kronbi',
        item: 'https://ramikronbi.com',
      },
    ],
  }

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
    </>
  )
}
