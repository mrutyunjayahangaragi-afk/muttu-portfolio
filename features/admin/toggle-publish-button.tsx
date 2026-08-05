"use client"

import { useTransition } from "react"
import { Globe, EyeOff, Loader2 } from "lucide-react"
import { toggleBlogPublished } from "@/app/admin/(protected)/actions"

interface TogglePublishButtonProps {
  id: string
  published: boolean
}

export function TogglePublishButton({ id, published }: TogglePublishButtonProps) {
  const [isPending, startTransition] = useTransition()

  function toggle() {
    startTransition(async () => {
      await toggleBlogPublished(id, !published)
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all disabled:opacity-50 ${
        published
          ? "bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400"
          : "bg-white/5 text-white/50 hover:bg-green-500/10 hover:text-green-400"
      }`}
      aria-label={published ? "Unpublish post" : "Publish post"}
    >
      {isPending ? (
        <Loader2 size={12} className="animate-spin" />
      ) : published ? (
        <Globe size={12} />
      ) : (
        <EyeOff size={12} />
      )}
      {published ? "Published" : "Draft"}
    </button>
  )
}
