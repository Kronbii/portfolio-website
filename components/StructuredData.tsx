export default function StructuredData() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Rami Kronbi',
    jobTitle: 'AI & Computer Vision Engineer',
    url: 'https://ramikronbi.com',
    image: 'https://ramikronbi.com/icon-512.png',
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
    name: 'Rami Kronbi',
    alternateName: 'Rami Kronbi',
    url: 'https://ramikronbi.com',
    publisher: {
      '@type': 'Person',
      name: 'Rami Kronbi',
      url: 'https://ramikronbi.com'
    },
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://ramikronbi.com/?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
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
    </>
  )
}
