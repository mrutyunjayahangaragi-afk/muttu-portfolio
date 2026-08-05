"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ExternalLink, Code2, ArrowRight, Star, Clock, CheckCircle } from "lucide-react"
import type { Project } from "@/types"
import { cn, formatDate, truncate } from "@/lib/utils"

const CATEGORY_COLORS: Record<string, string> = {
  web:       "from-blue-500 to-cyan-500",
  ai:        "from-purple-500 to-pink-500",
  mobile:    "from-green-500 to-emerald-500",
  backend:   "from-orange-500 to-amber-500",
  fullstack: "from-indigo-500 to-blue-500",
  hackathon: "from-red-500 to-orange-500",
  open_source: "from-teal-500 to-cyan-500",
  ml:        "from-violet-500 to-purple-500",
}

const STATUS_CONFIG = {
  completed:   { icon: CheckCircle, label: "Completed",   cls: "text-green-400 bg-green-400/10 border-green-400/20" },
  in_progress: { icon: Clock,       label: "In Progress", cls: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  archived:    { icon: Clock,       label: "Archived",    cls: "text-white/40 bg-white/5 border-white/10" },
}

interface ProjectCardProps {
  project: Project
  index: number
  variant?: "featured" | "default"
}

export function ProjectCard({ project, index, variant = "default" }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)
  const color = CATEGORY_COLORS[project.category] || CATEGORY_COLORS.web
  const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.completed
  const StatusIcon = status.icon
  const thumb = project.cover_image || project.image_url

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative"
    >
      {/* Glow border */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${color} opacity-0 blur-sm`}
        aria-hidden="true"
      />

      <div className={cn(
        "relative glass rounded-2xl border border-white/10 group-hover:border-white/0",
        "transition-all duration-300 overflow-hidden flex flex-col h-full",
        variant === "featured" ? "border-white/15" : ""
      )}>
        {/* Thumbnail */}
        <div className="relative overflow-hidden aspect-video bg-white/5">
          {thumb ? (
            <Image
              src={thumb}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-20 flex items-center justify-center`}>
              <span className="text-5xl">🚀</span>
            </div>
          )}

          {/* Overlay on hover */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3"
          >
            {(project.live_url || project.live_demo_url) && (
              <a
                href={project.live_url || project.live_demo_url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-3 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all"
                aria-label="Live demo"
              >
                <ExternalLink size={18} />
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-3 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all"
                aria-label="GitHub repository"
              >
                <Code2 size={18} />
              </a>
            )}
          </motion.div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            {project.featured && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gradient-to-r from-yellow-500 to-amber-500 text-black">
                <Star size={9} fill="currentColor" /> Featured
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5">
          {/* Category + Status */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className={`text-xs px-2.5 py-0.5 rounded-full bg-gradient-to-r ${color} bg-clip-text text-transparent font-medium border border-white/10`}>
              {project.category.replace("_", " ")}
            </span>
            <span className={cn("flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border", status.cls)}>
              <StatusIcon size={9} />
              {status.label}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-white mb-2 leading-tight group-hover:text-blue-300 transition-colors">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-white/55 leading-relaxed flex-1 mb-4">
            {truncate(project.short_description || project.description, 120)}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tech_stack.slice(0, 4).map((tech) => (
              <span key={tech} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60">
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 4 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/35">
                +{project.tech_stack.length - 4}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/8">
            <span className="text-xs text-white/35">
              {formatDate(project.created_at, { month: "short", year: "numeric" })}
            </span>
            <Link
              href={`/projects/${project.slug}`}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors group/link"
            >
              View Details
              <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
