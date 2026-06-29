'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

/**
 * Work-samples manifest.
 *
 * Each entry references a PNG thumbnail extracted from one of the portfolio
 * PDFs and saved under public/work-samples/. The marquee renders these in a
 * continuously-scrolling horizontal ticker, paused on hover. Clicking a
 * thumbnail opens a lightbox with the full-resolution image.
 *
 * Adding new samples: drop the PNG into public/work-samples/ and append an
 * entry below. The marquee picks them up automatically.
 */
const SAMPLES: { src: string; title: string }[] = [
  { src: '/work-samples/afg-flood-risk-forecast-apr2024.png',                title: 'AFG 10-Day Flood Risk Forecast (April 2024)' },
  { src: '/work-samples/afg-drought-stress-jul2022.png',                     title: 'AFG Drought Stress Map (July 2022)' },
  { src: '/work-samples/afg-earthquake-response-spera.png',                  title: 'AFG Earthquake Response, Partners Presence (Spera)' },
  { src: '/work-samples/covid19-bangladesh-situation-analysis.png',          title: 'COVID-19 Bangladesh Situation Analysis' },
  { src: '/work-samples/ethiopia-cash-market-feasibility-2023.png',          title: 'Cash & Market Feasibility Assessment, Ethiopia (2023)' },
  { src: '/work-samples/iom-bangladesh-pdm-cash-for-work-2019.png',          title: 'IOM Bangladesh, Rohingya PDM, Cash for Work (2019)' },
  { src: '/work-samples/tigray-financial-services-financial-institutions.png', title: 'Tigray Financial Services, Financial Institutions Survey' },
  { src: '/work-samples/immap-humanitarian-cash-transfer-im-support.png',    title: 'iMMAP Humanitarian Cash Transfer IM Support' },
  { src: '/work-samples/cash-working-group-partners-operational-presence.png', title: 'Cash Working Group, Partners Operational Presence' },
  { src: '/work-samples/afg-wash-cluster-operational-presence-jun2022.png',  title: 'AFG WASH Cluster Partners Operational Presence (June 2022)' },
  { src: '/work-samples/afg-im-assessment-capacity-building-gaps-apr2023.png', title: 'AFG IM Assessment, Capacity-Building Gaps Survey (2023)' },
  { src: '/work-samples/nga-thematic-flood-vulnerability-mapping-2023.png',  title: 'Nigeria Thematic Flood Vulnerability Mapping (2023)' },
  { src: '/work-samples/afg-cumulative-precipitation.png',                   title: 'AFG Cumulative Precipitation Comparison' },
  { src: '/work-samples/afg-avalanche-risk-exposure.png',                    title: 'AFG Avalanche Risk Exposure' },
  { src: '/work-samples/witch-fire-hazard-assessment.png',                   title: 'Witch Fire Hazard Assessment (California)' },
  { src: '/work-samples/inter-agency-mpc-pdm-summary.png',                   title: 'Inter-Agency Multi-Purpose Cash PDM Summary' },
  { src: '/work-samples/mpc-programmatic-snapshot-cerf.png',                 title: 'Multi-Purpose Cash Programmatic Snapshot (CERF)' },
  { src: '/work-samples/iom-bangladesh-cbi-annual-dashboard-2019.png',       title: 'IOM Bangladesh Cash-Based Intervention Annual Dashboard (2019)' },
  { src: '/work-samples/tigray-financial-services-general-population.png',   title: 'Tigray Financial Services, General Population Survey' },
  { src: '/work-samples/tigray-financial-services-humanitarian-partners.png', title: 'Tigray Financial Services, Humanitarian Partners Survey' },
  { src: '/work-samples/cash-working-group-programmatic-snapshot.png',       title: 'Cash Working Group, General Programmatic Snapshot' },
  // Nigeria IOM Shelter / CCCM Sector IM samples (2018)
  { src: '/work-samples/nga-multisectoral-camp-gap-analysis-2018.png',       title: 'Nigeria Multi-Sector Camp Gap Analysis, Northeast (April 2018)' },
  { src: '/work-samples/nga-shelter-nfi-cccm-monthly-factsheet-jul2018.png', title: 'Nigeria Shelter / NFI / CCCM Monthly Factsheet (July 2018)' },
  { src: '/work-samples/nga-cccm-camp-management-coverage-jul2018.png',      title: 'Nigeria CCCM Camp Management Coverage Gap and Partners Presence (July 2018)' },
  // Nigeria FAO Food Security Sector IM samples (Dec 2018)
  { src: '/work-samples/nga-fss-cash-dashboard-dec2018.png',                 title: 'Nigeria Food Security Sector Cash Dashboard (December 2018)' },
  { src: '/work-samples/nga-fss-sector-dashboard-dec2018.png',               title: 'Nigeria Food Security Sector Dashboard (December 2018)' },
  // Ethiopia FAO Agriculture Sector IM
  { src: '/work-samples/eth-agriculture-sector-dashboard-apr2020.png',       title: 'Ethiopia Agriculture Sector Dashboard (April 2020)' },
  // Bangladesh (Cox\'s Bazar) IOM CwC / CVA IM samples
  { src: '/work-samples/bgd-radio-listening-group-activity-mapping-2019.png', title: 'IOM Bangladesh Radio Listening Group Activity Mapping (August 2019)' },
  { src: '/work-samples/bgd-cwcwg-dashboard.png',                            title: 'IOM Bangladesh Communication with Communities Working Group Dashboard' },
  { src: '/work-samples/bgd-cwc-july-dashboard.png',                         title: 'IOM Bangladesh CwC July Dashboard' },
  { src: '/work-samples/bgd-cwc-partners-presence.png',                      title: 'IOM Bangladesh CwC Partners Operational Presence' },
]

