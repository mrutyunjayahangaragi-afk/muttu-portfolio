import { createStaticClient } from "@/lib/supabase/server"
import type { MediaItem } from "@/types"
import { unstable_cache } from "next/cache"

async function fetchMediaGallery(): Promise<MediaItem[]> {
  const supabase = createStaticClient()
  const { data, error } = await supabase
    .from("media_gallery")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return []
  return (data as MediaItem[]) ?? []
}

export const getCachedMediaGallery = unstable_cache(
  async () => fetchMediaGallery(),
  ["media-gallery-public"],
  { revalidate: 3600, tags: ["gallery", "media_gallery"] }
)

export async function getMediaGallery(): Promise<MediaItem[]> {
  return getCachedMediaGallery()
}
