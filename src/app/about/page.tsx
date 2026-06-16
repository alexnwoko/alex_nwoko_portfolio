import type { Metadata } from 'next'
import Image from 'next/image'
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
    desc: 'Led a team producing seven comprehensive analysis reports tracking the pandemic\'s cascading impacts, deploying the DEEP platform for AI-enabled secondary data classification and analysis.',
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
      {/* Meet Alex Nwoko — intro card paired with long-form narrative */}
      <section className="max-w-6xl mx-auto px-6 mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">Meet Alex Nwoko</p>
        <h1 className="font-serif text-4xl md:text-5xl text-coffee leading-tight">
          A decade of building the systems behind disaster risk &amp; humanitarian response
        </h1>
      </section>

      <section className="max-w-6xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Left — dark profile card */}
          <aside className="md:col-span-5">
            <div className="bg-coffee text-white rounded-3xl p-8 text-center md:sticky md:top-28">
              {/* Portrait — professional headshot (white shirt) */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto mb-6 rounded-full ring-4 ring-white/15 overflow-hidden">
                <Image
                  src="/images/alex-nwoko-headshot.jpg"
                  alt="Alex Nwoko — Disaster Risk and Humanitarian Data Systems Architect"
                  fill
                  sizes="(max-width: 640px) 144px, 176px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Name + role */}
              <h2 className="font-serif text-2xl text-white mb-2">Alex Nwoko</h2>
              <p className="text-sm text-dusty-orange font-semibold mb-6">
                Disaster Risk &amp; Humanitarian Data Systems Architect
              </p>

              {/* Micro bio */}
              <p className="text-sm text-beige-200 leading-relaxed mb-6">
                A decade designing the data platforms, geospatial intelligence, climate risk tools, and cash programming frameworks that UN agencies, national governments, and humanitarian partners depend on across six countries.
              </p>

              {/* Skill chips */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {[
                  'Disaster Risk',
                  'Geospatial Intelligence',
                  'Information Management',
                  'Data & Evidence Generation',
                  'Climate Analytics',
                  'Cash Programming',
                  'Emergency Coordination',
                  'Project Management',
                ].map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] px-3 py-1 rounded-full bg-white/10 text-white border border-white/15"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-2 pt-5 border-t border-white/10">
                <Link href="/founder-journey" className="text-sm text-dusty-orange hover:text-white transition-colors">
                  Founder Journey &rarr;
                </Link>
                <Link href="/credentials" className="text-sm text-dusty-orange hover:text-white transition-colors">
                  Credentials &rarr;
                </Link>
                <Link href="/contact" className="text-sm text-dusty-orange hover:text-white transition-colors">
                  Get in touch &rarr;
                </Link>
              </div>
            </div>
          </aside>

          {/* Right — long-form narrative */}
          <div className="md:col-span-7">
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
                Afghanistan became the culmination of all four pillars. Leading a $9.7M USAID-funded program, I led and managed the development and deployment of ReportHub for multi-cluster humanitarian reporting across 200+ organizations, the Humanitarian Spatial Data Center (HSDC) for multi-hazard geospatial analysis integrating earthquake, flood, and drought data, while developing data, evidence generation, and information management strategies for UN agencies and interagency coordination groups — including climate early warning platforms, anticipatory action frameworks, and Cash &amp; Voucher Working Group analytics — all while navigating one of the world&rsquo;s most complex operating environments under Taliban governance.
              </p>
              <p>
                I&rsquo;m not done building. The humanitarian sector is at an inflection point where AI, geospatial intelligence, climate science, and real-time data can fundamentally change how we prepare for and respond to crises — if we build the right systems and put them in the right hands. That&rsquo;s what I do.
              </p>
            </div>
          </div>
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
              quote: 'His performance consistently demonstrated extraordinary technical ability, leadership, and innovation in support of data-driven cash programming.',
              name: 'Samson Muradzikwa',
              title: 'Regional Social Policy Advisor (MENA)',
              org: 'UNICEF',
              pillarColor: '#009EDB',
            },
            {
              quote: 'He proved to be an invaluable member of the team. Mr. Nwoko is able to work with a high degree of independence and in multicultural environment. He is conscientious and results-oriented.',
              name: 'Rafaelle Robelin',
              title: 'Shelter/NFI & CCCM Sector Coordinator',
              org: 'IOM Nigeria',
              pillarColor: '#7B4B94',
            },
          ]}
        />
      </section>

      {/* iMMAP Leadership Testimonial */}
      <Testimonial
        quote="Alex is an invaluable asset to iMMAP Inc., not only in Afghanistan but on a global scale. His exceptional leadership, dedication, and problem-solving skills have consistently contributed to the success of the organization's mission. Given his capabilities and experience, Alex is well-prepared to take on the role of Country Representative in any iMMAP mission worldwide."
        name="Belo Mohammed"
        title="Country Representative, Afghanistan"
        org="iMMAP Inc."
        pillarColor="#009EDB"
        variant="accent"
      />

      {/* More testimonials */}
      <section className="mb-16">
        <TestimonialRow
          testimonials={[
            {
              quote: 'He has demonstrated the capacities required to take on international IM assignments. Alex has significant technical experience and related contribution to the improvement of IM tools and data collection.',
              name: 'Michelle Hsu',
              title: 'Food Security Sector Coordinator',
              org: 'FAO Nigeria',
              pillarColor: '#C4703F',
            },
            {
              quote: 'Alex is and has been a great value to the Afghanistan team and program. His commitment and dedication to the program have brought the program as a whole to the next level.',
              name: 'Coen Gorter',
              title: 'Country Representative, Afghanistan',
              org: 'iMMAP Inc.',
              pillarColor: '#009EDB',
            },
            {
              quote: 'Alex successfully supervised a team of professionals in developing accurate information management and GIS products, natural risk hazard analysis and multi-vulnerabilities maps.',
              name: 'Rafaelle Robelin',
              title: 'Shelter/NFI & CCCM Sector Coordinator',
              org: 'IOM Nigeria',
              pillarColor: '#7B4B94',
            },
          ]}
        />
      </section>

      {/* Even more testimonials */}
      <section className="mb-16">
        <TestimonialRow
          testimonials={[
            {
              quote: 'Alex consistently goes above and beyond the responsibilities outlined in his TORs. Quality of work is always beyond expectation.',
              name: 'Belo Mohammed',
              title: 'Country Representative, Afghanistan',
              org: 'iMMAP Inc.',
              pillarColor: '#009EDB',
            },
            {
              quote: 'Alex is a hard working and reliable team member, he often goes above and beyond his ToR to meet mission requirements. He is a team player and pleasant to work with.',
              name: 'Lauren Pearson',
              title: 'Programme Manager',
              org: 'IOM Bangladesh',
              pillarColor: '#8B3A2F',
            },
            {
              quote: 'Alex possesses natural leadership capabilities. I recommend iMMAP to engage with Alex in a development path towards a senior leadership role.',
              name: 'Coen Gorter',
              title: 'Country Representative, Afghanistan',
              org: 'iMMAP Inc.',
              pillarColor: '#009EDB',
            },
          ]}
        />
      </section>

      {/* Leslie Parker Odongkara Testimonial */}
      <Testimonial
        quote="Alex consistently operates at the intersection of data, digital innovation and humanitarian emergency operational impact. His work reflects not just technical mastery, but innovation with strategic foresight. His ability to connect applied analytics with broader questions of equity, vulnerability, and governance sets him apart."
        name="Leslie Parker Odongkara"
        title="Coordinator, Food Security & Agriculture Cluster"
        org="FAO Afghanistan"
        pillarColor="#009EDB"
        variant="accent"
      />

      {/* ═══ THOUGHT LEADERSHIP — Full-width authority section ═══ */}
      <section className="bg-coffee text-white py-20 mb-20">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-dusty-orange font-semibold mb-3">Thought Leadership</p>
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">Shaping the Practice of Humanitarian Data Systems</h2>
          <p className="text-beige-400 max-w-3xl mb-12 leading-relaxed">
            Beyond building systems, I contribute to the global discourse on how data, geospatial intelligence, and disaster risk science should be integrated into humanitarian decision-making — through academic presentations, university speaking engagements, and published analytical work used by UN agencies and humanitarian coordination bodies.
          </p>

          {/* Authority Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { value: '7+', label: 'Published Reports on ReliefWeb' },
              { value: '200+', label: 'Organizations Using My Systems' },
              { value: '3', label: 'Live Platforms Operational' },
              { value: '2', label: 'University Speaking Engagements' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-serif text-3xl md:text-4xl text-dusty-orange mb-1">{stat.value}</div>
                <div className="text-xs text-beige-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Featured Presentation */}
          <div className="rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/10 mb-10">
            <div className="aspect-video">
              <iframe
                src="https://www.youtube.com/embed/OUV3tvQB5ZM"
                title="Information Management in Humanitarian Response Sector — Alex Nwoko"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-6">
              <span className="text-[10px] uppercase tracking-widest text-dusty-orange font-semibold mb-2 block">Featured Presentation</span>
              <h3 className="font-serif text-xl text-white mb-2">Information Management in Humanitarian Response Sector</h3>
              <p className="text-sm text-beige-400 leading-relaxed">
                Academic presentation on how information management systems underpin effective humanitarian coordination — from data architecture and interoperability to evidence-driven decision-making in complex emergencies.
              </p>
            </div>
          </div>

          {/* Speaking Engagements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Durham Invited Speaker */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#C4703F]" />
                <span className="text-[10px] uppercase tracking-widest text-[#C4703F] font-semibold">Invited Speaker</span>
              </div>
              <h3 className="font-serif text-lg text-white mb-1">Durham University PGT Careers Event</h3>
              <p className="text-sm text-beige-400 mb-1">Institute of Hazard, Risk and Resilience (IHRR)</p>
              <p className="text-xs text-beige-400/60 mb-4">28 November 2023 &middot; Durham, UK</p>
              <p className="text-sm text-beige-400 leading-relaxed mb-4">
                Invited by the Department of Geography and IHRR to present on making a difference through humanitarian career pathways. Presented to postgraduate students from three Risk Masters programmes alongside professionals from IBM, AECOM, Marsh, and UK Health Security Agency.
              </p>
              <div className="flex flex-wrap gap-2">
                <a href="https://www.durham.ac.uk/research/institutes-and-centres/hazard-risk-resilience/about-us/news/postgraduate-taught-careers-event/" target="_blank" rel="noopener noreferrer" className="text-[11px] px-3 py-1.5 rounded-full border border-[#C4703F]/40 text-[#C4703F] hover:bg-[#C4703F]/10 transition-colors">
                  Durham University Article
                </a>
                <a href="/evidence/durham-pgt-careers-event-programme-2023.pdf" target="_blank" rel="noopener noreferrer" className="text-[11px] px-3 py-1.5 rounded-full border border-[#C4703F]/40 text-[#C4703F] hover:bg-[#C4703F]/10 transition-colors">
                  Event Programme (PDF)
                </a>
              </div>
            </div>

            {/* Durham Featured Alumni */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#7B4B94]" />
                <span className="text-[10px] uppercase tracking-widest text-[#7B4B94] font-semibold">Featured Alumni</span>
              </div>
              <h3 className="font-serif text-lg text-white mb-1">Durham University IHRR Careers Page</h3>
              <p className="text-sm text-beige-400 mb-1">Institute of Hazard, Risk and Resilience</p>
              <p className="text-xs text-beige-400/60 mb-4">Official university website</p>
              <blockquote className="text-sm text-white/90 italic leading-relaxed mb-4 border-l-2 border-[#7B4B94]/50 pl-4">
                &ldquo;Everything in the humanitarian space is driven by evidence. It all rests on understanding risk and vulnerability: this is where you can flourish.&rdquo;
              </blockquote>
              <p className="text-xs text-beige-400/70 mb-4">Quoted as a featured graduate on the university&rsquo;s official careers and employability page.</p>
              <a href="https://www.durham.ac.uk/departments/academic/geography/postgraduate-study/taught-masters-programmes/jobs-and-careers/" target="_blank" rel="noopener noreferrer" className="text-[11px] px-3 py-1.5 rounded-full border border-[#7B4B94]/40 text-[#7B4B94] hover:bg-[#7B4B94]/10 transition-colors">
                View on Durham University
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PUBLISHED WORK — Evidence of impact ═══ */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">Published Work</p>
        <h2 className="font-serif text-3xl md:text-4xl text-coffee mb-4">Reports, Dashboards &amp; Platforms</h2>
        <p className="text-coffee-muted max-w-3xl mb-8">
          Analytical products published through UN coordination platforms, used by humanitarian country teams and donor agencies for strategic planning and resource allocation.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'COVID-19 Situation Analysis Series', sub: '7 analytical reports — ReliefWeb', url: 'https://reliefweb.int/report/bangladesh/bangladesh-immapdfs-covid-19-situation-analysis-01-december-31-december-2020', type: 'link', color: '#009EDB' },
            { label: 'Afghanistan Multi-Sectoral Dashboard', sub: 'HRP response monitoring — ReliefWeb', url: 'https://reliefweb.int/report/afghanistan/afghanistan-multi-sectoral-dashboard-humanitarian-response-services-december-2024', type: 'link', color: '#009EDB' },
            { label: 'HSDC Platform', sub: 'Live geospatial intelligence platform', url: 'https://hsdc.immap.org/', type: 'link', color: '#7B4B94' },
            { label: 'Climate Outlook Mapping Methodologies', sub: 'iMMAP-OCHA methodology document', url: '/evidence/immap-ocha-climate-outlook-methodologies.pdf', type: 'pdf', color: '#C4703F' },
            { label: 'Risk Landscape: Hazards & Exposure', sub: 'Afghanistan population exposure analysis', url: '/evidence/afg-risk-landscape-hazards-exposure-2024.pdf', type: 'pdf', color: '#C4703F' },
            { label: 'DRR & Climate Work Samples', sub: 'Climate analytics portfolio', url: '/evidence/drr-climate-work-samples.pdf', type: 'pdf', color: '#C4703F' },
          ].map((item) => (
            <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 p-4 rounded-xl border border-beige-300 bg-white hover:shadow-md hover:-translate-y-1 transition-all group">
              <span className="mt-1 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold" style={{ backgroundColor: item.color }}>
                {item.type === 'pdf' ? 'PDF' : 'URL'}
              </span>
              <div>
                <span className="text-sm text-coffee font-semibold group-hover:text-dusty-orange transition-colors leading-tight block">{item.label}</span>
                <span className="text-xs text-coffee-muted mt-1 block">{item.sub}</span>
              </div>
            </a>
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
