import { ImageResponse } from 'next/og'

/**
 * Reusable Open Graph image generator for static pages (About, Expertise,
 * Projects, etc.). Each page directory exposes its own opengraph-image.tsx
 * that calls this helper with page-specific copy and a colour scheme.
 *
 * Two visual modes:
 *   - Single-accent: one pillar colour drives the top stripe, eyebrow tag,
 *     and brand mark. Used for pages with a clear topical focus
 *     (Innovations → Voice AI/Data Blue, Founder Journey → Cross-cutting
 *     Orange, etc.).
 *   - Multi-pillar: a four-segment rainbow stripe runs across the top and
 *     all four pillar tags appear in the body. Used for pages that span
 *     every pillar (Expertise, Projects, the blog listing).
 *
 * Both modes share the same chrome (Alex Nwoko brand, beige canvas, footer)
 * so all OG cards across the site read as one family.
 */

export const SIZE = { width: 1200, height: 630 } as const

const BRAND = {
  beige: '#F5EFE6',
  coffee: '#3D2B1F',
  coffeeMuted: '#6B5A4D',
}

/** All four pillar accents in the order used for the multi-pillar stripe. */
const PILLAR_TAGS: { label: string; color: string }[] = [
  { label: 'Climate & DRR', color: '#2E7D32' },
  { label: 'Data Analytics & IM', color: '#009EDB' },
  { label: 'GIS & Remote Sensing', color: '#7B4B94' },
  { label: 'Cash Programming', color: '#C4703F' },
]

export interface PageOgOptions {
  /** Big page name shown as the hero text (e.g. "About", "Expertise"). */
  pageName: string
  /** One-line tagline shown beneath the page name. */
  pageSubtitle: string
  /** Small uppercase label at top-right (e.g. "PORTFOLIO PAGE"). */
  eyebrow?: string
  /** Single pillar accent colour. Ignored when `multiPillar` is true. */
  accentColor?: string
  /** Render the multi-pillar rainbow stripe + all 4 pillar tags. */
  multiPillar?: boolean
}

export async function buildPageOgImage(opts: PageOgOptions): Promise<ImageResponse> {
  const {
    pageName,
    pageSubtitle,
    eyebrow = 'Portfolio Page',
    accentColor = BRAND.coffee,
    multiPillar = false,
  } = opts

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
        {/* Top stripe — multi-color (rainbow) for multi-pillar pages,
            single accent otherwise */}
        {multiPillar ? (
          <div style={{ display: 'flex', height: '12px', width: '100%' }}>
            {PILLAR_TAGS.map((p) => (
              <div
                key={p.color}
                style={{ display: 'flex', flex: 1, backgroundColor: p.color }}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              height: '12px',
              width: '100%',
              backgroundColor: accentColor,
            }}
          />
        )}

        {/* Subtle right-edge accent (single-accent pages only — gives the
            page a colour presence without overwhelming the layout) */}
        {!multiPillar && (
          <div
            style={{
              display: 'flex',
              position: 'absolute',
              top: '12px',
              right: '0',
              width: '12px',
              height: '618px',
              backgroundColor: accentColor,
            }}
          />
        )}

        {/* Header — site identity + eyebrow + URL */}
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
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: '14px',
                color: BRAND.coffeeMuted,
                textTransform: 'uppercase',
                letterSpacing: '2px',
                marginBottom: '4px',
              }}
            >
              {eyebrow}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '18px',
                color: BRAND.coffeeMuted,
                letterSpacing: '0.5px',
              }}
            >
              alexnwoko.com
            </div>
          </div>
        </div>

        {/* Body — large page name + subtitle */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '60px 72px 0 72px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: '128px',
              fontWeight: 700,
              color: BRAND.coffee,
              letterSpacing: '-3px',
              lineHeight: 1,
              marginBottom: '32px',
            }}
          >
            {pageName}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '32px',
              color: BRAND.coffee,
              fontWeight: 500,
              lineHeight: 1.3,
              maxWidth: '1056px',
              opacity: 0.85,
            }}
          >
            {pageSubtitle}
          </div>

          {/* Multi-pillar tag row — only for pages spanning all pillars */}
          {multiPillar && (
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: '40px',
                flexWrap: 'wrap',
              }}
            >
              {PILLAR_TAGS.map((p) => (
                <div
                  key={p.label}
                  style={{
                    display: 'flex',
                    backgroundColor: p.color,
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  {p.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — role + brand mark */}
        <div
          style={{
            display: 'flex',
            padding: '0 72px 60px 72px',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: '24px',
              fontWeight: 600,
              color: BRAND.coffee,
            }}
          >
            Disaster Risk &amp; Humanitarian Data Systems Architect
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                width: '8px',
                height: '40px',
                backgroundColor: multiPillar ? BRAND.coffee : accentColor,
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
    { ...SIZE }
  )
}
