import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCertificateBySlug, getCertificateSlugs, getCertificates } from "@/services/career"
import { CertificateDetail } from "@/features/career/certificate-detail"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getCertificateSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cert = await getCertificateBySlug(slug)
  if (!cert) return { title: "Certificate Not Found" }

  return {
    title: cert.title,
    description: `${cert.title} — Issued by ${cert.issuer}. View credential details and verification.`,
    openGraph: {
      title: cert.title,
      description: `Certificate from ${cert.issuer}`,
      images: cert.image_url ? [{ url: cert.image_url }] : [],
    },
  }
}

export default async function CertificateDetailPage({ params }: Props) {
  const { slug } = await params
  const [cert, allCerts] = await Promise.all([
    getCertificateBySlug(slug),
    getCertificates().catch(() => []),
  ])

  if (!cert) notFound()

  // Related: same category, different id
  const related = allCerts
    .filter((c) => c.id !== cert.id && c.category === cert.category)
    .slice(0, 3)

  return (
    <main className="min-h-screen pb-24 pt-24">
      <CertificateDetail certificate={cert} related={related} />
    </main>
  )
}
