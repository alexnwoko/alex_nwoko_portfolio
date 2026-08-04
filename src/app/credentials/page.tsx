import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import JsonLd from '@/components/JsonLd'
import Testimonial, { TestimonialRow } from '@/components/Testimonial'

/**
 * Tiny inline-link renderer for institution + note fields. Recognises
 * markdown link syntax `[text](url)` and returns a mix of plain text and
 * anchors. External URLs open in a new tab; hash anchors and internal
 * paths stay in-tab via Next.js Link.
 */
function renderInline(text: string): ReactNode[] {
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g
  const matches = Array.from(text.matchAll(pattern))
  if (matches.length === 0) return [text]
  const out: ReactNode[] = []
  let lastIndex = 0
  let key = 0
  for (const m of matches) {
    const start = m.index ?? 0
    if (start > lastIndex) {
      out.push(text.slice(lastIndex, start))
    }
    const label = m[1]
    const href = m[2]
    const isExternal = /^https?:\/\//i.test(href)
    if (isExternal) {
      out.push(
        <a
          key={key++}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-darkred underline underline-offset-2"
        >
          {label}
        </a>
      )
    } else {
      out.push(
        <Link
          key={key++}
          href={href}
          className="hover:text-darkred underline underline-offset-2"
        >
          {label}
        </Link>
      )
    }
    lastIndex = start + m[0].length
  }
  if (lastIndex < text.length) {
    out.push(text.slice(lastIndex))
  }
  return out
}

