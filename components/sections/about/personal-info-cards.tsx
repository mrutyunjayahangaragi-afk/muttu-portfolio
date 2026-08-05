"use client"

import { motion } from "framer-motion"
import { MapPin, GraduationCap, Globe, Heart, Target, Zap } from "lucide-react"
import type { AboutProfile } from "@/types/about"

interface InfoCard {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  value: string
  color: string
}

interface PersonalInfoCardsProps {
  profile: AboutProfile | null
}

export function PersonalInfoCards({ profile }: PersonalInfoCardsProps) {
  const cards: InfoCard[] = [
    {
      icon: MapPin,
      label: "Location",
      value: profile?.location ?? "—",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: GraduationCap,
      label: "Degree",
      value: profile?.degree ?? "—",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Globe,
      label: "Languages",
      value: profile?.languages?.join(", ") ?? "—",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Heart,
      label: "Interests",
      value: profile?.interests?.slice(0, 3).join(", ") ?? "—",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Target,
      label: "Career Goal",
      value: profile?.career_goal ?? "—",
      color: "from-yellow-500 to-amber-500",
    },
    {
      icon: Zap,
      label: "Availability",
      value: profile?.availability_text ?? "Open to Opportunities",
      color: "from-pink-500 to-rose-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-label="Personal information">
      {cards.map(({ icon: Icon, label, value, color }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          whileHover={{ y: -3 }}
          className="glass rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-colors group"
        >
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} shrink-0 flex items-center justify-center`}>
              <Icon size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-white/45 uppercase tracking-wider mb-0.5">{label}</p>
              <p className="text-sm text-white font-medium leading-snug">{value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
