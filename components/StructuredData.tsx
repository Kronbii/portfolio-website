export default function StructuredData() {
  const baseUrl = 'https://ramikronbi.com'
  const siteName = 'Rami Kronbi'
  const profileImage = `${baseUrl}/profile.webp`
  const logoImage = `${baseUrl}/icon-512.png`
  const ogImage = `${baseUrl}/og-image.webp`

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

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What does Rami Kronbi specialize in?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Rami Kronbi specializes in AI and Computer Vision engineering. He builds multidisciplinary intelligent systems including real-time computer vision applications, autonomous robotics, edge-optimized ML deployment, and custom machine learning solutions. His expertise spans the full development lifecycle from prototype to production deployment, with a focus on delivering production-ready systems for startups, agencies, and tech companies.',
        },
      },
      {
        '@type': 'Question',
        name: 'What kind of projects does Rami Kronbi work on?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Rami works on production-ready AI systems across multiple domains: computer vision for robotics and enterprise applications, real-time perception systems for autonomous vehicles, thermal imaging pipelines, sign language translation systems, and custom machine learning solutions. His projects include autonomous race cars, thermal super-resolution systems achieving 229+ FPS, AI-powered accessibility tools, and IoT smart systems. Project engagements typically range from 3-10 weeks depending on complexity and scope.',
        },
      },
      {
        '@type': 'Question',
        name: 'Who does Rami Kronbi work with?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Rami works with startups building intelligent products, agencies delivering AI solutions to their clients, and tech companies modernizing their systems with computer vision and machine learning. His clients operate across multiple industries including robotics, autonomous systems, industrial inspection, accessibility technology, and enterprise AI applications.',
        },
      },
      {
        '@type': 'Question',
        name: 'What technologies does Rami Kronbi use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Rami works with PyTorch and TensorFlow for deep learning model development, OpenCV for computer vision applications, and TensorRT for edge optimization and production deployment. He has extensive experience with embedded systems platforms including Jetson Nano, ESP32, and Arduino.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I hire Rami Kronbi for a project?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For project inquiries, email ramykronby@gmail.com with your project brief including scope, timeline, and technical requirements. Typical response time is 24-48 hours. Rami offers several engagement types: AI Solutions (4-8 weeks), Computer Vision Systems (3-6 weeks), ML Advisory (2-4 weeks), and Robotics & Autonomy projects (4-10 weeks).',
        },
      },
      {
        '@type': 'Question',
        name: 'What makes Rami Kronbi different from other AI engineers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Rami brings hands-on experience across the full AI development cycle—from research and prototyping to production deployment and edge optimization. He has built award-winning autonomous systems (WRO 2023 Champion), delivered real-time AI solutions achieving industry-leading performance (thermal SR at 229+ FPS), and led community initiatives. His multidisciplinary approach combines computer vision, robotics, and systems engineering to deliver reliable, production-ready solutions.',
        },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </>
  )
}