export const metadata: Metadata = {
  title: 'Credentials & Featured In, Alex Nwoko',
  description:
    'Education, memberships, certifications, and third-party features. Durham University Geography Department alumni interview (Summer 2026), iMMAP Afghanistan and Bangladesh programme references.',
  alternates: { canonical: 'https://alexnwoko.com/credentials' },
  openGraph: {
    title: 'Credentials & Featured In, Alex Nwoko',
    description:
      'Education, memberships, certifications, and third-party features including the Durham University Geography Department alumni interview, Summer 2026.',
    url: 'https://alexnwoko.com/credentials',
    type: 'profile',
    images: [
      {
        url: 'https://alexnwoko.com/featured-in/durham-alumni-summer-2026-thumb.jpg',
        width: 1190,
        height: 1683,
        alt: 'Alumni interview featuring Alex Nwoko, Durham University Geography Department Alumni Newsletter, Summer 2026, page 9.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Credentials & Featured In, Alex Nwoko',
    description:
      'Education, memberships, certifications, and third-party features including the Durham University alumni interview (Summer 2026).',
    images: ['https://alexnwoko.com/featured-in/durham-alumni-summer-2026-thumb.jpg'],
  },
}

const education = [
  {
    degree: 'MSc Information Systems Management',
    institution: 'University of Salford, Manchester',
    period: 'In progress',
    note: 'Focus on enterprise data architecture and digital transformation',
  },
  {
    degree: 'Business Analytics Certificate',
    institution: 'Harvard Business School Online',
    period: '2023',
    note: 'Statistical analysis, regression modeling, and data-driven decision-making',
  },
  {
    degree: 'MSc Risk and Environmental Hazards',
    institution: 'Durham University · [Institute of Hazard, Risk and Resilience](https://www.durham.ac.uk/research/institutes-and-centres/hazard-risk-resilience/), Durham, United Kingdom',
    period: 'Oct 2015 – Sept 2016',
    note: 'Commonwealth Scholar (2015). Majors: Disaster Risk Analysis, Vulnerability Assessment, Emergency Planning, GIS, Remote Sensing. Dissertation research on social vulnerability to extreme temperature exposure in partnership with Newcastle City Council Emergency Planning Unit. Alumni interview in the department\'s [Summer 2026 newsletter](#featured-in).',
  },
  {
    degree: 'BSc Geography and Planning',
    institution: 'Abia State University · Faculty of Environmental Studies, Abia State, Nigeria',
    period: 'Oct 2008 – Sept 2012',
    note: 'Majors: Geographic Information Systems (GIS), Remote Sensing, Environmental Risk, Land Use Planning, Health Geography. Dissertation research on urban flood risk assessment.',
  },
]

/**
 * Third-party features and profiles. Displayed in the "Featured In"
 * section for quick E-E-A-T signal to adjudicators, grant committees,
 * journalists, and AI-engine crawlers. Chronological, newest first.
 *
 * `image` (optional) — thumbnail rendered inline with the entry.
 * `imageFull` — click-through to the full-quality view.
 * `pagination` — surfaces in the JSON-LD as machine-readable metadata.
 */
type Feature = {
  publisher: string
  descriptor: string
  date: string
  dateIso: string
  page?: string
  href: string
  image?: string
  imageFull?: string
  alt?: string
  color: string
}

const featuredIn: Feature[] = [
  {
    publisher: 'Durham University Geography Department',
    descriptor: 'Alumni interview, Summer 2026 newsletter',
    date: 'Summer 2026',
    dateIso: '2026-06-01',
    page: 'p. 9',
    href: 'https://www.durham.ac.uk/media/durham-university/departments-/geography/alumni/newsletter/Alumni-newsletter-Summer-2026-new.pdf#page=9',
    image: '/featured-in/durham-alumni-summer-2026-thumb.jpg',
    imageFull: '/featured-in/durham-alumni-summer-2026-full.jpg',
    alt: 'Alumni interview featuring Alex Nwoko, Durham University Geography Department Alumni Newsletter, Summer 2026, page 9.',
    color: '#7B4B94',
  },
  {
    publisher: 'Durham University · IHRR',
    descriptor: 'Featured alumni quote, official geography careers page',
    date: 'Ongoing',
    dateIso: '2023-11-01',
    href: 'https://www.durham.ac.uk/departments/academic/geography/postgraduate-study/taught-masters-programmes/jobs-and-careers/',
    color: '#7B4B94',
  },
  {
    publisher: 'Durham University · IHRR',
    descriptor: 'Invited speaker feature, PGT Careers Event',
    date: '28 November 2023',
    dateIso: '2023-11-28',
    href: 'https://www.durham.ac.uk/research/institutes-and-centres/hazard-risk-resilience/about-us/news/postgraduate-taught-careers-event/',
    color: '#C4703F',
  },
  {
    publisher: 'iMMAP Inc.',
    descriptor: 'Featured in the Afghanistan country programme and HSDC launch coverage',
    date: '2022–2024',
    dateIso: '2023-01-01',
    href: 'https://immap.org/afghanistan/',
    color: '#009EDB',
  },
]

/**
 * FAQPage answers surfaced on the Credentials page. Emitted as visible
 * markup AND as FAQPage JSON-LD so answer engines (Google AI Overviews,
 * Perplexity, ChatGPT Search) can cite verbatim.
 */
const credentialsFaqs = [
  {
    question: 'Where has Alex Nwoko been featured?',
    answer:
      'Alex Nwoko has been featured in the Durham University Geography Department Alumni Newsletter (Summer 2026, page 9), on the Durham University Institute of Hazard, Risk and Resilience careers page as a featured alumnus, and in the Institute\'s coverage of the November 2023 PGT Careers Event. His work with iMMAP also appears in the iMMAP Afghanistan country programme materials and the HSDC platform launch coverage.',
  },
  {
    question: 'Is Alex Nwoko a Durham University alumnus?',
    answer:
      'Yes. Alex Nwoko holds an MSc in Risk and Environmental Hazards from Durham University, awarded at the Institute of Hazard, Risk and Resilience (Department of Geography), studied 2015–2016 as a Commonwealth Scholar.',
  },
  {
    question: 'What is Alex Nwoko\'s academic background?',
    answer:
      'MSc in Risk and Environmental Hazards, Durham University (Institute of Hazard, Risk and Resilience). BSc in Geography and Planning, Abia State University. Business Analytics Certificate from Harvard Business School Online. MSc in Information Systems Management (in progress) at the University of Salford, Manchester.',
  },
  {
    question: 'What professional memberships does Alex Nwoko hold?',
    answer:
      'Fellow of the Royal Geographical Society (FRGS, since 2016). Member of the American Association of Geographers (AAG, since 2015) and the Canadian Association of Geographers (CAG, since 2020).',
  },
]

const memberships = [
  { title: 'Fellow', org: 'Royal Geographical Society (FRGS)', since: '2016' },
  { title: 'Member', org: 'American Association of Geographers (AAG)', since: '2015' },
  { title: 'Member', org: 'Canadian Association of Geographers (CAG)', since: '2020' },
]

const certifications: Record<string, { certs: string[]; color: string }> = {
  'Climate, DRR & Emergency Coordination': {
    color: '#C4703F',
    certs: [
      'Anticipatory Action Simulation Exercise, RedR UK (2024)',
      'Understanding Risk, GFDRR / World Bank (2023)',
      'Disaster Displacement, NRC / Platform on Disaster Displacement / UNDRR (2024)',
      'WASH in Emergencies, DisasterReady (2023)',
      'Shelter in Emergencies, DisasterReady (2023)',
      'Cash in Emergencies, DisasterReady (2023)',
    ],
  },
  'Data Analytics, IM & Cluster Coordination': {
    color: '#009EDB',
    certs: [
      'Data Management & Analysis for Cluster Information Management, UNICEF (2022)',
      'Response Monitoring and Reporting for a Cluster, UNICEF (2022)',
      'Humanitarian Needs Assessments for Clusters, UNICEF (2022)',
      'Global Nutrition Cluster Information Management Level 2, UNICEF (2022)',
      'Global Nutrition Cluster Coordination Level 2, UNICEF (2022)',
      'Basic Training on Nutrition in Emergencies, UNICEF (2022)',
      'Health Cluster Coordination, Global Health Cluster (2020)',
      'Child Protection Information Management System (CPIMS+), UNICEF Afghanistan (2024)',
      'IPC Acute Food Insecurity, IPC Global Partners (2025)',
      'IPC Acute Malnutrition, IPC Global Partners (2025)',
    ],
  },
  'GIS, Remote Sensing & Spatial Data Science': {
    color: '#7B4B94',
    certs: [
      'Spatial Data Science: The New Frontier in Analytics, ESRI (2020)',
      'Geospatial Information Technology (GIT) in Fragile Contexts, University of Twente / ITC (2020)',
    ],
  },
  'Cash & Voucher Assistance': {
    color: '#8B3A2F',
    certs: [
      'Cash and Voucher Assistance, The Fundamentals, CaLP (2019)',
      'CVA and Social Protection: Linking Humanitarian Cash & Social Protection, CaLP (2019)',
      'Monitoring and Adapting Cash and Voucher Assistance, CaLP (2019)',
      'The Remote Cash Course, CaLP Network',
      'Introduction to Market Analysis, CaLP / IRC (2019)',
      'A Practical Guide to Market Analysis, CaLP / IRC (2019)',
      'MEB, Gap Analysis and Calculating the Transfer Value, CALP / Oxfam (2023)',
    ],
  },
  'Project Management': {
    color: '#3D2B1F',
    certs: [
      'Results-Based Project Management (Excellence Award), PM4DEV (2022)',
      'Effective Project Management (Excellence Award), PM4DEV (2022)',
    ],
  },
}

const skills = {
  'Data & Analytics': ['Python', 'R', 'SQL', 'Power BI', 'Tableau', 'Excel/VBA', 'DAX', 'SPSS'],
  'GIS & Remote Sensing': ['ArcGIS Pro', 'QGIS', 'Google Earth Engine', 'Leaflet.js', 'Mapbox GL', 'PostGIS', 'GeoPandas'],
  'Humanitarian Tools': ['KoboToolbox', 'ODK', 'DEEP', 'ReportHub', 'HDX', 'OCHA tools'],
  'Development': ['JavaScript/TypeScript', 'React', 'Next.js', 'Node.js', 'Git', 'Docker'],
  'AI/ML': ['NLP', 'Classification', 'LLM Integration', 'Agent Architectures', 'TensorFlow'],
  'Languages': ['English (Native)', 'Igbo (Native)', 'French (Basic)'],
}

/**
 * Person `subjectOf` JSON-LD graph. Emits each Featured In entry as a
 * discrete Article node linked to the Person entity in layout.tsx, so
 * search engines and answer engines (Google AI Overviews, Perplexity,
 * ChatGPT Search) can pick up the third-party features as authority
 * signals attached to the Person's knowledge graph.
 */
const CREDENTIALS_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfilePage',
      '@id': 'https://alexnwoko.com/credentials#page',
      url: 'https://alexnwoko.com/credentials',
      name: 'Credentials & Featured In, Alex Nwoko',
      mainEntity: { '@id': 'https://alexnwoko.com/#person' },
    },
    {
      '@type': 'Person',
      '@id': 'https://alexnwoko.com/#person',
      subjectOf: featuredIn.map((f, i) => ({
        '@type': 'Article',
        '@id': `https://alexnwoko.com/credentials#feature-${i}`,
        headline: `${f.publisher} — ${f.descriptor}`,
        datePublished: f.dateIso,
        url: f.href,
        ...(f.page ? { pagination: f.page } : {}),
        publisher: {
          '@type': 'Organization',
          name: f.publisher,
        },
        about: { '@id': 'https://alexnwoko.com/#person' },
        ...(f.image
          ? { image: `https://alexnwoko.com${f.image}` }
          : {}),
      })),
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://alexnwoko.com/credentials#faq',
      mainEntity: credentialsFaqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    },
  ],
}