export default function WorkSamplesMarquee() {
  const [lightbox, setLightbox] = useState<number | null>(null)

  const close = useCallback(() => setLightbox(null), [])
  const next = useCallback(
    () => setLightbox((i) => (i === null ? null : (i + 1) % SAMPLES.length)),
    [],
  )
  const prev = useCallback(
    () => setLightbox((i) => (i === null ? null : (i - 1 + SAMPLES.length) % SAMPLES.length)),
    [],
  )

  // Keyboard navigation when lightbox is open
  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, close, next, prev])

  // Doubled list for seamless infinite loop (CSS animates -50% which is one full set width).
  const doubled = [...SAMPLES, ...SAMPLES]

  return (
    <>
      {/* Marquee viewport */}
      <div className="marquee-pause overflow-hidden relative">
        {/* Fade edges so the cards drift in/out instead of clipping abruptly */}
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-beige-100 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-beige-100 to-transparent" />

        <div className="marquee-track flex gap-5 w-max">
          {doubled.map((sample, i) => {
            const realIndex = i % SAMPLES.length
            return (
              <button
                key={i}
                type="button"
                onClick={() => setLightbox(realIndex)}
                aria-label={`Open ${sample.title} full-size preview`}
                className="group relative shrink-0 h-[220px] md:h-[260px] rounded-xl overflow-hidden border border-beige-300 bg-white shadow-sm transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-dusty-orange focus:ring-offset-2 focus:ring-offset-beige-100"
              >
                {/* Img with native browser sizing — fixed height, auto width via inline style on parent button */}
                <img
                  src={sample.src}
                  alt={sample.title}
                  loading="lazy"
                  className="h-full w-auto block"
                  style={{ height: '100%', width: 'auto' }}
                />
                {/* Title overlay — appears on hover */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-coffee/90 via-coffee/60 to-transparent text-white px-4 pt-10 pb-3 text-xs md:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {sample.title}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-coffee/95 flex items-center justify-center p-4 md:p-8"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={SAMPLES[lightbox].title}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); close() }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-beige-100 text-coffee flex items-center justify-center hover:bg-white transition-colors z-10"
            aria-label="Close preview"
          >
            ✕
          </button>

          {/* Prev button */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-beige-100/90 text-coffee flex items-center justify-center hover:bg-white transition-colors z-10"
            aria-label="Previous sample"
          >
            ‹
          </button>

          {/* Next button */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-beige-100/90 text-coffee flex items-center justify-center hover:bg-white transition-colors z-10"
            aria-label="Next sample"
          >
            ›
          </button>

          <div
            className="relative max-w-6xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={SAMPLES[lightbox].src}
              alt={SAMPLES[lightbox].title}
              className="max-h-[85vh] w-auto h-auto rounded-lg shadow-2xl"
            />
            <p className="text-center text-beige-200 mt-4 text-sm">
              {SAMPLES[lightbox].title}
              <span className="text-beige-400 ml-3">
                {lightbox + 1} / {SAMPLES.length}
              </span>
            </p>
          </div>
        </div>
      )}
    </>
  )
}
