/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // the site was reviewed at /vneo before it became the site: those links land on its pages
  async redirects() {
    return [
      { source: '/vneo', destination: '/', permanent: true },
      { source: '/vneo/:path*', destination: '/:path*', permanent: true },
    ]
  },
}

module.exports = nextConfig
