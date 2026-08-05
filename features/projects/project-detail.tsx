"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ExternalLink, Code2, FileText, Download, ArrowLeft, ArrowRight,
  CheckCircle, Clock, Star, Share2, Heart, Copy, Calendar, Users, GitBranch,
} from "lucide-react"
import type { ProjectWithRelations, Project } from "@/types"
import { formatDate, cn } from "@/lib/utils"
import { ProjectCard } from "@/components/sections/projects/project-card"

const CATEGORY_COLORS: Record<string, string> = {
  web:         "from-blue-500 to-cyan-500",
  ai:          "from-purple-500 to-pink-500",
  mobile:      "from-green-500 to-emerald-500",
  backend:     "from-orange-500 to-amber-500",
  fullstack:   "from-indigo-500 to-blue-500",
  hackathon:   "from-red-500 to-orange-500",
  open_source: "from-teal-500 to-cyan-500",
  ml:          "from-violet-500 to-purple-500",
}

const STATUS_CONFIG = {
  completed:   { icon: CheckCircle, label: "Completed",   cls: "text-green-400 bg-green-400/10 border-green-400/20" },
  in_progress: { icon: Clock,       label: "In Progress", cls: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  archived:    { icon: Clock,       label: "Archived",    cls: "text-white/40 bg-white/5 border-white/10" },
}

interface ProjectDetailProps {
  project: ProjectWithRelations
  related: Project[]
}

export function ProjectDetail({ project, related }: ProjectDetailProps) {
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [galleryIdx, setGalleryIdx] = useState(0)

  const color = CATEGORY_COLORS[project.category] || CATEGORY_COLORS.web
  const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.completed
  const StatusIcon = status.icon
  const thumb = project.cover_image || project.image_url
  const allImages = [
    ...(thumb ? [{ image_url: thumb, caption: project.title, id: "cover", project_id: project.id, display_order: -1, created_at: "" }] : []),
    ...project.gallery,
  ]

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-[#020408] pt-20 pb-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className={`absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b ${color} opacity-[0.04] blur-3xl`} />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          {/* Cover image */}
          {thumb && (
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-8 border border-white/10">
              <Image src={thumb} alt={project.title} fill className="object-cover" priority sizes="100vw" />
              <div className={`absolute inset-0 bg-gradient-to-t ${color} opacity-10`} />
            </div>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={cn("text-xs px-3 py-1 rounded-full border", status.cls, "flex items-center gap-1")}>
              <StatusIcon size={11} />
              {status.label}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/55 capitalize">
              {project.category.replace("_", " ")}
            </span>
            {project.featured && (
              <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400">
                <Star size={11} fill="currentColor" /> Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{project.title}</h1>

          {/* Description */}
          <p className="text-lg text-white/65 leading-relaxed mb-6">
            {project.short_description || project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech_stack.map((tech) => (
              <span key={tech} className="text-xs px-3 py-1.5 rounded-full glass border border-white/10 text-white/70">
                {tech}
              </span>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            {(project.live_url || project.live_demo_url) && (
              <a href={project.live_url || project.live_demo_url || "#"} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20">
                <ExternalLink size={16} /> Live Demo
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/15 text-white text-sm font-medium hover:bg-white/10 transition-all">
                <Code2 size={16} /> GitHub
              </a>
            )}
            {project.documentation_url && (
              <a href={project.documentation_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl glass border border-white/10 text-white/70 text-sm hover:bg-white/8 transition-all">
                <FileText size={16} /> Docs
              </a>
            )}
            {project.pdf_url && (
              <a href={project.pdf_url} download
                className="flex items-center gap-2 px-5 py-3 rounded-xl glass border border-white/10 text-white/70 text-sm hover:bg-white/8 transition-all">
                <Download size={16} /> PDF
              </a>
            )}
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 text-sm text-white/45">
            <span className="flex items-center gap-1.5"><Calendar size={14} />
              {formatDate(project.created_at, { month: "long", year: "numeric" })}
            </span>
            {project.duration && (
              <span className="flex items-center gap-1.5"><Clock size={14} />{project.duration}</span>
            )}
            {project.team_size > 0 && (
              <span className="flex items-center gap-1.5"><Users size={14} />{project.team_size} member{project.team_size !== 1 ? "s" : ""}</span>
            )}
            {project.version && (
              <span className="flex items-center gap-1.5"><GitBranch size={14} />v{project.version}</span>
            )}
          </div>
        </motion.div>

        {/* Full description */}
        {(project.full_description || project.long_description) && (
          <Section title="About This Project">
            <div className="text-white/65 leading-relaxed space-y-4">
              {(project.full_description || project.long_description || "")
                .split("\n\n")
                .map((para, i) => <p key={i}>{para}</p>)}
            </div>
          </Section>
        )}

        {/* Gallery */}
        {allImages.length > 1 && (
          <Section title="Gallery">
            <div className="relative">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 mb-3">
                <Image
                  src={allImages[galleryIdx]?.image_url}
                  alt={allImages[galleryIdx]?.caption || ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setGalleryIdx((i) => (i - 1 + allImages.length) % allImages.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/50 text-white hover:bg-black/70 transition-colors"
                      aria-label="Previous image"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <button
                      onClick={() => setGalleryIdx((i) => (i + 1) % allImages.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-black/50 text-white hover:bg-black/70 transition-colors"
                      aria-label="Next image"
                    >
                      <ArrowRight size={18} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {allImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setGalleryIdx(i)}
                          className={cn("w-2 h-2 rounded-full transition-all", i === galleryIdx ? "bg-white w-4" : "bg-white/40")}
                          aria-label={`Image ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-2">
                {allImages.slice(0, 5).map((img, i) => (
                  <button key={i} onClick={() => setGalleryIdx(i)}
                    className={cn("relative aspect-video rounded-xl overflow-hidden border transition-all",
                      i === galleryIdx ? "border-blue-500" : "border-white/10 hover:border-white/25")}>
                    <Image src={img.image_url} alt={img.caption || ""} fill className="object-cover" sizes="160px" />
                  </button>
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* Video */}
        {project.videos.length > 0 && (
          <Section title="Video Demo">
            <div className="space-y-4">
              {project.videos.map((video) => (
                <div key={video.id} className="rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black">
                  {video.video_type === "youtube" ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYouTubeId(video.video_url)}`}
                      title={video.title || "Video demo"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : video.video_type === "vimeo" ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${extractVimeoId(video.video_url)}`}
                      title={video.title || "Video demo"}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : (
                    <video controls className="w-full h-full" preload="metadata">
                      <source src={video.video_url} type="video/mp4" />
                    </video>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Features */}
        {project.features.length > 0 && (
          <Section title="Key Features">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.features.map((feat, i) => (
                <motion.div
                  key={feat.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="glass rounded-xl p-4 border border-white/10 flex items-start gap-3"
                >
                  <span className="text-2xl shrink-0 mt-0.5">{feat.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">{feat.title}</p>
                    <p className="text-xs text-white/55 leading-relaxed">{feat.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>
        )}

        {/* Architecture */}
        {project.architecture_image && (
          <Section title="Architecture Diagram">
            <div className="relative rounded-2xl overflow-hidden border border-white/10">
              <Image
                src={project.architecture_image}
                alt="Architecture diagram"
                width={900}
                height={500}
                className="w-full object-contain bg-white/5"
              />
            </div>
          </Section>
        )}

        {/* Timeline */}
        {project.timeline.length > 0 && (
          <Section title="Development Timeline">
            <div className="space-y-4">
              {project.timeline.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex gap-4 items-start"
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} shrink-0 flex items-center justify-center text-xs font-bold text-white z-10`}>
                      {i + 1}
                    </div>
                    {i < project.timeline.length - 1 && (
                      <div className="w-px flex-1 bg-white/10 mt-1" style={{ minHeight: 24 }} />
                    )}
                  </div>
                  <div className="pb-4 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{item.milestone}</p>
                      {item.milestone_date && (
                        <span className="text-xs text-white/35">
                          {formatDate(item.milestone_date, { month: "short", year: "numeric" })}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-white/55 mt-1 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>
        )}

        {/* Tags */}
        {(project.tags ?? []).length > 0 && (
          <Section title="Tags">
            <div className="flex flex-wrap gap-2">
              {(project.tags ?? []).map((tag) => (
                <Link
                  key={tag}
                  href={`/projects?tag=${tag}`}
                  className="text-sm px-3 py-1.5 rounded-full glass border border-white/10 text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </Section>
        )}

        {/* Like & Share */}
        <div className="flex items-center gap-3 py-8 border-t border-b border-white/10 my-10">
          <button
            onClick={() => setLiked(!liked)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all text-sm font-medium",
              liked
                ? "bg-red-500/20 border border-red-500/30 text-red-400"
                : "glass border border-white/10 text-white/60 hover:text-white hover:bg-white/10"
            )}
            aria-label={liked ? "Unlike project" : "Like project"}
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
            {liked ? "Liked!" : "Like"}
          </button>
          <button
            onClick={copyLink}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm"
            aria-label="Copy link"
          >
            <Copy size={16} />
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-white/10 text-white/60 hover:text-blue-400 hover:bg-blue-500/10 transition-all text-sm"
          >
            <Share2 size={16} />
            Share
          </a>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <Section title="Related Projects">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          </Section>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-8">
          <Link
            href="/projects"
            className="flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            All Projects
          </Link>
        </div>
      </div>
    </main>
  )
}

// ─── Section wrapper ─────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="mb-12"
      aria-label={title}
    >
      <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
        <span className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
        {title}
      </h2>
      {children}
    </motion.section>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractYouTubeId(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match?.[1] ?? ""
}

function extractVimeoId(url: string): string {
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match?.[1] ?? ""
}
