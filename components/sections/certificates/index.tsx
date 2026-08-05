import { Suspense } from "react"
import { getCertificates } from "@/services/career"
import { FeaturedCertificatesSection } from "@/features/career/featured-certificates-section"

async function CertificatesData() {
  const certificates = await getCertificates().catch(() => [])

  if (certificates.length === 0) return null

  return <FeaturedCertificatesSection certificates={certificates} />
}

export function CertificatesSection() {
  return (
    <section
      id="certificates"
      className="relative bg-[#020408] overflow-hidden py-24 border-t border-white/5"
      aria-label="Certificates"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="h-64 animate-pulse bg-white/5 rounded-2xl" />}>
          <CertificatesData />
        </Suspense>
      </div>
    </section>
  )
}
