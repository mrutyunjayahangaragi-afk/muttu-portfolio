"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Trash2, CheckCircle, XCircle, Search, Clock, MessageSquare } from "lucide-react"
import type { ContactMessage } from "@/types"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface MessagesClientProps {
  initialMessages: ContactMessage[]
}

export function MessagesClient({ initialMessages }: MessagesClientProps) {
  const router = useRouter()
  const [messages, setMessages] = useState(initialMessages)
  const [search, setSearch] = useState("")

  const filteredMessages = messages.filter(
    (m) =>
      (m.full_name || m.name || "").toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase())
  )

  const toggleReadStatus = async (id: string, currentRead: boolean) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: !currentRead })
        .eq("id", id)

      if (error) throw error
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: !currentRead, read: !currentRead } : m))
      )
      router.refresh()
    } catch (error) {
      console.error("Failed to update message status", error)
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return
    try {
      const supabase = createClient()
      const { error } = await supabase.from("contact_messages").delete().eq("id", id)
      if (error) throw error
      setMessages((prev) => prev.filter((m) => m.id !== id))
      router.refresh()
    } catch (error) {
      console.error("Failed to delete message", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-12 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/50"
          />
        </div>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {filteredMessages.length === 0 ? (
          <div className="glass flex flex-col items-center justify-center rounded-2xl border border-white/10 p-12 text-center">
            <MessageSquare size={48} className="mb-4 text-white/20" />
            <p className="text-white/50">No messages found.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredMessages.map((msg) => {
              const isRead = Boolean(msg.is_read || msg.read)
              const senderName = msg.full_name || msg.name || "Anonymous"

              return (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className={`glass group relative flex flex-col gap-4 rounded-2xl border p-6 transition-colors sm:flex-row sm:items-start ${
                    isRead ? "border-white/5 bg-white/5" : "border-blue-500/30 bg-blue-500/5"
                  }`}
                >
                  <div className="flex flex-1 flex-col">
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {senderName}
                        {!isRead && (
                          <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">New</span>
                        )}
                      </h3>
                      <span className="flex items-center gap-1.5 text-xs text-white/40">
                        <Clock size={12} />
                        {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mb-4 flex items-center gap-2 text-sm text-white/60">
                      <Mail size={14} />
                      <a href={`mailto:${msg.email}`} className="hover:text-blue-400">
                        {msg.email}
                      </a>
                    </div>

                    <h4 className="mb-2 font-medium text-white/80">{msg.subject}</h4>
                    <p className="whitespace-pre-wrap text-sm text-white/50">{msg.message}</p>
                  </div>

                  <div className="flex items-center gap-2 sm:flex-col">
                    <button
                      onClick={() => toggleReadStatus(msg.id, isRead)}
                      title={isRead ? "Mark as unread" : "Mark as read"}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/50 transition-colors hover:bg-blue-500/20 hover:text-blue-400"
                    >
                      {isRead ? <XCircle size={18} /> : <CheckCircle size={18} />}
                    </button>
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      title="Delete message"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/50 transition-colors hover:bg-red-500/20 hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
