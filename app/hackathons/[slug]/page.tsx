import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getHackathonBySlug, getHackathonSlugs, getHackathons } from "@/services/career"
import { HackathonDetail } from "@/features/career/hackathon-detail"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getHackathonSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const h = await getHackathonBySlug(slug)
  if (!h) return { title: "Hackathon Not Found" }

  const eventName = h.event_name || h.name
  return {
    title: eventName,
    description: `${eventName} by ${h.organizer}. ${h.ranking ? `Ranked ${h.ranking}.` : ""} ${h.description.slice(0, 140)}`,
    openGraph: {
      title: eventName,
      description: h.description.slice(0, 200),
      images: h.image_url ? [{ url: h.image_url }] : [],
    },
  }
}

export default async function HackathonDetailPage({ params }: Props) {
  const { slug } = await params
  const [hackathon, allHackathons] = await Promise.all([
    getHackathonBySlug(slug),
    getHackathons().catch(() => []),
  ])

  if (!hackathon) notFound()

  const related = allHackathons
    .filter((h) => h.id !== hackathon.id)
    .slice(0, 3)

  return (
    <main className="min-h-screen pb-24">
      <HackathonDetail hackathon={hackathon} related={related} />
    </main>
  )
}
