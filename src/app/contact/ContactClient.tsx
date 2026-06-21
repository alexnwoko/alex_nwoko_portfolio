'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch('https://formspree.io/f/xovdkrgb', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-dusty-orange font-semibold mb-3">
          Contact
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-coffee mb-6 leading-tight">
          Let&rsquo;s Connect
        </h1>
        <p className="text-lg text-coffee-light/80 max-w-2xl leading-relaxed">
          Whether you need a disaster risk and humanitarian data systems architect, a GIS and remote sensing
          specialist, a climate risk and anticipatory action advisor, or a technical lead
          for cash transfer programming, I&rsquo;d love to hear from you.
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <h2 className="font-serif text-2xl text-coffee mb-6">Send a Message</h2>

          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <p className="text-green-800 font-serif text-xl mb-2">Message Sent</p>
              <p className="text-green-700 text-sm">
                Thank you for reaching out. I&rsquo;ll get back to you shortly.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 text-sm text-dusty-orange font-medium hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm text-coffee-muted mb-1.5 font-medium"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-white text-coffee text-sm focus:outline-none focus:ring-2 focus:ring-dusty-orange/30 focus:border-dusty-orange transition"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-coffee-muted mb-1.5 font-medium"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-white text-coffee text-sm focus:outline-none focus:ring-2 focus:ring-dusty-orange/30 focus:border-dusty-orange transition"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm text-coffee-muted mb-1.5 font-medium"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-white text-coffee text-sm focus:outline-none focus:ring-2 focus:ring-dusty-orange/30 focus:border-dusty-orange transition"
                >
                  <option>Consulting / Advisory</option>
                  <option>Job Opportunity</option>
                  <option>Collaboration</option>
                  <option>Speaking Engagement</option>
                  <option>General Inquiry</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm text-coffee-muted mb-1.5 font-medium"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-beige-300 bg-white text-coffee text-sm focus:outline-none focus:ring-2 focus:ring-dusty-orange/30 focus:border-dusty-orange transition resize-none"
                  placeholder="Tell me about your project or opportunity..."
                />
              </div>

              {status === 'error' && (
                <p className="text-red-600 text-sm">
                  Something went wrong. Please try again or email me directly.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-3.5 bg-gradient-to-r from-dusty-orange to-darkred text-white rounded-xl font-medium text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="font-serif text-2xl text-coffee mb-6">
              Other Ways to Reach Me
            </h2>
            <div className="space-y-4">
              <a
                href="mailto:alex.u.nwoko@gmail.com"
                className="flex items-center gap-4 bg-white rounded-xl p-5 border border-beige-300 card-hover group"
              >
                <div className="w-10 h-10 rounded-full bg-dusty-orange/10 flex items-center justify-center text-dusty-orange text-lg">
                  &#9993;
                </div>
                <div>
                  <p className="text-xs text-coffee-muted uppercase tracking-wider">
                    Email
                  </p>
                  <p className="text-sm text-coffee group-hover:text-dusty-orange transition-colors">
                    alex.u.nwoko@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/alex-nwoko/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white rounded-xl p-5 border border-beige-300 card-hover group"
              >
                <div className="w-10 h-10 rounded-full bg-un-blue/10 flex items-center justify-center text-un-blue text-lg font-bold">
                  in
                </div>
                <div>
                  <p className="text-xs text-coffee-muted uppercase tracking-wider">
                    LinkedIn
                  </p>
                  <p className="text-sm text-coffee group-hover:text-un-blue transition-colors">
                    www.linkedin.com/in/alex-nwoko/
                  </p>
                </div>
              </a>

              <a
                href="https://github.com/alex-nwoko"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white rounded-xl p-5 border border-beige-300 card-hover group"
              >
                <div className="w-10 h-10 rounded-full bg-coffee/10 flex items-center justify-center text-coffee text-lg">
                  &#60;/&#62;
                </div>
                <div>
                  <p className="text-xs text-coffee-muted uppercase tracking-wider">
                    GitHub
                  </p>
                  <p className="text-sm text-coffee group-hover:text-dusty-orange transition-colors">
                    github.com/alex-nwoko
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-beige-200/50 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <h3 className="font-serif text-lg text-coffee">Open to Opportunities</h3>
            </div>
            <div className="space-y-2">
              {[
                { text: 'Data Analytics, IM & Performance Monitoring', color: '#009EDB' },
                { text: 'GIS, Remote Sensing & Geospatial Analytics', color: '#7B4B94' },
                { text: 'Climate Risk, Early Warning & Anticipatory Action', color: '#C4703F' },
                { text: 'Disaster Risk Reduction & Emergency Coordination', color: '#C4703F' },
                { text: 'Cash Transfer Programming & Targeting Systems', color: '#8B3A2F' },
                { text: 'Platform Design & Data Architecture', color: '#009EDB' },
                { text: 'Technical Program Management & Advisory', color: '#3D2B1F' },
                { text: 'AI, NLP & Generative AI for Humanitarian Monitoring', color: '#3D2B1F' },
                { text: 'Speaking, Training & Research Collaboration', color: '#3D2B1F' },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2 text-sm text-coffee-light"
                >
                  <span style={{ color: item.color }}>&#10003;</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
