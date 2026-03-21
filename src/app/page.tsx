'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Testimonial, { TestimonialRow } from '@/components/Testimonial'

/* ───────── Data ───────── */
const pillars = [
  {
    id: 'data',
    title: 'Data Analytics & Information Management',
    color: '#009EDB',
    icon: '📊',
    desc: 'Designing reporting platforms, analytical frameworks, and data pipelines that transform raw humanitarian data into actionable intelligence for decision-makers.',
    href: '/expertise#data-analytics',
  },
  {
    id: 'gis',
    title: 'GIS & Remote Sensing',
    color: '#7B4B94',
    icon: '🗺️',
    desc: 'Building geospatial analysis tools and multi-hazard platforms that map risk, track displacement, and guide resource allocation across complex emergencies.',
    href: '/expertise#gis',
  },
  {
    id: 'climate',
    title: 'Climate Analytics & DRR',
    color: '#C4703F',
    icon: '🌍',
    desc: 'Developing early warning systems, climate trigger thresholds, and anticipatory action frameworks that shift humanitarian response from reactive to predictive.',
    href: '/expertise#climate',
  },
  {
    id: 'cash',
    title: 'Humanitarian Cash Programming',
    color: '#8B3A2F',
    icon: '💰',
    desc: 'Creating post-distribution monitoring frameworks, cash delivery dashboards, and inter-agency impact assessments that ensure cash reaches the most vulnerable.',
    href: '/expertise#cash',
  },
]

const stats = [
  { value: 200, suffix: '+', label: 'Organizations Supported' },
  { value: 6, suffix: '', label: 'Countries of Operation' },
  { value: 9.7, suffix: 'M', prefix: '$', label: 'Program Budget Managed' },
  { value: 10, suffix: '+', label: 'Years of Experience' },
]

const featuredProjects = [
  {
    title: 'ReportHub',
    pillar: 'data',
    pillarColor: '#009EDB',
    desc: 'Multi-cluster humanitarian reporting platform supporting 200+ organizations across Afghanistan for inter-agency response monitoring and HRP tracking.',
    tags: ['Platform Design', 'Data Architecture', 'Partner Coordination'],
  },
  {
    title: 'HSDC — Humanitarian Spatial Data Center',
    pillar: 'gis',
    pillarColor: '#7B4B94',
    desc: 'Multi-hazard geospatial analysis and forecasting system integrating earthquake, flood, drought, and conflict data for Afghanistan.',
    tags: ['GeoAI', 'Remote Sensing', 'Risk Analysis'],
  },
  {
    title: 'PDM Meta-Analysis Framework',
    pillar: 'cash',
    pillarColor: '#8B3A2F',
    desc: 'First-ever inter-agency cash impact assessment unifying 1,559 household surveys from five organizations in Ethiopia.',
    tags: ['Cash Programming', 'Power BI', 'Python'],
  },
]

/* ───────── Counter Hook ───────── */
function useCounter(target: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (!startOnView || !ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()
          const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(eased * target)
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration, startOnView])

  return { count, ref }
}

/* ───────── Fade-in Hook ───────── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

/* ───────── Stat Card ───────── */
function StatCard({ stat }: { stat: typeof stats[0] }) {
  const { count, ref } = useCounter(stat.value)
  const display = stat.value % 1 !== 0 ? count.toFixed(1) : Math.round(count).toString()

  return (
    <div ref={ref} className="text-center p-6">
      <div className="font-serif text-4xl md:text-5xl text-coffee mb-2">
        {stat.prefix || ''}{display}{stat.suffix}
      </div>
      <div className="text-sm text-coffee-muted uppercase tracking-wider">{stat.label}</div>
    </div>
  )
}

