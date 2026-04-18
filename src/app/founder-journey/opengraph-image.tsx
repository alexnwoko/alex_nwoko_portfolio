import { buildPageOgImage } from '@/lib/og-page'

export const runtime = 'edge'
export const alt = 'Founder Journey — Alex Nwoko'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return buildPageOgImage({
    pageName: 'Founder Journey',
    pageSubtitle:
      'From humanitarian data systems to digitising Africa\u2019s informal economies — building Vendoh and MAKKET.',
    eyebrow: 'Crisis to Commerce',
    accentColor: '#C4703F',
  })
}
