import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Alex Nwoko — Blog Post'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Per-post Open Graph image generator.
 *
 * Generates a 1200x630 image at /blog/<slug>/opengraph-image so every blog
 * post gets its own social-share card AND a structured-data `image` (which
 * resolves the Rich Results "Missing field image" warning).
 *
 * Resolves post metadata directly from the slug. Kept in sync with the blog
 * post catalogue in [slug]/page.tsx — only the fields needed for the image
 * are duplicated here, since this file runs in the Edge runtime and can't
 * import the full post bodies.
 */

interface PostMeta {
  title: string
  pillar: string
  pillarColor: string
  category: string
}

const POSTS: Record<string, PostMeta> = {
  // Founder & cross-cutting
  'from-humanitarian-data-to-digitising-africas-markets': {
    title: "From Crisis Zones Digital Systems to Market Zones Digital Transition for Africa's Informal Economies",
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    category: 'Founder Reflection',
  },
  'why-i-build-systems-not-dashboards': {
    title: 'Why I Build Systems, Not Dashboards',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    category: 'Opinion',
  },
  'future-of-humanitarian-im-is-agentic': {
    title: 'The Future of Humanitarian IM is Agentic',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    category: 'Opinion / Technical',
  },
  // Voice AI series
  'voice-is-the-future-of-humanitarian-data': {
    title: 'Voice Is the Future of Humanitarian Data and Evidence Generation',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    category: 'Opinion / Technical Vision',
  },
  'the-form-is-already-dead': {
    title: 'From Forms to Voice: The Deeper Inclusive Transition',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    category: 'Opinion / Technical',
  },
  'africa-will-define-voice-ai': {
    title: 'Africa Will Define How the World Uses Voice AI',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    category: 'Opinion / Founder Reflection',
  },
  'voice-powered-decision-intelligence': {
    title: 'From Reporting Platforms to Voice-Powered Decision Intelligence',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    category: 'Opinion / Technical',
  },
  'the-voices-our-data-systems-silence': {
    title: 'The Voices Our Data Systems Were Built to Silence',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    category: 'Opinion',
  },
  'voice-infrastructure-inequality': {
    title: 'Voice Infrastructure Inequality: The New Digital Divide',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    category: 'Opinion / Research',
  },
  'building-voice-native-evidence-systems': {
    title: 'Building Voice-Native Evidence Systems: From Theory to Architecture',
    pillar: 'Data Analytics',
    pillarColor: '#009EDB',
    category: 'Technical Vision',
  },
  // DRR series
  'disaster-loss-data-climate-adaptation': {
    title: 'Why Disaster Loss Data Matters More Than Ever for Climate Adaptation',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    category: 'Opinion / Cornerstone',
  },
  'building-systems-governments-can-own': {
    title: 'Building Disaster Data Systems That Governments Can Own',
    pillar: 'Data Analytics & IM',
    pillarColor: '#1565C0',
    category: 'Opinion / Field Reflection',
  },
  'desinventar-to-delta-resilience': {
    title: 'The Evolution of National Disaster Tracking: From DesInventar to DELTA Resilience',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    category: 'Observer Technical Deep Dive',
  },
  'g-drsf-statisticians-disaster-managers': {
    title: 'The Global Disaster-Related Statistics Framework',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    category: 'Cornerstone / Policy Explainer',
  },
  'delta-resilience-early-warning-anticipatory-action': {
    title: 'From Forecast to Action: Operationalising Early Warning and Anticipatory Action with DELTA Resilience',
    pillar: 'Climate Analytics & DRR',
    pillarColor: '#2E7D32',
    category: 'Technical Deep Dive / Opinion',
  },
  'data-ecosystem-maturity-assessment-guide': {
    title: 'The Data Ecosystem Maturity Assessment: A Practitioner\'s Guide',
    pillar: 'Data Analytics & IM',
    pillarColor: '#1565C0',
    category: 'Tutorial / Technical Deep Dive',
  },
  'lessons-six-countries': {
    title: 'Lessons from Building Humanitarian Data Platforms Across Multiple Crisis Contexts',
    pillar: 'Cross-cutting',
    pillarColor: '#C4703F',
    category: 'Field Reflection / Career Narrative',
  },
  'politics-of-humanitarian-data-infrastructure': {
    title: 'The Politics of Humanitarian Data Infrastructure: Who Owns the System When Everyone Walks Away?',
    pillar: 'Data Analytics & IM',
    pillarColor: '#1565C0',
    category: 'Opinion / Field Reflection',
  },
}

/**
 * Brand background tint that pairs with the warm beige used across the site.
 * Each pillar contributes a soft tinted hero band; the rest of the canvas
 * stays in the brand's beige/coffee palette so all images feel like part of
 * one family.
 */
const BRAND = {
  beige: '#F5EFE6',
  coffee: '#3D2B1F',
  coffeeMuted: '#6B5A4D',
  duskyOrange: '#C4703F',
}

export default async function Image({ params }: { params: { slug: string } }) {
  const post = POSTS[params.slug] ?? {
    title: 'Blog Post',
    pillar: 'Cross-cutting',
    pillarColor: BRAND.duskyOrange,
    category: 'Article',
  }

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
        {/* Top accent band — pillar color */}
        <div
          style={{
            display: 'flex',
            height: '12px',
            width: '100%',
            backgroundColor: post.pillarColor,
          }}
        />

        {/* Soft tinted hero band that picks up the pillar color at low opacity */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: '12px',
            right: '0',
            width: '420px',
            height: '618px',
            backgroundColor: post.pillarColor,
            opacity: 0.08,
          }}
        />

        {/* Header: site identity */}
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

        {/* Body: pillar tag + title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '60px 72px 0 72px',
            flex: 1,
          }}
        >
          {/* Pillar tag */}
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              backgroundColor: post.pillarColor,
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '20px',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              marginBottom: '36px',
            }}
          >
            {post.pillar}
          </div>

          {/* Title — auto-shrink for very long titles */}
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

        {/* Footer: byline + category */}
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
              flexDirection: 'column',
            }}
          >
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

          {/* Brand mark */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: '8px',
                height: '40px',
                backgroundColor: post.pillarColor,
                borderRadius: '4px',
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
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
    {
      ...size,
    }
  )
}
