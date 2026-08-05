import type { Metadata } from "next"
import { getMediaGallery } from "@/services/gallery"
import { GalleryCarousel } from "@/components/sections/gallery/gallery-carousel"
import { EmptyState } from "@/components/ui/empty-state"

export const metadata: Metadata = {
  title: "Media Gallery",
  description: "Browse visual highlights, project screenshots, certificates, and event photos.",
  openGraph: {
    title: "Media Gallery | Developer Portfolio",
    description: "Visual gallery featuring project highlights and media assets.",
  },
}

export const revalidate = 3600

export default async function GalleryPage() {
  const items = await getMediaGallery().catch(() => [])

  return (
    <main className="min-h-screen bg-[#020408] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-2">Visual Showcase</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            Portfolio{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Gallery
            </span>
          </h1>
          <p className="mt-3 text-base text-white/60">
            High-resolution project screenshots, architecture diagrams, and event highlights.
          </p>
        </div>

        {items.length === 0 ? (
          <EmptyState title="Media Gallery" message="Content will be available soon." />
        ) : (
          <GalleryCarousel items={items} />
        )}
      </div>
    </main>
  )
}
