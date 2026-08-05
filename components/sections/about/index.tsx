/**
 * components/sections/about/index.tsx
 *
 * Server Component — fetches all about-page data in one call, then passes it
 * to the individual client sub-components. This keeps the data layer on the
 * server and the animations on the client, with no prop-drilling of Supabase
 * instances.
 */
import { Suspense } from "react"
import { getAboutData } from "@/services/about"
import { AboutContent } from "./about-content"

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function AboutSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="flex justify-center">
          <div className="w-64 h-64 rounded-full bg-white/5" />
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-white/5 rounded-xl w-48" />
          <div className="h-4 bg-white/5 rounded-xl w-full" />
          <div className="h-4 bg-white/5 rounded-xl w-4/5" />
        </div>
      </div>
    </div>
  )
}

// ─── Data fetcher ─────────────────────────────────────────────────────────────

async function AboutData() {
  const data = await getAboutData()
  return (
    <>
      <AboutContent {...data} />
      {/* SkillsPreview is a Server Component — rendered here, not inside the Client Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <SkillsPreviewSection />
      </div>
    </>
  )
}

async function SkillsPreviewSection() {
  const { SkillsPreview } = await import("./skills-preview")
  return <SkillsPreview />
}

// ─── Public export ────────────────────────────────────────────────────────────

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative bg-[#020408] overflow-hidden"
      aria-label="About me"
    >
      {/* Section background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]"
          style={{ background: "radial-gradient(ellipse, #a855f7, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-10 blur-[100px]"
          style={{ background: "radial-gradient(ellipse, #3b82f6, transparent 70%)" }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <Suspense fallback={<AboutSkeleton />}>
        <AboutData />
      </Suspense>
    </section>
  )
}
