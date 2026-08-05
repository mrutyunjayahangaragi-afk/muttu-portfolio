import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCachedBlogBySlug } from "@/services/blog"
import { BlogDetail } from "@/features/blog/blog-detail"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const blog = await getCachedBlogBySlug(slug)
  
  if (!blog) {
    return {
      title: "Blog Not Found",
    }
  }

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: `${blog.title} | Technical Blog`,
      description: blog.excerpt,
      images: blog.cover_image ? [{ url: blog.cover_image }] : [],
      type: "article",
      publishedTime: blog.created_at,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: blog.cover_image ? [blog.cover_image] : [],
    },
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const blog = await getCachedBlogBySlug(slug)
  
  if (!blog) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    datePublished: blog.created_at,
    dateModified: blog.updated_at,
    image: blog.cover_image || undefined,
    author: {
      "@type": "Person",
      name: "Developer",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogDetail blog={blog} />
    </>
  )
}
