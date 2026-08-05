/**
 * components/sections/hero/index.tsx
 *
 * Server Component — fetches hero profile + stats from the database,
 * then passes them as props to the client island (HeroContent).
 * Zero hardcoded personal data.
 */
import { Suspense } from "react"
import { getHeroProfile, getHeroStats } from "@/services/hero"
import { HeroContent } from "./hero-content"

async function HeroData() {
  const [profile, stats] = await Promise.all([
    getHeroProfile(),
    getHeroStats(),
  ])
  return <HeroContent profile={profile} stats={stats} />
}

export function HeroSection() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020408]" />}>
      <HeroData />
    </Suspense>
  )
}
