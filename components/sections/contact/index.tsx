import { Suspense } from "react"
import { getCachedSettings, getCachedSocialLinks, getCachedLatestResume } from "@/services/settings"
import { ContactClient } from "@/features/contact/contact-client"

async function ContactData() {
  const [settings, socialLinks, latestResume] = await Promise.all([
    getCachedSettings().catch(() => null),
    getCachedSocialLinks().catch(() => []),
    getCachedLatestResume().catch(() => null),
  ])

  return (
    <ContactClient
      settings={settings}
      socialLinks={socialLinks}
      latestResume={latestResume}
    />
  )
}

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative bg-[#020408] overflow-hidden border-t border-white/5"
      aria-label="Contact Section"
    >
      <Suspense fallback={<div className="min-h-[500px] animate-pulse bg-white/5" />}>
        <ContactData />
      </Suspense>
    </section>
  )
}
