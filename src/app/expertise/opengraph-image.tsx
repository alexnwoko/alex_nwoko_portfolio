import { buildPageOgImage } from '@/lib/og-page'

export const runtime = 'edge'
export const alt = 'Expertise: Alex Nwoko'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return buildPageOgImage({
    pageName: 'Expertise',
    pageSubtitle:
      'Data Analytics & IM, GIS & Remote Sensing, Climate Analytics & DRR, and Humanitarian Cash Programming.',
    eyebrow: 'Capabilities',
    multiPillar: true,
  })
}
