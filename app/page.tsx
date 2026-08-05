import { HeroSection } from "@/components/sections/hero"
import { AboutSection } from "@/components/sections/about"
import { SkillsSection } from "@/components/sections/skills"
import { ProjectsSection } from "@/components/sections/projects"
import { GallerySection } from "@/components/sections/gallery"

export default function HomePage() {
  return (
    <div className="overflow-x-hidden bg-[#020408]">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <GallerySection />
    </div>
  )
}
