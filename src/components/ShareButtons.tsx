'use client'

import { useState } from 'react'

interface ShareButtonsProps {
  url: string
  title: string
}

/**
 * Social-share button row for blog posts.
 *
 * Platforms covered:
 *   - X / Twitter (intent URL)
 *   - LinkedIn (share-offsite URL)
 *   - Facebook (sharer URL)
 *   - WhatsApp (wa.me URL, works on mobile + desktop web)
 *   - Email (mailto)
 *   - Copy link (clipboard, works for Instagram / Threads / DMs anywhere)
 *
 * Instagram doesn't expose a public web share URL, sharing happens inside
 * the app via the device share sheet. The Copy-Link button is the right
 * primitive: paste into a Story, bio, or DM.
 */
export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  // Pre-encode once. Twitter/LinkedIn limits keep the message short.
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedShareText = encodeURIComponent(`${title}, by Alex Nwoko`)

  const platforms = [
    {
      name: 'X',
      label: 'Share on X',
      href: `https://twitter.com/intent/tweet?text=${encodedShareText}&url=${encodedUrl}&via=alexnwoko`,
      // X / Twitter glyph
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      hoverColor: 'hover:bg-coffee hover:text-white',
    },
    {
      name: 'LinkedIn',
      label: 'Share on LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      hoverColor: 'hover:bg-[#0A66C2] hover:text-white',
    },
    {
      name: 'Facebook',
      label: 'Share on Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      hoverColor: 'hover:bg-[#1877F2] hover:text-white',
    },
    {
      name: 'WhatsApp',
      label: 'Share on WhatsApp',
      href: `https://wa.me/?text=${encodedShareText}%20${encodedUrl}`,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      hoverColor: 'hover:bg-[#25D366] hover:text-white',
    },
    {
      name: 'Email',
      label: 'Share by email',
      href: `mailto:?subject=${encodedTitle}&body=${encodedShareText}%0A%0A${encodedUrl}`,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
      ),
      hoverColor: 'hover:bg-coffee hover:text-white',
    },
  ]

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      // Reset after 2 seconds so the user sees the feedback then it goes back
      // to the default state, ready for another copy.
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for very old browsers / non-secure contexts: open a prompt
      window.prompt('Copy this link:', url)
    }
  }

  return (
    <div className="border-t border-beige-300 pt-8 mt-12">
      <p className="text-xs uppercase tracking-[0.2em] text-coffee-muted font-semibold mb-4">
        Share this post
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {platforms.map((p) => (
          <a
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={p.label}
            title={p.label}
            className={`w-11 h-11 rounded-full bg-white border border-beige-300 text-coffee-light flex items-center justify-center transition-all ${p.hoverColor} hover:-translate-y-0.5 hover:shadow-sm`}
          >
            {p.icon}
          </a>
        ))}

        {/* Copy-link button, works for Instagram, Threads, DMs, anywhere */}
        <button
          type="button"
          onClick={handleCopyLink}
          aria-label={copied ? 'Link copied' : 'Copy link'}
          title={copied ? 'Link copied!' : 'Copy link'}
          className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all hover:-translate-y-0.5 hover:shadow-sm ${
            copied
              ? 'bg-dusty-orange border-dusty-orange text-white'
              : 'bg-white border-beige-300 text-coffee-light hover:bg-dusty-orange hover:text-white hover:border-dusty-orange'
          }`}
        >
          {copied ? (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          )}
        </button>

        {copied && (
          <span className="text-sm text-dusty-orange font-medium ml-2">
            Link copied!
          </span>
        )}
      </div>
    </div>
  )
}
