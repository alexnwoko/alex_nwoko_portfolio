import { ImageResponse } from 'next/og'
import { getPostMeta } from '@/lib/blog-posts-meta'

export const runtime = 'edge'
export const alt = 'Alex Nwoko: Blog Post'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Per-post Open Graph image generator.
 *
 * Reads post metadata from the single source of truth at
 * src/lib/blog-posts-meta.ts so every post listed on /blog automatically
 * gets a themed share card — no duplicate POSTS lookup to keep in sync.
 *
 * Each card adapts to the post's pillar / theme:
 *   - Pillar accent colour drives the top stripe, theme tag, and brand mark
 *   - A standardised theme label (e.g. "CLIMATE ANALYTICS & DRR", "VOICE AI
 *     & DATA ANALYTICS", "CASH PROGRAMMING") is displayed prominently so
 *     the topic reads at a glance in a LinkedIn / Twitter feed
 *
 * Six themes supported:
 *   1. Climate Analytics & DRR (green)
 *   2. IM & Data Analytics (deep blue)
 *   3. Voice AI & Data Analytics (UN bright blue)
 *   4. Cash Programming (dark red)
 *   5. Cross-cutting (orange)
 *   6. GIS & Remote Sensing (purple)
 */

const BRAND = {
  beige: '#F5EFE6',
  coffee: '#3D2B1F',
  coffeeMuted: '#6B5A4D',
}

/**
 * Standardised theme label per pillar — what's printed prominently on the
 * card. Short and recognisable in a busy social feed.
 */
function getThemeLabel(pillar: string): string {
  switch (pillar) {
    case 'Climate Analytics & DRR':
      return 'CLIMATE ANALYTICS & DRR'
    case 'Data Analytics & IM':
      return 'IM & DATA ANALYTICS'
    case 'Data Analytics':
      return 'VOICE AI & DATA ANALYTICS'
    case 'GIS':
      return 'GIS & REMOTE SENSING'
    case 'Cash Programming':
    case 'Climate & Cash':
      return 'CASH PROGRAMMING'
    case 'Cross-cutting':
    default:
      return 'CROSS-CUTTING'
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // Next.js 16: params is a Promise and must be awaited.
  const { slug } = await params

  // Lookup metadata in the shared catalogue. If the slug isn't known,
  // fall back to a neutral placeholder card so social previews never
  // 500 — but this should never fire for any post listed on /blog.
  const post = getPostMeta(slug) ?? {
    title: 'Blog Post',
    pillar: 'Cross-cutting' as const,
    pillarColor: '#C4703F',
    category: 'Article',
  }
  const themeLabel = getThemeLabel(post.pillar)

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
        {/* Top accent stripe — pillar color */}
        <div
          style={{
            display: 'flex',
            height: '12px',
            width: '100%',
            backgroundColor: post.pillarColor,
          }}
        />

        {/* Subtle right-edge stripe — gives the pillar colour presence */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: '12px',
            right: '0',
            width: '12px',
            height: '618px',
            backgroundColor: post.pillarColor,
          }}
        />

        {/* Header — site identity + url */}
        <div
          style={{
            display: 'flex',
            padding: '54px 72px 0 72px',
            justifyContent: 'space-between',
            alignItems: 'center',
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
              fontSize: '18px',
              color: BRAND.coffeeMuted,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            alexnwoko.com
          </div>
        </div>

        {/* Body — prominent THEME label + post title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '50px 72px 0 72px',
            flex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              backgroundColor: post.pillarColor,
              color: 'white',
              padding: '14px 28px',
              borderRadius: '10px',
              fontSize: '26px',
              fontWeight: 700,
              letterSpacing: '1px',
              marginBottom: '36px',
            }}
          >
            {themeLabel}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: post.title.length > 90 ? '52px' : post.title.length > 60 ? '60px' : '72px',
              fontWeight: 700,
              color: BRAND.coffee,
              lineHeight: 1.15,
              letterSpacing: '-1px',
              maxWidth: '1056px',
            }}
          >
            {post.title}
          </div>
        </div>

        {/* Footer — category + brand mark */}
        <div
          style={{
            display: 'flex',
            padding: '0 72px 60px 72px',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                fontSize: '20px',
                color: BRAND.coffeeMuted,
                marginBottom: '4px',
              }}
            >
              {post.category}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '24px',
                fontWeight: 600,
                color: BRAND.coffee,
              }}
            >
              Disaster Risk &amp; Humanitarian Data Systems
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                width: '8px',
                height: '40px',
                backgroundColor: post.pillarColor,
                borderRadius: '4px',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: '14px',
                  color: BRAND.coffeeMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Alex Nwoko
              </div>
              <div
                style={{
                  display: 'flex',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: BRAND.coffee,
                }}
              >
                Portfolio
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
