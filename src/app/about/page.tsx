import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — Alex Nwoko',
  description: 'A decade of building humanitarian data systems across six countries.',
}

const timeline = [
  {
    year: '2016–2017',
    role: 'Information Manager — Shelter/NFI & CCCM Clusters',
    org: 'IOM Nigeria',
    location: 'Maiduguri, Nigeria',
    desc: 'Built the cluster information management system from scratch — dashboards, factsheets, gap analysis mappings — for one of Africa\'s largest humanitarian operations during the Boko Haram crisis.',
    pillar: 'data',
  },
  {
    year: '2018',
    role: 'Information Management Officer — Food Security Sector',
    org: 'FAO Nigeria',
    location: 'Maiduguri, Nigeria',
    desc: 'Managed sector-wide reporting and partner coordination data for the food security response in northeast Nigeria, supporting gap analysis and response monitoring.',
    pillar: 'data',
  },
  {
    year: '2019',
    role: 'IM & CBI Data Officer',
    org: 'IOM Bangladesh',
    location: "Cox's Bazar, Bangladesh",
    desc: 'Coordinated cross-sectoral data collection and managed information systems for cash-based interventions in the world\'s largest refugee response operation.',
    pillar: 'cash',
  },
  {
    year: '2020',
    role: 'Project Lead — COVID-19 Situation Analysis',
    org: 'iMMAP Bangladesh',
    location: 'Dhaka, Bangladesh',
    desc: 'Led a team producing seven comprehensive analysis reports tracking the pandemic\'s cascading impacts using DEEP — an AI-enabled secondary data analysis platform.',
    pillar: 'data',
  },
  {
    year: '2020',
    role: 'Crisis Information Analyst',
    org: 'IOM Headquarters',
    location: 'Geneva, Switzerland',
    desc: 'Designed knowledge management systems and crisis monitoring platforms at the global institutional level.',
    pillar: 'data',
  },
  {
    year: '2021',
    role: 'IM Officer — Agriculture Cluster / Planning & Monitoring',
    org: 'FAO & UNICEF Ethiopia',
    location: 'Addis Ababa, Ethiopia',
    desc: 'Developed the UNICEF Ethiopia Information Management Strategy. Served as data consultant for UNICEF\'s humanitarian cash transfer program and the Ethiopia Cash Working Group.',
    pillar: 'cash',
  },
  {
    year: '2022–2025',
    role: 'Program Coordinator & Technical Advisor',
    org: 'iMMAP Afghanistan',
    location: 'Kabul, Afghanistan',
    desc: 'Managed a $9.7M USAID-funded program delivering data analytics, geospatial platforms (ReportHub, HSDC), and IM support for 75+ humanitarian organizations.',
    pillar: 'climate',
  },
]

const pillarColors: Record<string, string> = {
  data: '#009EDB',
  gis: '#7B4B94',
  climate: '#C4703F',
  cash: '#8B3A2F',
}

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">About</p>
        <h1 className="font-serif text-4xl md:text-5xl text-coffee mb-8 leading-tight">
          A decade of building the data systems behind humanitarian response
        </h1>
        <div className="prose prose-lg max-w-none text-coffee-light/80 leading-relaxed space-y-6">
          <p>
            There&rsquo;s a particular kind of urgency that drives you when you&rsquo;ve seen what happens when decisions are made without evidence. Early in my career, I watched communities suffer not because help wasn&rsquo;t available, but because the information to direct that help simply didn&rsquo;t exist — or existed in fragments scattered across spreadsheets that no one could piece together in time.
          </p>
          <p>
            That experience planted a question I&rsquo;ve been trying to answer ever since: <em>What does it take to put the right information in front of the right people before a crisis becomes a catastrophe?</em>
          </p>
          <p>
            That question took me to Durham University on a Commonwealth Scholarship, where I studied risk and environmental hazards at the Institute of Hazard, Risk and Resilience. My research on social vulnerability indices wasn&rsquo;t just academic — it was built in partnership with the Newcastle City Council Emergency Planning Unit, creating tools they could actually use. That experience taught me something that has shaped every role since: <strong>the most sophisticated analysis in the world is worthless if it doesn&rsquo;t reach the people who need it, in a format they can act on.</strong>
          </p>
          <p>
            From Durham, I found my way to Maiduguri — the epicenter of the Boko Haram crisis and one of the largest humanitarian operations in Africa. As the Information Manager for the Shelter/NFI and CCCM Clusters with IOM, I built the cluster&rsquo;s information management system from scratch. That was the beginning of what I now think of as humanitarian systems architecture.
          </p>
          <p>
            The journey since has taken me across six countries, through some of the world&rsquo;s most complex emergencies — from Cox&rsquo;s Bazar to Geneva to Addis Ababa to Kabul — each role pushing the boundaries of what information management can achieve in crisis contexts.
          </p>
          <p>
            I&rsquo;m not done building. The humanitarian sector is at an inflection point where AI, geospatial intelligence, and real-time data can fundamentally change how we respond to crises — if we build the right systems and put them in the right hands. That&rsquo;s what I do.
          </p>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-un-blue py-14 mb-20">
        <blockquote className="max-w-3xl mx-auto px-6 text-center font-serif text-2xl md:text-3xl text-white leading-relaxed">
          &ldquo;The biggest risk in any crisis is not the hazard itself — it&rsquo;s making decisions without evidence. Every system I build is designed to close that gap.&rdquo;
        </blockquote>
      </section>

      {/* Career Timeline */}
      <section className="max-w-4xl mx-auto px-6 mb-20">
        <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">Career</p>
        <h2 className="font-serif text-3xl md:text-4xl text-coffee mb-12">The Timeline</h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-beige-300 -translate-x-1/2" />

          {timeline.map((entry, i) => (
            <div
              key={i}
              className={`relative flex flex-col md:flex-row items-start gap-6 mb-12 ${
                i % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Dot */}
              <div
                className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 border-2 border-white z-10"
                style={{ backgroundColor: pillarColors[entry.pillar] || '#C4703F' }}
              />

              {/* Content */}
              <div className={`ml-8 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:text-right md:pr-8' : 'md:pl-8'}`}>
                <span className="text-xs font-semibold text-coffee-muted uppercase tracking-wider">{entry.year}</span>
                <h3 className="font-serif text-lg text-coffee mt-1">{entry.role}</h3>
                <p className="text-sm text-dusty-orange font-medium">{entry.org} — {entry.location}</p>
                <p className="text-sm text-coffee-muted mt-2 leading-relaxed">{entry.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-dusty-orange to-darkred text-white rounded-lg font-medium text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
        >
          Get in Touch
        </Link>
      </section>
    </div>
  )
}
