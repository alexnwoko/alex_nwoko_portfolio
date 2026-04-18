import { buildPageOgImage } from '@/lib/og-page'

export const runtime = 'edge'
export const alt = 'About Alex Nwoko — Disaster Risk and Humanitarian Data Systems Architect'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return buildPageOgImage({
    pageName: 'About',
    pageSubtitle:
      'A decade of building humanitarian data, geospatial, climate, and cash programming systems across six countries.',
    eyebrow: 'About Alex',
    accentColor: '#C4703F',
  })
}
