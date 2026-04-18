import { buildPageOgImage } from '@/lib/og-page'

export const runtime = 'edge'
export const alt = 'Projects — Alex Nwoko'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return buildPageOgImage({
    pageName: 'Projects',
    pageSubtitle:
      'Live work spanning six countries — UN agencies, INGOs, national disaster management, and climate response.',
    eyebrow: 'Selected Work',
    multiPillar: true,
  })
}
