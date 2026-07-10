/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/trigger-to-action',
        destination: '/blog/from-trigger-to-coordinated-early-action',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