/* ───────── Home Page ───────── */
export default function Home() {
  const aboutFade = useFadeIn()
  const pillarsFade = useFadeIn()

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #3D2B1F 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />

        <div className="relative max-w-4xl mx-auto px-6 text-center pt-20">
          <div className="flex items-center justify-center gap-2 mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-700 font-medium">Open to Opportunities</span>
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-dusty-orange font-semibold mb-6 animate-fade-in-up">
            Data Analytics &middot; GIS &amp; Remote Sensing &middot; Climate &amp; DRR &middot; Cash Programming
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-coffee leading-[1.1] mb-8 animate-fade-in-up delay-100">
            Building the systems behind{' '}
            <span className="gradient-text">crisis response</span>
          </h1>
          <p className="text-lg md:text-xl text-coffee-light/80 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-200">
            I design data platforms, geospatial intelligence systems, climate early warning tools, and cash programming frameworks that humanitarian organizations depend on to save lives — across six countries and a decade of complex emergencies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-dusty-orange to-darkred text-white rounded-lg font-medium text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              View My Work
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-coffee/20 text-coffee rounded-lg font-medium text-sm hover:border-dusty-orange hover:text-dusty-orange hover:-translate-y-0.5 transition-all"
            >
              Read My Story
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-coffee/20 rounded-full flex items-start justify-center p-1.5">
              <div className="w-1.5 h-3 bg-dusty-orange/60 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ABOUT PREVIEW ═══ */}
      <section className="py-24 bg-beige-200/50">
        <div
          ref={aboutFade.ref}
          className={`max-w-4xl mx-auto px-6 transition-all duration-700 ${aboutFade.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">About</p>
          <h2 className="font-serif text-3xl md:text-4xl text-coffee mb-8">The Journey</h2>
          <p className="text-lg text-coffee-light/80 leading-relaxed mb-6">
            There&rsquo;s a particular kind of urgency that drives you when you&rsquo;ve seen what happens when decisions are made without evidence. Early in my career, I watched communities suffer not because help wasn&rsquo;t available, but because the information to direct that help simply didn&rsquo;t exist &mdash; because no one had mapped where the flood risk was highest, because cash transfers reached the wrong households, because satellite data sat in silos while responders worked blind.
          </p>
          <p className="text-lg text-coffee-light/80 leading-relaxed mb-6">
            That question &mdash; <em>how do you turn fragmented data into systems that save lives?</em> &mdash; has taken me from mapping disaster risk in northeast Nigeria to designing cash-based intervention systems in Cox&rsquo;s Bazar, from building geospatial drought monitoring platforms in Ethiopia to leading a $9.7M USAID-funded program in Afghanistan where satellite imagery, humanitarian reporting, climate early warning, and cash transfer coordination all had to work as one integrated system.
          </p>
          <p className="text-lg text-coffee-light/80 leading-relaxed mb-8">
            Across six countries and a decade of complex emergencies, the thread has always been the same: <em>bridging data analytics, geospatial intelligence, disaster risk science, and humanitarian cash programming into systems that put actionable evidence in front of decision-makers before a crisis becomes a catastrophe.</em>
          </p>
          <Link href="/about" className="text-dusty-orange font-medium text-sm hover:underline">
            Read the full story &rarr;
          </Link>
        </div>
      </section>

      {/* ═══ EXPERTISE PILLARS ═══ */}
      <section className="py-24">
        <div
          ref={pillarsFade.ref}
          className={`max-w-6xl mx-auto px-6 transition-all duration-700 ${pillarsFade.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">Expertise</p>
          <h2 className="font-serif text-3xl md:text-4xl text-coffee mb-4">Four Pillars of Practice</h2>
          <p className="text-coffee-muted max-w-2xl mb-12">
            A decade of humanitarian work distilled into four interconnected domains — each reinforcing the others, together forming a complete approach to crisis information architecture.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((pillar) => (
              <Link
                key={pillar.id}
                href={pillar.href}
                className="card-hover bg-white rounded-2xl p-8 border border-beige-300 group"
                style={{ borderTopColor: pillar.color, borderTopWidth: '3px' }}
              >
                <span className="text-3xl mb-4 block">{pillar.icon}</span>
                <h3 className="font-serif text-xl text-coffee mb-3 group-hover:text-dusty-orange transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-sm text-coffee-muted leading-relaxed">{pillar.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIAL — iMMAP HQ ═══ */}
      <Testimonial
        quote="His ability to synthesize complex data into actionable insights enhanced iMMAP's visibility and credibility among senior stakeholders. He consistently rated as 'exceeding expectations' in formal evaluations."
        name="Abdon Trowonou"
        title="Operations Director"
        org="iMMAP Inc. Headquarters"
        pillarColor="#009EDB"
        variant="accent"
      />

      {/* ═══ IMPACT METRICS ═══ */}
      <section className="py-24 bg-beige-200/50">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3 text-center">Impact</p>
          <h2 className="font-serif text-3xl md:text-4xl text-coffee mb-12 text-center">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <StatCard key={i} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIAL ROW ═══ */}
      <TestimonialRow
        testimonials={[
          {
            quote: 'Alex consistently operates at the intersection of data, digital innovation and humanitarian emergency operational impact. His work reflects not just technical mastery, but innovation with strategic foresight.',
            name: 'Leslie Parker Odongkara',
            title: 'Coordinator, Food Security & Agriculture Cluster',
            org: 'FAO Afghanistan',
            pillarColor: '#009EDB',
          },
          {
            quote: 'Alex is a hard working and reliable team member, he often goes above and beyond his ToR to meet mission requirements. He has a level of professionalism that leaves his team confident when asking Alex to represent externally.',
            name: 'Lauren Pearson',
            title: 'Programme Manager',
            org: 'IOM Bangladesh',
            pillarColor: '#8B3A2F',
          },
          {
            quote: 'He proved to be an invaluable member of the team, successfully supporting a team of professionals in developing accurate information management and GIS products, natural risk hazard analysis and multi-vulnerabilities maps.',
            name: 'Rafaelle Robelin',
            title: 'Shelter/NFI & CCCM Sector Coordinator',
            org: 'IOM Nigeria',
            pillarColor: '#7B4B94',
          },
        ]}
      />

      {/* ═══ FEATURED PROJECTS ═══ */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">Selected Work</p>
          <h2 className="font-serif text-3xl md:text-4xl text-coffee mb-4">Featured Projects</h2>
          <p className="text-coffee-muted max-w-2xl mb-12">
            Systems and platforms designed for real operational impact — built in active humanitarian responses and used by hundreds of organizations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {featuredProjects.map((project, i) => (
              <div
                key={i}
                className="card-hover bg-white rounded-2xl p-8 border border-beige-300"
                style={{ borderLeftColor: project.pillarColor, borderLeftWidth: '4px' }}
              >
                <span
                  className="text-[10px] uppercase tracking-widest font-semibold mb-3 block"
                  style={{ color: project.pillarColor }}
                >
                  {project.pillar === 'data' && 'Data Analytics & IM'}
                  {project.pillar === 'gis' && 'GIS & Remote Sensing'}
                  {project.pillar === 'cash' && 'Cash Programming'}
                </span>
                <h3 className="font-serif text-lg text-coffee mb-3">{project.title}</h3>
                <p className="text-sm text-coffee-muted leading-relaxed mb-4">{project.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-3 py-1 rounded-full border border-beige-300 text-coffee-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-coffee/20 rounded-lg text-sm font-medium text-coffee hover:border-dusty-orange hover:text-dusty-orange transition-all"
            >
              View All Projects &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIAL — UNICEF ═══ */}
      <Testimonial
        quote="His performance consistently demonstrated extraordinary technical ability, leadership, and innovation in support of data-driven cash programming. Alex's work reflects not just technical skill but strategic impact at the highest level."
        name="Samson Muradzikwa"
        title="Regional Social Policy Advisor (MENA), Former Chief of Social Policy"
        org="UNICEF Ethiopia"
        pillarColor="#8B3A2F"
      />

      {/* ═══ CTA ═══ */}
      <section className="py-24 bg-coffee text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
            Let&rsquo;s Build Something That Matters
          </h2>
          <p className="text-beige-400 mb-10 leading-relaxed">
            Whether you need a humanitarian data systems architect, a GIS and remote sensing specialist, a climate risk and anticipatory action advisor, or a technical lead for cash transfer programming — I&rsquo;d love to connect.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-dusty-orange to-darkred text-white rounded-lg font-medium text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  )
}
