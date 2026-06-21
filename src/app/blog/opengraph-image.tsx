import { buildPageOgImage } from '@/lib/og-page'

export const runtime = 'edge'
export const alt = 'My Blog: Reflections from My Journey'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return buildPageOgImage({
    pageName: 'My Blog',
    pageSubtitle:
      'Reflections, technical deep dives, and opinion pieces on disaster risk reduction, humanitarian data systems, climate analytics, and cash programming.',
    eyebrow: 'Field Notes',
    multiPillar: true,
  })
}
