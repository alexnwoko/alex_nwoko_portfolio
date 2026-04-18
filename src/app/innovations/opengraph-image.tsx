import { buildPageOgImage } from '@/lib/og-page'

export const runtime = 'edge'
export const alt = 'Innovations — Alex Nwoko'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return buildPageOgImage({
    pageName: 'Innovations',
    pageSubtitle:
      'Voice AI, agentic systems, and the future of humanitarian information management.',
    eyebrow: 'What I Am Building',
    accentColor: '#009EDB',
  })
}
