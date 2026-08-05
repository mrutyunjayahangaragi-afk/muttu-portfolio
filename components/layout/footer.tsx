"use client"

import Link from "next/link"
import { Code2, Link2, MessageSquare, Mail, ExternalLink } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Magnetic } from "@/components/animations/magnetic"

const SOCIAL_LINKS = [
  { icon: Code2, label: "GitHub", href: "https://github.com" },
  { icon: Link2, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: MessageSquare, label: "Twitter / X", href: "https://x.com" },
  { icon: Mail, label: "Email", href: "mailto:hello@example.com" },
]

const FOOTER_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
]

interface FooterProps {
  logoText?: string
}

export function Footer({ logoText = "<Dev/>" }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-black/40 backdrop-blur-md overflow-hidden">
      {/* Top Animated Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500/30 via-purple-500/50 to-pink-500/30" />
      
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent select-none"
            >
              {logoText}
            </Link>
            <p className="max-w-xs text-sm text-white/50 leading-relaxed">
              Building modern, performant web experiences with cutting-edge technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-widest text-white/80 uppercase">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 transition-colors duration-300 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-widest text-white/80 uppercase">
              Connect
            </h3>
            <div className="flex gap-2">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href }) => (
                <Magnetic key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/5 text-white/50 transition-all duration-300 hover:bg-white/10 hover:border-white/10 hover:text-white"
                  >
                    <Icon size={18} />
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>
        </div>

        <Separator className="mb-8 border-white/5" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/40 sm:flex-row">
          <p>© {year} Dev Portfolio. All rights reserved.</p>
          <p className="flex items-center gap-1.5 hover:text-white/60 transition-colors">
            Built with Next.js, TypeScript &amp; Tailwind CSS
            <ExternalLink size={12} className="opacity-70" />
          </p>
        </div>
      </div>
    </footer>
  )
}
