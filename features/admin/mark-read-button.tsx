"use client"

import { useTransition } from "react"
import { MailOpen, Mail, Loader2 } from "lucide-react"
import { markMessageRead } from "@/app/admin/(protected)/actions"

interface MarkReadButtonProps {
  id: string
  read: boolean
}

export function MarkReadButton({ id, read }: MarkReadButtonProps) {
  const [isPending, startTransition] = useTransition()

  function toggle() {
    startTransition(async () => {
      await markMessageRead(id, !read)
    })
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className="rounded-lg p-2 text-white/50 transition-colors hover:bg-blue-500/10 hover:text-blue-400 disabled:opacity-50"
      aria-label={read ? "Mark as unread" : "Mark as read"}
      title={read ? "Mark as unread" : "Mark as read"}
    >
      {isPending ? (
        <Loader2 size={15} className="animate-spin" />
      ) : read ? (
        <Mail size={15} />
      ) : (
        <MailOpen size={15} />
      )}
    </button>
  )
}
