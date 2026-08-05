"use client"

import { useTransition } from "react"
import { Globe, EyeOff, Loader2 } from "lucide-react"
import { toggleProjectPublished } from "@/app/admin/(protected)/projects/project-actions"

interface Props { id: string; published: boolean }

export function ProjectPublishToggle({ id, published }: Props) {
  const [isPending, startTransition] = useTransition()
  return (
    <button
      onClick={() => startTransition(async () => { await toggleProjectPublished(id, !published) })}
      disabled={isPending}
      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${
        published
          ? "bg-green-500/10 text-green-400 hover:bg-red-500/10 hover:text-red-400"
          : "bg-white/5 text-white/40 hover:bg-green-500/10 hover:text-green-400"
      }`}
      aria-label={published ? "Unpublish" : "Publish"}
    >
      {isPending ? <Loader2 size={12} className="animate-spin" /> : published ? <Globe size={12} /> : <EyeOff size={12} />}
      {published ? "Live" : "Draft"}
    </button>
  )
}
