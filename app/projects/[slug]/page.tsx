import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getProjectBySlug, getRelatedProjects, getProjectSlugs } from "@/services/projects"
import { ProjectDetail } from "@/features/projects/project-detail"

// ─── Static params for pre-rendering ─────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await getProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

// ─── Dynamic metadata ─────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) return { title: "Project Not Found" }

  const description = project.short_description || project.description
  const image = project.cover_image || project.image_url

  return {
    title: project.title,
    description,
    openGraph: {
      title: `${project.title} | Dev Portfolio`,
      description,
      images: image ? [{ url: image, width: 1200, height: 630, alt: project.title }] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
      images: image ? [image] : [],
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params
  const [project, related] = await Promise.all([
    getProjectBySlug(slug),
    getProjectBySlug(slug).then((p) =>
      p ? getRelatedProjects(p.id, p.category) : []
    ),
  ])

  if (!project) notFound()

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.short_description || project.description,
    url: project.live_url || project.live_demo_url,
    applicationCategory: "WebApplication",
    dateCreated: project.created_at,
    dateModified: project.updated_at,
    author: {
      "@type": "Person",
      name: process.env.NEXT_PUBLIC_SITE_NAME || "Developer",
    },
    ...(project.github_url && { codeRepository: project.github_url }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectDetail project={project} related={related} />
    </>
  )
}
