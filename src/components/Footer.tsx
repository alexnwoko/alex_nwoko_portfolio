import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-coffee text-beige-200 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl text-white mb-4">Alex Nwoko</h3>
            <p className="text-beige-400 text-sm leading-relaxed">
              Humanitarian data systems architect building the information infrastructure behind crisis response across six countries.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-dusty-orange mb-4 font-semibold">Navigate</h4>
            <div className="flex flex-col gap-2">
              {[
                { href: '/about', label: 'About' },
                { href: '/expertise', label: 'Expertise' },
                { href: '/projects', label: 'Projects' },
                { href: '/innovations', label: 'Innovations' },
                { href: '/founder-journey', label: 'Founder Journey' },
                { href: '/blog', label: 'Field Notes' },
                { href: '/credentials', label: 'Credentials' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-beige-300 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-dusty-orange mb-4 font-semibold">Connect</h4>
            <div className="flex flex-col gap-2 text-sm text-beige-300">
              <a href="https://www.linkedin.com/in/alex-nwoko/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                LinkedIn
              </a>
              <a href="https://github.com/alex-nwoko" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                GitHub
              </a>
              <a href="mailto:alex.u.nwoko@gmail.com" className="hover:text-white transition-colors">
                Email
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-coffee-light/30 pt-8 text-center text-xs text-beige-400">
          <p>&copy; {new Date().getFullYear()} Alex Nwoko. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
