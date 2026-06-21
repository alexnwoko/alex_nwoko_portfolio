import { buildPageOgImage } from '@/lib/og-page'

export const runtime = 'edge'
export const alt = 'Credentials: Alex Nwoko'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return buildPageOgImage({
    pageName: 'Credentials',
    pageSubtitle:
      'Education, certifications, peer recognition, and recommendations from leadership across six countries of humanitarian operation.',
    eyebrow: 'Track Record',
    accentColor: '#8B3A2F',
  })
}