export default function CredentialsPage() {
  return (
    <div className="pt-24 pb-16">
      <JsonLd data={CREDENTIALS_JSON_LD} />
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">Credentials</p>
        <h1 className="font-serif text-4xl md:text-5xl text-coffee mb-6 leading-tight">
          Education, Skills &amp; Affiliations
        </h1>
      </section>

      {/* Featured In */}
      <section id="featured-in" className="max-w-4xl mx-auto px-6 mb-20 scroll-mt-24">
        <h2 className="font-serif text-2xl text-coffee mb-8">Featured In</h2>
        <div className="space-y-6">
          {featuredIn.map((f, i) => (
            <a
              key={i}
              href={f.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-2xl p-6 border border-beige-300 hover:border-dusty-orange/60 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-5">
                {f.image ? (
                  <div className="shrink-0 w-24 sm:w-32 rounded-lg overflow-hidden border border-beige-300 bg-beige-100">
                    <Image
                      src={f.image}
                      alt={f.alt ?? `${f.publisher} — ${f.descriptor}`}
                      width={180}
                      height={255}
                      className="w-full h-auto"
                    />
                  </div>
                ) : (
                  <div className="shrink-0 w-2 h-2 mt-2 rounded-full" style={{ backgroundColor: f.color }} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <h3 className="font-serif text-lg text-coffee">{f.publisher}</h3>
                    <span className="text-xs text-coffee-muted bg-beige-200 px-3 py-1 rounded-full">
                      {f.date}
                      {f.page ? ` · ${f.page}` : ''}
                    </span>
                  </div>
                  <p className="text-sm text-coffee-light mb-1">{f.descriptor}</p>
                  <p className="text-xs text-dusty-orange">Read the original ↗</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <h2 className="font-serif text-2xl text-coffee mb-8">Education</h2>
        <div className="space-y-6">
          {education.map((edu, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-beige-300">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <h3 className="font-serif text-lg text-coffee">{edu.degree}</h3>
                <span className="text-xs text-coffee-muted bg-beige-200 px-3 py-1 rounded-full">{edu.period}</span>
              </div>
              <p className="text-sm text-dusty-orange font-medium mb-2">{renderInline(edu.institution)}</p>
              <p className="text-sm text-coffee-muted">{renderInline(edu.note)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Professional Memberships */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <h2 className="font-serif text-2xl text-coffee mb-8">Professional Memberships</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {memberships.map((m, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-beige-300 text-center">
              <p className="text-xs text-dusty-orange uppercase tracking-wider font-semibold mb-1">{m.title}</p>
              <h3 className="font-serif text-base text-coffee mb-1">{m.org}</h3>
              <p className="text-xs text-coffee-muted">Since {m.since}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <h2 className="font-serif text-2xl text-coffee mb-8">Professional Certifications</h2>
        <div className="space-y-8">
          {Object.entries(certifications).map(([category, { certs, color }]) => (
            <div key={category}>
              <h3 className="text-xs uppercase tracking-wider font-semibold mb-4" style={{ color }}>
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {certs.map((cert) => (
                  <div key={cert} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-beige-300">
                    <span className="mt-0.5" style={{ color }}>&#10003;</span>
                    <span className="text-sm text-coffee-light">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <Testimonial
        quote="His performance consistently demonstrated extraordinary technical ability, leadership, and innovation in support of data-driven cash programming. Alex's work reflects not just technical skill but strategic impact at the highest level."
        name="Samson Muradzikwa"
        title="Regional Social Policy Advisor (MENA)"
        org="UNICEF"
        pillarColor="#009EDB"
      />

      {/* More Testimonials */}
      <section className="mb-16">
        <TestimonialRow
          testimonials={[
            {
              quote: 'He proved to be an invaluable member of the team. He can deliver under tight deadlines and possesses a strong work ethic. I very much believe that Mr. Alex Nwoko will be an asset for any team.',
              name: 'Rafaelle Robelin',
              title: 'Shelter/NFI & CCCM Sector Coordinator',
              org: 'IOM Nigeria',
              pillarColor: '#7B4B94',
            },
            {
              quote: 'Alex is a hard working and reliable team member, he often goes above and beyond his ToR to meet mission requirements. He is a team player and pleasant to work with.',
              name: 'Lauren Pearson',
              title: 'Programme Manager',
              org: 'IOM Bangladesh',
              pillarColor: '#8B3A2F',
            },
            {
              quote: 'He has demonstrated the capacities required to take on international IM assignments. Alex has significant technical experience and related contribution to the improvement of IM tools.',
              name: 'Michelle Hsu',
              title: 'Food Security Sector Coordinator',
              org: 'FAO Nigeria',
              pillarColor: '#C4703F',
            },
          ]}
        />
      </section>

      {/* Technical Skills */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <h2 className="font-serif text-2xl text-coffee mb-8">Technical Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className="bg-white rounded-2xl p-6 border border-beige-300">
              <h3 className="text-xs uppercase tracking-wider text-dusty-orange font-semibold mb-4">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span key={skill} className="text-xs px-3 py-1.5 rounded-full border border-beige-300 text-coffee-muted">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked — mirrors FAQPage JSON-LD above for answer-engine surfacing */}
      <section className="max-w-4xl mx-auto px-6">
        <h2 className="font-serif text-2xl text-coffee mb-8">Frequently Asked</h2>
        <div className="space-y-4">
          {credentialsFaqs.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-beige-300">
              <h3 className="font-serif text-base text-coffee mb-2">{f.question}</h3>
              <p className="text-sm text-coffee-muted leading-relaxed">{f.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
