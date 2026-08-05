import { getMediaGallery } from "@/services/gallery"
import { GalleryCarousel } from "./gallery-carousel"

export async function GallerySection() {
  const items = await getMediaGallery()

  return (
    <section id="gallery" className="py-24 relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-2">
            Visual Highlights
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Portfolio <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Gallery</span>
          </h2>
          <p className="mt-3 text-base text-white/50">
            A curated showcase of project screenshots, certificates, and event highlights.
          </p>
        </div>

        {/* Carousel Container */}
        <GalleryCarousel items={items} />
      </div>
    </section>
  )
}
