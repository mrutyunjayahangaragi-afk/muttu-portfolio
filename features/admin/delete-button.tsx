"use client"

import { useState, useTransition } from "react"
import { Trash2, Loader2, AlertTriangle } from "lucide-react"
import type { ActionResult } from "@/types/actions"

interface DeleteButtonProps {
  id: string
  action: (id: string) => Promise<ActionResult>
  label: string
  size?: "sm" | "default"
}

/**
 * Reusable delete button with a two-step confirmation popover.
 * Calls any Server Action that accepts (id: string).
 */
export function DeleteButton({ id, action, label, size = "default" }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)

  function handleDelete() {
    startTransition(async () => {
      await action(id)
      setConfirming(false)
    })
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-2 py-1">
        <AlertTriangle size={12} className="shrink-0 text-red-400" />
        <span className="text-xs text-red-400">Delete {label}?</span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="ml-1 text-xs font-medium text-red-400 hover:text-red-300 disabled:opacity-50"
        >
          {isPending ? <Loader2 size={12} className="animate-spin" /> : "Yes"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="text-xs text-white/40 hover:text-white/70"
        >
          No
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      disabled={isPending}
      className={`rounded-lg text-white/50 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50 ${
        size === "sm" ? "p-1.5" : "p-2"
      }`}
      aria-label={`Delete ${label}`}
    >
      <Trash2 size={size === "sm" ? 13 : 15} />
    </button>
  )
}
