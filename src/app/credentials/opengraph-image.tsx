import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt =
  'Credentials & Featured In: Alex Nwoko, featuring the Durham University Geography Department Alumni Newsletter, Summer 2026.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Custom Open Graph card for /credentials that features the current
 * "Featured In" highlight — the Durham University Geography Department
 * Alumni Newsletter (Summer 2026, p. 9).
 *
 * Composition:
 *   - Left column (~60%): brand chrome (page name, subtitle, eyebrow, footer)
 *   - Right column (~40%): inset thumbnail of the newsletter page + a small
 *     "FEATURED IN" caption
 *
 * The inset image is loaded from the same origin at
 * /featured-in/durham-alumni-summer-2026-thumb.jpg. Because the OG
 * generator runs on the edge, the image must be a fully-qualified URL —
 * we use the production origin so social scrapers see the same output
 * regardless of the environment they hit.
 */

const BRAND = {
  beige: '#F5EFE6',
  coffee: '#3D2B1F',
  coffeeMuted: '#6B5A4D',
}

// Purple accent used across the site's Durham-related surfaces (About
// page's "Featured Alumni" card, Credentials page's Durham entry).
const ACCENT = '#7B4B94'

const FEATURE_IMAGE_URL =
  'https://alexnwoko.com/featured-in/durham-alumni-summer-2026-thumb.jpg'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: BRAND.beige,
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Top accent stripe */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '12px',
            backgroundColor: ACCENT,
          }}
        />

        {/* LEFT: brand chrome + page name + subtitle + footer */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '720px',
            padding: '54px 56px 60px 72px',
            justifyContent: 'space-between',
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '28px',
                fontWeight: 700,
                color: BRAND.coffee,
                letterSpacing: '-0.5px',
              }}
            >
              Alex Nwoko
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: '13px',
                  color: BRAND.coffeeMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  marginBottom: '4px',
                }}
              >
                Track Record
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '16px',
                  color: BRAND.coffeeMuted,
                  letterSpacing: '0.5px',
                }}
              >
                alexnwoko.com
              </div>
            </div>
          </div>

          {/* Page name + subtitle */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                fontSize: '96px',
                fontWeight: 700,
                color: BRAND.coffee,
                letterSpacing: '-2.5px',
                lineHeight: 1,
                marginBottom: '20px',
              }}
            >
              Credentials
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '22px',
                color: BRAND.coffee,
                fontWeight: 500,
                lineHeight: 1.35,
                opacity: 0.85,
              }}
            >
              Education, certifications, and third-party features across a decade of humanitarian data systems work.
            </div>
          </div>

          {/* Footer, role */}
          <div
            style={{
              display: 'flex',
              fontSize: '20px',
              fontWeight: 600,
              color: BRAND.coffee,
            }}
          >
            Disaster Risk &amp; Humanitarian Data Systems Architect
          </div>
        </div>

        {/* RIGHT: feature panel with the Durham newsletter thumbnail */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '480px',
            padding: '54px 72px 60px 40px',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          {/* Featured In label */}
          <div
            style={{
              display: 'flex',
              fontSize: '13px',
              color: ACCENT,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontWeight: 700,
              marginBottom: '18px',
            }}
          >
            Featured In
          </div>

          {/* Newsletter thumbnail — portrait, framed */}
          <div
            style={{
              display: 'flex',
              flex: 1,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Using <img> so the edge runtime fetches and embeds the JPEG */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FEATURE_IMAGE_URL}
              alt="Durham University Alumni Newsletter, Summer 2026, page 9."
              width={320}
              height={452}
              style={{
                borderRadius: '8px',
                border: `2px solid ${ACCENT}`,
                boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
              }}
            />
          </div>

          {/* Publication caption */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: '18px',
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '15px',
                fontWeight: 700,
                color: BRAND.coffee,
                lineHeight: 1.3,
                marginBottom: '4px',
              }}
            >
              Durham University Geography Department
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '14px',
                color: BRAND.coffeeMuted,
                lineHeight: 1.3,
              }}
            >
              Alumni Newsletter, Summer 2026 &middot; p. 9
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
