'use client'

import { Reveal } from './ScrollReveal'

/**
 * Services infographic — a 6-cell capability grid in the pattern iMMAP's
 * "Our Services" section uses, adapted to Alex Nwoko's work: each cell
 * carries a stylised orb-style SVG icon and a short uppercase label, laid
 * out as 3 columns × 2 rows at md+ and stacked at sm.
 *
 * The orb icons are inline SVG so they scale cleanly, inherit the current
 * stroke colour, and don't need any image assets. Each icon pattern is
 * unique and loosely metaphorical for its service — concentric data cloud,
 * grid globe, radial burst, swirl, coin ring, nested rings.
 *
 * Scroll-reveal: each cell fades + slides in on scroll with an 80 ms stagger
 * so the whole grid feels like it assembles into view.
 */

type IconName =
  | 'data-cloud'
  | 'grid-globe'
  | 'radial-burst'
  | 'swirl'
  | 'coin-ring'
  | 'nested-rings'

function OrbIcon({ name, color }: { name: IconName; color: string }) {
  const common = {
    width: 96,
    height: 96,
    viewBox: '0 0 100 100',
    fill: 'none',
    stroke: color,
    strokeWidth: 0.9,
    'aria-hidden': true,
  }
  switch (name) {
    case 'data-cloud':
      // Concentric circles with scattered data points — Data Analytics / IM
      return (
        <svg {...common}>
          <circle cx="50" cy="50" r="38" opacity="0.5" />
          <circle cx="50" cy="50" r="26" opacity="0.65" />
          <circle cx="50" cy="50" r="14" opacity="0.8" />
          {Array.from({ length: 32 }).map((_, i) => {
            const a = (i / 32) * Math.PI * 2
            const r = 20 + ((i * 7) % 20)
            return (
              <circle
                key={i}
                cx={50 + Math.cos(a) * r}
                cy={50 + Math.sin(a) * r}
                r="1.1"
                fill={color}
                opacity={0.5 + ((i * 13) % 50) / 100}
              />
            )
          })}
        </svg>
      )
    case 'grid-globe':
      // Globe wrapped in meridians + equators — GIS & Remote Sensing
      return (
        <svg {...common}>
          <circle cx="50" cy="50" r="38" />
          <ellipse cx="50" cy="50" rx="38" ry="14" />
          <ellipse cx="50" cy="50" rx="38" ry="26" opacity="0.7" />
          <ellipse cx="50" cy="50" rx="14" ry="38" opacity="0.6" />
          <ellipse cx="50" cy="50" rx="26" ry="38" opacity="0.5" />
          <line x1="12" y1="50" x2="88" y2="50" opacity="0.5" />
          <line x1="50" y1="12" x2="50" y2="88" opacity="0.5" />
        </svg>
      )
    case 'radial-burst':
      // 32 radial lines from centre — Data Visualization / Dashboards
      return (
        <svg {...common}>
          <circle cx="50" cy="50" r="38" opacity="0.4" />
          {Array.from({ length: 32 }).map((_, i) => {
            const a = (i / 32) * Math.PI * 2
            const x1 = 50 + Math.cos(a) * 18
            const y1 = 50 + Math.sin(a) * 18
            const x2 = 50 + Math.cos(a) * 38
            const y2 = 50 + Math.sin(a) * 38
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                opacity={0.4 + ((i * 11) % 60) / 100}
              />
            )
          })}
          <circle cx="50" cy="50" r="4" fill={color} />
        </svg>
      )
    case 'swirl':
      // Logarithmic spiral — Climate & DRR / Anticipatory Action
      return (
        <svg {...common}>
          <circle cx="50" cy="50" r="38" opacity="0.4" />
          {(() => {
            const pts: string[] = []
            for (let t = 0; t <= 6 * Math.PI; t += 0.1) {
              const r = 1.4 * t
              const x = 50 + Math.cos(t) * r
              const y = 50 + Math.sin(t) * r
              pts.push(`${pts.length === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
            }
            return <path d={pts.join(' ')} />
          })()}
        </svg>
      )
    case 'coin-ring':
      // Ring with a central currency glyph — Cash Programming
      return (
        <svg {...common}>
          <circle cx="50" cy="50" r="38" opacity="0.5" />
          <circle cx="50" cy="50" r="26" opacity="0.7" />
          <circle cx="50" cy="50" r="14" />
          <text
            x="50"
            y="58"
            textAnchor="middle"
            fontSize="18"
            fontWeight={700}
            fill={color}
            stroke="none"
          >
            $
          </text>
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2
            return (
              <circle
                key={i}
                cx={50 + Math.cos(a) * 32}
                cy={50 + Math.sin(a) * 32}
                r="1.5"
                fill={color}
              />
            )
          })}
        </svg>
      )
    case 'nested-rings':
      // Growth: four nested rings offset — Capacity Strengthening
      return (
        <svg {...common}>
          <circle cx="50" cy="50" r="38" opacity="0.4" />
          <circle cx="46" cy="50" r="28" opacity="0.6" />
          <circle cx="52" cy="50" r="20" opacity="0.75" />
          <circle cx="50" cy="48" r="12" opacity="0.9" />
          <circle cx="50" cy="50" r="4" fill={color} />
        </svg>
      )
  }
}

type Service = {
  icon: IconName
  label: string
  color: string
}

const SERVICES: Service[] = [
  { icon: 'data-cloud', label: 'Data Analytics & Information Management', color: '#009EDB' },
  { icon: 'grid-globe', label: 'GIS & Remote Sensing', color: '#7B4B94' },
  { icon: 'radial-burst', label: 'Data Visualisation & Dashboards', color: '#C4703F' },
  { icon: 'swirl', label: 'Climate Analytics & DRR', color: '#2E7D32' },
  { icon: 'coin-ring', label: 'Cash Transfer Programming', color: '#8B3A2F' },
  { icon: 'nested-rings', label: 'Capacity Strengthening & Training', color: '#C4703F' },
]

export default function ServicesInfographic({
  heading = 'Services',
  intro = 'I deliver end-to-end disaster risk and humanitarian data services for UN agencies, national governments, donors and partners. From data collection through dashboards and training, every deliverable is designed to be country-owned, decision-ready, and interoperable with the systems around it.',
  accent = '#C4703F',
}: {
  heading?: string
  intro?: string
  accent?: string
}) {
  return (
    <section className="relative py-20 bg-gradient-to-br from-[#1F140A] via-[#3D2B1F] to-[#7A3410] text-beige-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-6 mb-14">
          <h2 className="font-serif text-3xl md:text-4xl text-white">{heading}</h2>
          <div className="flex-1 h-px bg-white/30" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-start">
          {/* Services grid — 2 columns × 3 rows, spans 2 of the 5 outer columns */}
          <div className="md:col-span-2 grid grid-cols-2 gap-x-6 gap-y-10">
            {SERVICES.map((s, i) => (
              <Reveal key={s.label} index={i}>
                <div className="flex flex-col items-center text-center">
                  <OrbIcon name={s.icon} color={s.color} />
                  <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-white/90 leading-tight">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          {/* Intro copy — spans 3 of the 5 outer columns for a wider text block */}
          <Reveal index={6}>
            <div className="md:col-span-3 text-sm md:text-base text-white/80 leading-relaxed border-l border-white/20 pl-8">
              <p className="mb-4">{intro}</p>
              <p className="text-white/60">
                Every engagement combines methodology (hazard information profiles, data standards, cascade logic), tooling (Python, GIS, Power BI, interoperability pipelines) and capacity transfer so the system outlives the engagement that funded it.
              </p>
              <div
                className="mt-6 inline-block h-0.5 w-16"
                style={{ backgroundColor: accent }}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
