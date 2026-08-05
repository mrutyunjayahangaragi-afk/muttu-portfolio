import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCachedBlogBySlug } from "@/services/blog"
import { BlogDetail } from "@/features/blog/blog-detail"

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getCachedBlogBySlug(params.slug)
  
  if (!blog) {
    return {
      title: "Blog Not Found | Professional Portfolio",
    }
  }

  return {
    title: `${blog.title} | Professional Portfolio`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.cover_image ? [{ url: blog.cover_image }] : [],
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
  const blog = await getCachedBlogBySlug(params.slug)
  
  if (!blog) {
    notFound()
  }

  return <BlogDetail blog={blog} />
}
