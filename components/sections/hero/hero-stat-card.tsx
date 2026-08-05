"use client"

import { motion } from "framer-motion"
import { AnimatedCounter } from "@/components/animations/counter"
import type { HeroStat } from "@/types/hero"

interface HeroStatCardProps {
  stat: HeroStat
}

export function HeroStatCard({ stat }: HeroStatCardProps) {
  // Extract number and suffix from stat.value (e.g. "30+" -> 30 and "+")
  const numMatch = stat.value.match(/\d+/)
  const numericValue = numMatch ? parseInt(numMatch[0], 10) : 0
  const suffix = stat.value.replace(/\d+/, "")

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group cursor-default"
    >
      {/* Outer border glow glow */}
      <div 
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color || 'from-blue-500 to-purple-500'} opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500`} 
        aria-hidden="true" 
      />

      <div className="glass-strong rounded-2xl p-5 border border-white/5 group-hover:border-white/15 transition-all duration-300">
        <div className="relative flex flex-col items-center justify-center gap-1.5 text-center">
          <span className="text-3xl mb-1 filter drop-shadow-md select-none" aria-hidden="true">
            {stat.icon}
          </span>
          
          <span className="text-2xl font-bold text-white tracking-tight flex items-baseline">
            {numericValue > 0 ? (
              <AnimatedCounter value={numericValue} suffix={suffix} />
            ) : (
              stat.value
            )}
          </span>
          
          <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest leading-none">
            {stat.label}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
