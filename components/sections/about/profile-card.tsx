"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Download, MapPin, CheckCircle, Clock, XCircle } from "lucide-react"
import type { AboutProfile } from "@/types/about"

const AVAILABILITY_CONFIG = {
  available: {
    icon: CheckCircle,
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/30",
    dot: "bg-green-400",
  },
  busy: {
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/30",
    dot: "bg-yellow-400",
  },
  not_available: {
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/30",
    dot: "bg-red-400",
  },
}

const TECH_ICONS = ["⚛️", "🐍", "▲", "🔥", "⚡", "🎨", "🤖", "🗄️"]

interface ProfileCardProps {
  profile: AboutProfile | null
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Tilt effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 })

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    x.set(nx)
    y.set(ny)
  }

  function onMouseLeave() {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  const avail = AVAILABILITY_CONFIG[profile?.availability_status ?? "available"]
  const AvailIcon = avail.icon
  const avatarUrl = profile?.avatar_url
  const name = profile?.name || null
  const resumeUrl = profile?.resume_url || null

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      className="relative"
    >
      {/* Outer glow */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0.4 }}
        className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-2xl"
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative glass rounded-3xl p-8 flex flex-col items-center gap-6 border border-white/10">

        {/* Rotating border ring */}
        <div className="relative w-48 h-48">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, #3b82f6, #a855f7, #ec4899, #3b82f6)",
              padding: 3,
            }}
            aria-hidden="true"
          >
            <div className="w-full h-full rounded-full bg-[#050810]" />
          </motion.div>

          {/* Profile image */}
          <div className="absolute inset-[3px] rounded-full overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Profile photo"
                fill
                sizes="192px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl">
                👨‍💻
              </div>
            )}
          </div>

          {/* Floating tech icons */}
          {TECH_ICONS.slice(0, 4).map((icon, i) => {
            const angle = (i / 4) * 2 * Math.PI - Math.PI / 4
            const radius = 110
            const cx = Math.cos(angle) * radius + 96
            const cy = Math.sin(angle) * radius + 96
            return (
              <motion.div
                key={i}
                className="absolute w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-base shadow-lg"
                style={{ left: cx - 18, top: cy - 18 }}
                animate={{ y: [0, -6, 0], rotate: [0, 5, 0, -5, 0] }}
                transition={{
                  duration: 3 + i * 0.4,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeInOut",
                }}
                aria-hidden="true"
              >
                {icon}
              </motion.div>
            )
          })}
        </div>

        {/* Name & tagline — only shown when set */}
        {(name || profile?.tagline) && (
          <div className="text-center space-y-1">
            {name && <h3 className="text-xl font-bold text-white">{name}</h3>}
            {profile?.tagline && (
              <p className="text-sm text-white/60">{profile.tagline}</p>
            )}
          </div>
        )}

        {/* Location */}
        {profile?.location && (
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <MapPin size={12} />
            {profile.location}
          </div>
        )}

        {/* Availability badge — only shown when availability_text is set */}
        {profile?.availability_text && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium ${avail.bg} ${avail.color}`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${avail.dot}`} />
            {profile.availability_text}
          </div>
        )}

        {/* Download resume — only shown when URL is set */}
        {resumeUrl && (
          <motion.a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                       bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium
                       shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-shadow"
          >
            <Download size={15} />
            Download Resume
          </motion.a>
        )}
      </div>
    </motion.div>
  )
}
