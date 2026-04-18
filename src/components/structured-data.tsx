import { siteConfig } from '@/lib/site'

export function StructuredData() {
  const personId = `${siteConfig.url}/#person`
  const oreyeonId = 'https://www.oreyeon.com/#organization'

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
      name: 'Rami Kronbi',
      url: siteConfig.url,
      email: siteConfig.email,
      jobTitle: 'Embedded Systems & Vision Engineer',
      description:
        'Rami Kronbi is an AI systems and computer vision engineer based in Beirut, Lebanon. He works as Embedded Systems & Vision Engineer at Oreyeon, building real-time runway safety monitoring systems deployed in production airport environments. He has engineered edge-deployed ML pipelines achieving 229+ FPS on constrained hardware, designed autonomous race vehicles, and built OmniSign, an AI-powered Lebanese Sign Language translator. He founded Nasna, a data-driven NGO providing crisis relief during the 2024 Lebanon war, and organized the NASA Space Apps Beirut hackathon for four consecutive years (2022–2025). He is a Rafik Hariri University graduate and recipient of the Nazik Rafik Hariri Graduate Studies Award (2025).',
      image: `${siteConfig.url}/images/home/portrait.avif`,
      homeLocation: {
        '@type': 'Place',
        name: 'Beirut, Lebanon',
      },
      worksFor: {
        '@type': 'Organization',
        '@id': oreyeonId,
        name: 'Oreyeon',
        url: siteConfig.employer.url,
      },
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'Rafik Hariri University',
        url: siteConfig.education.url,
      },
      award: 'Nazik Rafik Hariri Graduate Studies Award, 2025',
      knowsAbout: [
        'Computer Vision',
        'Embedded Systems',
        'Machine Learning',
        'Autonomous Robotics',
        'Edge AI',
        'Real-Time Systems',
        'TensorRT',
        'PyTorch',
        'OpenCV',
        'Thermal Imaging',
        'Sign Language Recognition',
      ],
      sameAs: [
        siteConfig.socials.github,
        siteConfig.socials.linkedin,
        siteConfig.socials.medium,
        siteConfig.socials.devto,
        siteConfig.socials.hashnode,
        siteConfig.socials.researchgate,
        siteConfig.socials.arduinolibraries,
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': 'https://medium.com/@ramikronbi/seeing-in-the-dark-real-time-thermal-super-resolution-that-actually-runs-on-edge-devices-5d95b4bab7b2',
      headline:
        'Seeing in the Dark: Real-Time Thermal Super-Resolution That Actually Runs on Edge Devices',
      author: { '@id': personId },
      url: 'https://medium.com/@ramikronbi/seeing-in-the-dark-real-time-thermal-super-resolution-that-actually-runs-on-edge-devices-5d95b4bab7b2',
      datePublished: '2026-02-01',
      sameAs:
        'https://dev.to/ramikronbi/seeing-in-the-dark-real-time-thermal-super-resolution-that-actually-runs-on-edge-devices-3nc7',
      publisher: {
        '@type': 'Organization',
        name: 'Medium',
        url: 'https://medium.com',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': 'https://medium.com/@ramikronbi/ai-should-serve-society-not-just-industry-and-billionaires-52d6b685e35d',
      headline: 'AI Should Serve Society — Not Just Industry and Billionaires',
      author: { '@id': personId },
      url: 'https://medium.com/@ramikronbi/ai-should-serve-society-not-just-industry-and-billionaires-52d6b685e35d',
      datePublished: '2026-01-09',
      sameAs:
        'https://dev.to/ramikronbi/ai-should-serve-society-not-just-industry-and-billionaires-37c9',
      publisher: {
        '@type': 'Organization',
        name: 'Medium',
        url: 'https://medium.com',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      '@id': 'https://north25.gdglebanon.com/#event',
      name: 'GDG DevFest North Lebanon 2025',
      startDate: '2025-12-20',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: 'Lebanon',
      },
      url: 'https://north25.gdglebanon.com/',
      performer: { '@id': personId },
      organizer: {
        '@type': 'Organization',
        name: 'GDG Lebanon',
        url: 'https://devfest.gdglebanon.com/',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Event',
      '@id': 'https://www.spaceappschallenge.org/2025/local-events/beirut/#event',
      name: 'NASA Space Apps Challenge Beirut 2025',
      startDate: '2025-10-01',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: 'Beirut, Lebanon',
      },
      url: 'https://www.spaceappschallenge.org/2025/local-events/beirut/?tab=details',
      organizer: { '@id': personId },
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

