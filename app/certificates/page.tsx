import type { Metadata } from "next"
import { getCertificates } from "@/services/career"
import { CertificatesClient } from "@/features/career/certificates-client"
import { SectionHero } from "@/features/career/section-hero"
import { EmptyState } from "@/components/ui/empty-state"

export const metadata: Metadata = {
  title: "Certificates",
  description:
    "Professional certificates and credentials I have earned — verified, downloadable, and filterable by category and skill.",
  openGraph: {
    title: "Certificates & Credentials",
    description: "Professional certifications earned across cloud, AI, web dev, and more.",
  },
}

export const revalidate = 3600

export default async function CertificatesPage() {
  const certificates = await getCertificates().catch(() => [])

  return (
    <main className="min-h-screen px-4 pb-24 pt-24">
      <div className="mx-auto max-w-7xl">
        <SectionHero
          eyebrow="Credentials"
          title="Certificates"
          description="Professional certificates and credentials I've earned — verified, filterable, and downloadable."
          gradient="from-emerald-400 via-teal-400 to-cyan-400"
        />
        {certificates.length === 0 ? (
          <EmptyState title="Certificates" message="Content will be available soon." />
        ) : (
          <CertificatesClient certificates={certificates} />
        )}
      </div>
    </main>
  )
}
