import { HeroSection } from "@/components/sections/hero"
import { AboutSection } from "@/components/sections/about"
import { SkillsSection } from "@/components/sections/skills"
import { ProjectsSection } from "@/components/sections/projects"
import { ExperienceSection } from "@/components/sections/experience"
import { EducationSection } from "@/components/sections/education"
import { CertificatesSection } from "@/components/sections/certificates"
import { HackathonsSection } from "@/components/sections/hackathons"
import { AchievementsSection } from "@/components/sections/achievements"
import { LeadershipSection } from "@/components/sections/leadership"
import { VolunteeringSection } from "@/components/sections/volunteering"
import { BlogSection } from "@/components/sections/blog"
import { GallerySection } from "@/components/sections/gallery"
import { ContactSection } from "@/components/sections/contact"

export const revalidate = 3600

export default function HomePage() {
  return (
    <div className="overflow-x-hidden bg-[#020408]">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. About Me */}
      <AboutSection />

      {/* 3. Skills */}
      <SkillsSection />

      {/* 4. Featured Projects */}
      <ProjectsSection />

      {/* 5. Experience Timeline */}
      <ExperienceSection />

      {/* 6. Education */}
      <EducationSection />

      {/* 7. Certificates */}
      <CertificatesSection />

      {/* 8. Hackathons */}
      <HackathonsSection />

      {/* 9. Achievements */}
      <AchievementsSection />

      {/* 10. Leadership */}
      <LeadershipSection />

      {/* 11. Volunteering */}
      <VolunteeringSection />

      {/* 12. Blog */}
      <BlogSection />

      {/* 13. Gallery */}
      <GallerySection />

      {/* 14. Contact */}
      <ContactSection />
    </div>
  )
}
