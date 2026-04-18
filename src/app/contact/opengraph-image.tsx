import { buildPageOgImage } from '@/lib/og-page'

export const runtime = 'edge'
export const alt = 'Contact Alex Nwoko'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return buildPageOgImage({
    pageName: 'Contact',
    pageSubtitle:
      'Available for short consulting engagements in disaster risk and humanitarian data systems. Let\u2019s build something that matters.',
    eyebrow: 'Get in Touch',
    accentColor: '#3D2B1F',
  })
}
