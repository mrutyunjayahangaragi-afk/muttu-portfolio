"use client"

import { useTransition } from "react"
import { Star, Loader2 } from "lucide-react"
import { toggleSkillFeatured } from "@/app/admin/(protected)/skills/skill-actions"

interface SkillFeaturedToggleProps {
  id: string
  featured: boolean
}

export function SkillFeaturedToggle({ id, featured }: SkillFeaturedToggleProps) {
  const [isPending, startTransition] = useTransition()

  function toggle() {
    startTransition(async () => {
      await toggleSkillFeatured(id, !featured)
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
        featured
          ? "text-yellow-400 hover:bg-yellow-500/10"
          : "text-white/30 hover:text-yellow-400 hover:bg-yellow-500/10"
      }`}
      aria-label={featured ? "Remove from featured" : "Mark as featured"}
      title={featured ? "Remove from featured" : "Mark as featured"}
    >
      {isPending ? (
        <Loader2 size={13} className="animate-spin" />
      ) : (
        <Star size={13} fill={featured ? "currentColor" : "none"} />
      )}
    </button>
  )
}
