import { Suspense } from "react"
import { getHeroProfile, getHeroStats, getHero3DConfig, getHero3DContent } from "@/services/hero"
import { HeroContent } from "./hero-content"

async function HeroData() {
  const [profile, stats, hero3DConfig, hero3DContent] = await Promise.all([
    getHeroProfile().catch(() => null),
    getHeroStats().catch(() => []),
    getHero3DConfig(),
    getHero3DContent(),
  ])

  return (
    <HeroContent
      profile={profile}
      stats={stats}
      hero3DConfig={hero3DConfig}
      hero3DContent={hero3DContent}
    />
  )
}

export function HeroSection() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020408]" />}>
      <HeroData />
    </Suspense>
  )
}
