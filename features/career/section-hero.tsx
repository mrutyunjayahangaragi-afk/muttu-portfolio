"use client"

import { motion } from "framer-motion"

interface SectionHeroProps {
  eyebrow: string
  title: string
  description: string
  gradient: string
}

export function SectionHero({ eyebrow, title, description, gradient }: SectionHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-16 text-center"
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-3 font-mono text-xs tracking-[0.25em] text-white/40 uppercase"
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`mb-4 bg-gradient-to-r ${gradient} bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:text-6xl`}
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mx-auto max-w-2xl text-base text-white/50 sm:text-lg"
      >
        {description}
      </motion.p>

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className={`mx-auto mt-8 h-px w-24 bg-gradient-to-r ${gradient} opacity-60`}
      />
    </motion.div>
  )
}
