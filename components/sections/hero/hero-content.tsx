"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { HeroBackground } from "./hero-background"
import { HeroLeft } from "./hero-left"
import { HeroRight } from "./hero-right"
import { ScrollIndicator } from "./scroll-indicator"
import type { HeroProfile, HeroStat } from "@/types/hero"

interface HeroContentProps {
  profile: HeroProfile | null
  stats: HeroStat[]
}

export function HeroContent({ profile, stats }: HeroContentProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const contentY       = useTransform(scrollYProgress, [0, 1], ["0%", "15%"])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen w-full overflow-hidden"
      aria-label="Hero section"
    >
      <HeroBackground />
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex min-h-screen items-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[calc(100vh-80px)]">
            <HeroLeft profile={profile} stats={stats} />
            <div className="h-[400px] lg:h-[600px]">
              <HeroRight />
            </div>
          </div>
        </div>
      </motion.div>
      <ScrollIndicator />
    </section>
  )
}
