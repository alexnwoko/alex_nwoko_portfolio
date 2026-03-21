import type { Metadata } from 'next'
import Link from 'next/link'
import Testimonial, { TestimonialRow } from '@/components/Testimonial'

export const metadata: Metadata = {
  title: 'About — Alex Nwoko',
  description: 'A decade of building humanitarian data, geospatial, climate, and cash programming systems across six countries.',
}

const timeline = [
  {
    year: '2016–2018',
    role: 'Information Manager — Shelter/NFI & CCCM Clusters',
    org: 'IOM Nigeria',
    location: 'Maiduguri, Nigeria',
    desc: 'Built the cluster IM system from scratch — dashboards, factsheets, gap analysis — while developing data-driven flood contingency plans, GIS vulnerability mapping, and risk analysis products for one of Africa\'s largest humanitarian operations during the Boko Haram crisis.',
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
    desc: 'Designed the Cash-Based Intervention IM System (CBIIMS), supervised the GIS unit, and coordinated communication-with-communities data across 29 camps and 1,100+ radio listening groups in the world\'s largest refugee response.',
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
    year: '2020–2022',
    role: 'IM Specialist — Agriculture Cluster / Planning & Monitoring',
    org: 'FAO & UNICEF Ethiopia',
    location: 'Addis Ababa, Ethiopia',
    desc: 'Developed the UNICEF Ethiopia IM Strategy, deployed geospatial tools for drought response mapping and community vulnerability assessment, and led the Ethiopia Cash Working Group\'s first inter-agency PDM meta-analysis and financial services provider assessments across Tigray.',
    pillar: 'cash',
  },
  {
    year: '2022–2025',
    role: 'Program Coordinator & Technical Advisor',
    org: 'iMMAP Afghanistan',
    location: 'Kabul, Afghanistan',
    desc: 'Led a $9.7M USAID-funded program spanning all four pillars: ReportHub for multi-cluster reporting (200+ orgs), HSDC for multi-hazard geospatial analysis, climate early warning and drought monitoring platforms, anticipatory action frameworks, and Cash & Voucher Working Group IM support.',
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
          A decade of building the systems behind humanitarian response
        </h1>
        <div className="prose prose-lg max-w-none text-coffee-light/80 leading-relaxed space-y-6">
          <p>
            There&rsquo;s a particular kind of urgency that drives you when you&rsquo;ve seen what happens when decisions are made without evidence. Early in my career, I watched communities suffer not because help wasn&rsquo;t available, but because the information to direct that help simply didn&rsquo;t exist — or existed in fragments scattered across spreadsheets that no one could piece together in time. I watched flood waters rise in displacement camps where no one had mapped the risk zones. I watched cash transfers reach the wrong households because targeting data lived in disconnected silos. I watched satellite imagery that could have predicted a drought sit unused while responders planned with outdated reports.
          </p>
          <p>
            That experience planted a question I&rsquo;ve been trying to answer ever since: <em>What does it take to put the right information in front of the right people before a crisis becomes a catastrophe?</em>
          </p>
          <p>
            That question took me to Durham University on a Commonwealth Scholarship, where I studied risk and environmental hazards at the Institute of Hazard, Risk and Resilience. My research on social vulnerability indices wasn&rsquo;t just academic — it was built in partnership with the Newcastle City Council Emergency Planning Unit, mapping physical and social vulnerability indicators for proactive emergency preparedness. That experience taught me something that has shaped every role since: <strong>the most sophisticated analysis in the world is worthless if it doesn&rsquo;t reach the people who need it, in a format they can act on.</strong>
          </p>
          <p>
            From Durham, I carried that conviction into Maiduguri — the epicenter of the Boko Haram crisis and one of the largest humanitarian operations in Africa. As Information Manager for the Shelter/NFI and CCCM Clusters with IOM, I built the cluster&rsquo;s information management system from scratch — but I also saw that data dashboards alone weren&rsquo;t enough. Displacement camps flooded every rainy season, and no one had the spatial risk analysis to anticipate it. So I built data-driven flood contingency plans and GIS vulnerability maps that changed how clusters prepared for seasonal hazards. That was the beginning of what I now think of as humanitarian systems architecture — where data analytics, geospatial analysis, and disaster risk reduction have to work together.
          </p>
          <p>
            In Cox&rsquo;s Bazar, the world&rsquo;s largest refugee operation, I saw the same fragmentation in a different form. Cash-based interventions were growing rapidly, but the information systems behind them couldn&rsquo;t keep pace — beneficiary targeting was disconnected from payment processing, and post-distribution monitoring was an afterthought. I designed the Cash-Based Intervention Information Management System (CBIIMS) for IOM — a five-stage workflow from beneficiary profiling through payment automation — while supervising the GIS unit producing maps for 29 camps and coordinating communication-with-communities data across 1,100+ radio listening groups. It was here I understood that geospatial tools, cash transfer systems, and humanitarian reporting aren&rsquo;t separate disciplines — they&rsquo;re parts of one integrated challenge.
          </p>
          <p>
            In Ethiopia, those threads deepened further. I developed the UNICEF Information Management Strategy, deployed geospatial tools mapping drought response coverage and community vulnerabilities across conflict-affected regions, and served as data consultant for the Ethiopia Cash Working Group — leading the first-ever inter-agency post-distribution monitoring meta-analysis, designing financial services provider assessments across Tigray, and building the operational dashboards that tracked $3.2M in CERF-funded cash allocations reaching 185,000 beneficiaries.
          </p>
          <p>
            Afghanistan became the culmination of all four pillars. Leading a $9.7M USAID-funded program, I oversaw the deployment of ReportHub for multi-cluster humanitarian reporting across 200+ organizations, the Humanitarian Spatial Data Center for multi-hazard geospatial analysis integrating earthquake, flood, and drought data, climate early warning platforms powered by NDVI, precipitation forecasting, and drought monitoring, anticipatory action frameworks linking climate triggers to pre-agreed response protocols, and Cash &amp; Voucher Working Group analytics — all while navigating one of the world&rsquo;s most complex operating environments under Taliban governance.
          </p>
          <p>
            I&rsquo;m not done building. The humanitarian sector is at an inflection point where AI, geospatial intelligence, climate science, and real-time data can fundamentally change how we prepare for and respond to crises — if we build the right systems and put them in the right hands. That&rsquo;s what I do.
          </p>
        </div>
      </section>

      {/* Testimonial — iMMAP HQ */}
      <Testimonial
        quote="His ethical, risk-informed, and forward-thinking approach makes him an invaluable leader in humanitarian geospatial information technologies and emergency response coordination."
        name="Abdon Trowonou"
        title="Operations Director"
        org="iMMAP Inc. Headquarters"
        pillarColor="#C4703F"
        variant="accent"
      />

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

      {/* Testimonials from supervisors */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto px-6 mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">What Supervisors Say</p>
        </div>
        <TestimonialRow
          testimonials={[
            {
              quote: 'Alex has exceeded expectations as far as CBI is concerned. He has worked tirelessly to ensure a functioning system and trained and supported field staff and finance staff on systems strengthening.',
              name: 'Lauren Pearson',
              title: 'Programme Manager',
              org: 'IOM Bangladesh',
              pillarColor: '#8B3A2F',
            },
            {
              quote: 'His performance consistently demonstrated extraordinary technical ability, leadership, and innovation in support of data-driven cash programming. Alex\'s work reflects not just technical skill but strategic impact at the highest level.',
              name: 'Samson Muradzikwa',
              title: 'Regional Social Policy Advisor (MENA)',
              org: 'UNICEF',
              pillarColor: '#009EDB',
            },
            {
              quote: 'He has demonstrated the capacities required to take on international IM assignments. Alex has significant technical experience and related contribution to the improvement of IM tools and data collection.',
              name: 'Michelle Hsu',
              title: 'Food Security Sector Coordinator',
              org: 'FAO Nigeria',
              pillarColor: '#C4703F',
            },
          ]}
        />
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
