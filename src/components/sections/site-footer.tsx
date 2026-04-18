import FooterWithFadedBrand, {
  type FooterColumn,
  type FooterLink,
} from '@/components/ui/footer-with-faded-brand'
import { siteConfig } from '@/lib/site'

const footerColumns: FooterColumn[] = [
  {
    heading: 'Navigation',
    links: [
      { text: 'Home', url: '#home' },
      { text: 'About', url: '#about' },
      { text: 'Portfolio', url: '#selected-work' },
    ],
  },
  {
    heading: 'Community',
    links: [
      { text: 'Community', url: '#community' },
      { text: 'Contact', url: '#contact' },
      { text: 'GitHub', url: siteConfig.socials.github },
      { text: 'LinkedIn', url: siteConfig.socials.linkedin },
    ],
  },
  {
    heading: 'Writing & Profiles',
    links: [
      { text: 'Medium', url: siteConfig.socials.medium },
      { text: 'DEV.to', url: siteConfig.socials.devto },
      { text: 'Hashnode', url: siteConfig.socials.hashnode },
      { text: 'ResearchGate', url: siteConfig.socials.researchgate },
      { text: 'Arduino Libraries', url: siteConfig.socials.arduinolibraries },
    ],
  },
]

const footerLegalLinks: FooterLink[] = [
  { text: 'Sitemap', url: '/sitemap.xml' },
  { text: 'Robots', url: '/robots.txt' },
]

export function SiteFooterSection() {
  return (
    <FooterWithFadedBrand
      brandName='KRONBI'
      tagline='AI systems and computer vision engineer'
      columns={footerColumns}
      socials={{
        github: siteConfig.socials.github,
        linkedin: siteConfig.socials.linkedin,
      }}
      copyright={`© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.`}
      legalLinks={footerLegalLinks}
      className='bg-background min-h-screen flex flex-col justify-between'
    />
  )
}