"use client"

import { motion } from "framer-motion"
import { Code2, Link2, MessageSquare, Mail, Camera } from "lucide-react"
import type { HeroProfile } from "@/types/hero"
import { cn } from "@/lib/utils"

/**
 * SocialLinks — renders only the links that the admin has configured.
 * If a URL is not set, that icon is not rendered.
 * Zero hardcoded URLs.
 */
export function SocialLinks({ profile }: { profile: HeroProfile | null }) {
  const links = [
    { id: "github",    icon: Code2,        label: "GitHub",      href: profile?.github_url,   color: "hover:text-white" },
    { id: "linkedin",  icon: Link2,        label: "LinkedIn",    href: profile?.linkedin_url, color: "hover:text-blue-400" },
    { id: "twitter",   icon: MessageSquare,label: "Twitter / X", href: profile?.twitter_url,  color: "hover:text-sky-400" },
    { id: "email",     icon: Mail,         label: "Email",       href: profile?.email ? `mailto:${profile.email}` : null, color: "hover:text-red-400" },
    { id: "instagram", icon: Camera,       label: "Instagram",   href: profile?.instagram_url, color: "hover:text-pink-400" },
  ].filter((l) => !!l.href)

  if (links.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="flex items-center gap-4"
      role="list"
      aria-label="Social links"
    >
      {links.map(({ id, icon: Icon, label, href, color }, i) => (
        <motion.a
          key={id}
          href={href!}
          target={href?.startsWith("mailto") ? undefined : "_blank"}
          rel="noopener noreferrer"
          aria-label={label}
          role="listitem"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.9 + i * 0.1 }}
          whileHover={{ scale: 1.2, y: -4 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "relative p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10",
            "hover:bg-white/10 hover:border-white/20 transition-all duration-200 group",
            color
          )}
        >
          <Icon size={20} className="relative z-10" />
          <span
            className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 text-xs bg-black/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none"
            role="tooltip"
          >
            {label}
          </span>
          <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" aria-hidden="true" />
        </motion.a>
      ))}
    </motion.div>
  )
}
