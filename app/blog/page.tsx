import { Metadata } from "next"
import { BlogClient } from "@/features/blog/blog-client"
import { getCachedBlogs } from "@/services/blog"

export const metadata: Metadata = {
  title: "Blog | Professional Portfolio",
  description: "Read my latest articles on software engineering, design, and technology.",
}

export default async function BlogPage() {
  const blogs = await getCachedBlogs()
  return <BlogClient initialBlogs={blogs} />
}
