"use client"

import { motion } from "framer-motion"
import type { FunFact } from "@/types/about"

interface FunFactCardProps {
  fact: FunFact
  index: number
}

function FunFactCard({ fact, index }: FunFactCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.04 }}
      className="glass rounded-2xl p-5 border border-white/10 hover:border-purple-500/40
                 transition-all group text-center cursor-default"
    >
      <span className="text-3xl block mb-2" aria-hidden="true">{fact.icon}</span>
      <p className="text-xl font-bold text-white mb-0.5">{fact.value}</p>
      <p className="text-xs text-white/50 uppercase tracking-wide">{fact.label}</p>
    </motion.div>
  )
}

interface FunFactsProps {
  facts: FunFact[]
}

export function FunFacts({ facts }: FunFactsProps) {
  if (!facts.length) return (
    <section aria-label="Fun facts">
      <div className="text-center mb-8">
        <p className="text-xs font-mono text-pink-400 uppercase tracking-widest mb-1">A Little Extra</p>
        <h2 className="text-3xl font-bold text-white">Fun Facts</h2>
      </div>
      <div className="glass rounded-2xl p-10 border border-white/10 text-center">
        <p className="text-white/40 text-sm">No fun facts added yet.</p>
      </div>
    </section>
  )
  return (
    <section aria-label="Fun facts">
      <div className="text-center mb-8">
        <p className="text-xs font-mono text-pink-400 uppercase tracking-widest mb-1">A Little Extra</p>
        <h2 className="text-3xl font-bold text-white">Fun Facts</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {facts.map((fact, i) => (
          <FunFactCard key={fact.id} fact={fact} index={i} />
        ))}
      </div>
    </section>
  )
}
