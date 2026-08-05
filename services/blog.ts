import { createStaticClient } from "@/lib/supabase/server"
import type { Blog } from "@/types"
import { unstable_cache } from "next/cache"

async function fetchBlogs(): Promise<Blog[]> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })

  if (error) return []
  return data
}

export const getCachedBlogs = unstable_cache(
  async () => fetchBlogs(),
  ["blogs"],
  { revalidate: 3600, tags: ["blogs"] }
)

export async function getBlogs(): Promise<Blog[]> {
  return getCachedBlogs()
}

async function fetchBlogBySlug(slug: string): Promise<Blog | null> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (error || !data) return null
  return data
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  return fetchBlogBySlug(slug)
}

export const getCachedBlogBySlug = (slug: string) =>
  unstable_cache(
    async () => fetchBlogBySlug(slug),
    [`blog-${slug}`],
    { revalidate: 3600, tags: ["blogs", `blog-${slug}`] }
  )()
