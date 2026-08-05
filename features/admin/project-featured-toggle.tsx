"use client"

import { useTransition } from "react"
import { Star, Loader2 } from "lucide-react"
import { toggleProjectFeatured } from "@/app/admin/(protected)/projects/project-actions"

interface Props { id: string; featured: boolean }

export function ProjectFeaturedToggle({ id, featured }: Props) {
  const [isPending, startTransition] = useTransition()
  return (
    <button
      onClick={() => startTransition(async () => { await toggleProjectFeatured(id, !featured) })}
      disabled={isPending}
      className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
        featured ? "text-yellow-400 hover:bg-yellow-500/10" : "text-white/30 hover:text-yellow-400 hover:bg-yellow-500/10"
      }`}
      aria-label={featured ? "Unfeature project" : "Feature project"}
      title={featured ? "Remove from featured" : "Mark as featured"}
    >
      {isPending ? <Loader2 size={14} className="animate-spin" /> : <Star size={14} fill={featured ? "currentColor" : "none"} />}
    </button>
  )
}
