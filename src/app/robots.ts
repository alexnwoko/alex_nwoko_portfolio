import type { MetadataRoute } from 'next'

/**
 * Robots policy: open to all reputable crawlers; sitemap pointer included
 * so search engines discover every blog post and static page automatically.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: 'https://alexnwoko.com/sitemap.xml',
    host: 'https://alexnwoko.com',
  }
}
