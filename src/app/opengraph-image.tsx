import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Alex Nwoko — Disaster Risk and Humanitarian Data Systems Architect'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Site-wide Open Graph image used by the homepage and any page that doesn't
 * provide its own. Rendered by Next.js into a static asset at /opengraph-image.
 *
 * Matches the visual language of the per-post OG images so the brand reads
 * as one family across LinkedIn / Twitter / Slack share previews.
 */

const BRAND = {
  beige: '#F5EFE6',
  coffee: '#3D2B1F',
  coffeeMuted: '#6B5A4D',
  duskyOrange: '#C4703F',
  darkRed: '#8B3A2F',
  unBlue: '#009EDB',
  green: '#2E7D32',
  purple: '#7B4B94',
}

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: BRAND.beige,
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Top accent stripe — multi-color rainbow representing the four pillars */}
        <div style={{ display: 'flex', height: '12px', width: '100%' }}>
          <div style={{ display: 'flex', flex: 1, backgroundColor: BRAND.green }} />
          <div style={{ display: 'flex', flex: 1, backgroundColor: BRAND.unBlue }} />
          <div style={{ display: 'flex', flex: 1, backgroundColor: BRAND.purple }} />
          <div style={{ display: 'flex', flex: 1, backgroundColor: BRAND.duskyOrange }} />
        </div>

        {/* URL marker top-right */}
        <div
          style={{
            display: 'flex',
            padding: '54px 72px 0 72px',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: '20px',
              color: BRAND.coffeeMuted,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            alexnwoko.com
          </div>
        </div>

        {/* Body — name + role */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 72px 0 72px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: '110px',
              fontWeight: 700,
              color: BRAND.coffee,
              letterSpacing: '-3px',
              lineHeight: 1,
              marginBottom: '24px',
            }}
          >
            Alex Nwoko
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '40px',
              color: BRAND.coffee,
              fontWeight: 500,
              lineHeight: 1.2,
              maxWidth: '1056px',
            }}
          >
            Disaster Risk &amp; Humanitarian Data Systems Architect
          </div>
        </div>

        {/* Pillar tags row */}
        <div
          style={{
            display: 'flex',
            padding: '0 72px 60px 72px',
            gap: '14px',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              backgroundColor: BRAND.green,
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '20px',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            Climate &amp; DRR
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: BRAND.unBlue,
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '20px',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            Data Analytics &amp; IM
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: BRAND.purple,
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '20px',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            GIS &amp; Remote Sensing
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: BRAND.duskyOrange,
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '20px',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            Cash Programming
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
