'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const METRICS: {
  value: number
  label: string
  sub: string
}[] = [
  {
    value: 85,
    label: 'countries',
    sub: 'DesInventar records in the DELTA roll-out scope',
  },
  {
    value: 79,
    label: 'hazards',
    sub: 'in the Hazard Information Profiles 2025 cascade chain',
  },
]

function useCountOnView(target: number, duration = 1800) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()
          const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}

function MetricCard({ metric }: { metric: typeof METRICS[0] }) {
  const { count, ref } = useCountOnView(metric.value)
  const display = metric.value >= 1000 ? count.toLocaleString() : count.toString()
  return (
    <div
      ref={ref}
      className="rounded-xl p-6 md:p-7 border border-white/15 bg-white/[0.04]"
    >
      <div className="font-serif text-4xl md:text-5xl text-white mb-2 leading-none">
        {display}
      </div>
      <div className="text-[11px] uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">
        {metric.label}
      </div>
      <p className="text-sm text-white/70 leading-relaxed">{metric.sub}</p>
    </div>
  )
}

export default function DeltaAtUNDRR() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1F140A] via-[#3D2B1F] to-[#5C3317] text-white">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />
      <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.25em] text-dusty-orange font-semibold mb-4">
              Current Role &middot; Bonn
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-white leading-tight mb-6">
              DELTA Resilience at UNDRR
            </h2>
            <p className="text-base text-white/80 leading-relaxed mb-4">
              DELTA Resilience is UNDRR&rsquo;s system for tracking disaster
              losses and damages, built to receive the DesInventar records of
              85 countries. As Global Disaster Data Expert in the Risk
              Knowledge Branch, I bring the disaster-risk perspective to its
              design and roll-out: the national, regional and global instance
              model, the Analysis page, the Geoportal, and the methodology
              that makes the losses and damages record readable as evidence
              to drive predictable climate action, early warning, emergency
              response, and long-term resilience and recovery.
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-dusty-orange font-medium hover:text-white transition-colors mt-2"
            >
              Read the project detail{' '}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {METRICS.map((m) => (
              <MetricCard key={m.label} metric={m} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
