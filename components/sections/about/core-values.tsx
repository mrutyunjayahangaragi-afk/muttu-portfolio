"use client"

import { motion } from "framer-motion"
import type { CoreValue } from "@/types/about"

interface CoreValueCardProps {
  value: CoreValue
  index: number
}

function CoreValueCard({ value, index }: CoreValueCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all group cursor-default"
    >
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center
                     text-2xl mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}
        aria-hidden="true"
      >
        {value.icon}
      </div>

      <h4 className="text-sm font-semibold text-white mb-1.5">{value.title}</h4>
      <p className="text-xs text-white/55 leading-relaxed">{value.description}</p>
    </motion.div>
  )
}

interface CoreValuesProps {
  values: CoreValue[]
}

export function CoreValues({ values }: CoreValuesProps) {
  return (
    <section aria-label="Core values">
      <div className="text-center mb-10">
        <p className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-2">What Drives Me</p>
        <h2 className="text-3xl font-bold text-white">Core Values</h2>
      </div>
      {values.length === 0 ? (
        <div className="glass rounded-2xl p-12 border border-white/10 text-center">
          <p className="text-4xl mb-3" aria-hidden="true">💡</p>
          <p className="text-white/50 text-sm">No core values added yet.</p>
          <p className="text-white/30 text-xs mt-1">Add values through the admin dashboard.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {values.map((value, i) => (
            <CoreValueCard key={value.id} value={value} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}
