"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Clock,
  MessageSquare,
  Archive,
  Reply,
  Paperclip,
  Building,
  Globe,
  Phone,
  BarChart3,
  PieChart,
  Calendar,
  DollarSign,
  TrendingUp,
  X,
  ExternalLink,
  CheckCheck,
} from "lucide-react"
import type { ContactMessage } from "@/types"
import type { MessageStats, MessageAnalytics } from "@/services/messages"
import { updateMessageStatusAction, deleteMessageAction, bulkMessageAction } from "@/app/admin/(protected)/messages/message-actions"

interface MessagesDashboardClientProps {
  initialMessages: ContactMessage[]
  stats: MessageStats
  analytics: MessageAnalytics
}

export function MessagesDashboardClient({
  initialMessages,
  stats,
  analytics,
}: MessagesDashboardClientProps) {
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "read" | "replied" | "archived">("all")
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [replyText, setReplyText] = useState("")
  const [showAnalytics, setShowAnalytics] = useState(false)

  // ─── Filter Logic ─────────────────────────────────────────────────────────────
  const filteredMessages = useMemo(() => {
    const now = new Date()
    const todayStr = now.toISOString().split("T")[0]

    return messages.filter((m) => {
      // 1. Search Query
      const q = search.toLowerCase()
      const nameMatch = (m.full_name || m.name || "").toLowerCase().includes(q)
      const emailMatch = (m.email || "").toLowerCase().includes(q)
      const companyMatch = (m.company || "").toLowerCase().includes(q)
      const subjectMatch = (m.subject || "").toLowerCase().includes(q)
      if (!nameMatch && !emailMatch && !companyMatch && !subjectMatch) return false

      // 2. Status Filter
      const isUnread = !m.is_read && !m.read
      if (statusFilter === "new" && !isUnread && m.status !== "new") return false
      if (statusFilter === "read" && isUnread) return false
      if (statusFilter === "replied" && !m.replied && m.status !== "replied") return false
      if (statusFilter === "archived" && !m.archived && m.status !== "archived") return false

      // 3. Date Filter
      if (dateFilter === "today" && !m.created_at?.startsWith(todayStr)) return false
      if (dateFilter === "week") {
        const itemDate = new Date(m.created_at)
        const diffDays = (now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24)
        if (diffDays > 7) return false
      }
      if (dateFilter === "month") {
        const itemDate = new Date(m.created_at)
        const diffDays = (now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24)
        if (diffDays > 30) return false
      }

      return true
    })
  }, [messages, search, statusFilter, dateFilter])

  // ─── Handlers ──────────────────────────────────────────────────────────────────
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedIds.length === filteredMessages.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredMessages.map((m) => m.id))
    }
  }

  const handleMarkRead = async (id: string, currentRead: boolean) => {
    const res = await updateMessageStatusAction(id, { is_read: !currentRead, status: !currentRead ? "read" : "new" })
    if (res.success) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: !currentRead, read: !currentRead, status: !currentRead ? "read" : "new" } : m))
      )
    }
  }

  const handleMarkReplied = async (id: string) => {
    const res = await updateMessageStatusAction(id, { replied: true, status: "replied" })
    if (res.success) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, replied: true, status: "replied" } : m))
      )
    }
  }

  const handleArchive = async (id: string, currentArchived: boolean) => {
    const res = await updateMessageStatusAction(id, { archived: !currentArchived, status: !currentArchived ? "archived" : "read" })
    if (res.success) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, archived: !currentArchived, status: !currentArchived ? "archived" : "read" } : m))
      )
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return
    const res = await deleteMessageAction(id)
    if (res.success) {
      setMessages((prev) => prev.filter((m) => m.id !== id))
      if (selectedMessage?.id === id) setSelectedMessage(null)
    }
  }

  const handleBulkAction = async (action: "read" | "unread" | "archive" | "delete") => {
    if (selectedIds.length === 0) return
    if (action === "delete" && !confirm(`Are you sure you want to delete ${selectedIds.length} selected messages?`)) return

    const res = await bulkMessageAction(selectedIds, action)
    if (res.success) {
      if (action === "delete") {
        setMessages((prev) => prev.filter((m) => !selectedIds.includes(m.id)))
      } else {
        setMessages((prev) =>
          prev.map((m) => {
            if (!selectedIds.includes(m.id)) return m
            if (action === "read") return { ...m, is_read: true, read: true, status: "read" }
            if (action === "unread") return { ...m, is_read: false, read: false, status: "new" }
            if (action === "archive") return { ...m, archived: true, status: "archived" }
            return m
          })
        )
      }
      setSelectedIds([])
    }
  }

  return (
    <div className="space-y-8 max-w-7xl">
      {/* KPI Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: "Total Messages", val: stats.total, color: "from-blue-500/20 to-purple-500/20", border: "border-blue-500/30" },
          { label: "Unread Leads", val: stats.unreadCount, color: "from-yellow-500/20 to-amber-500/20", border: "border-yellow-500/30" },
          { label: "Replied", val: stats.repliedCount, color: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/30" },
          { label: "Archived", val: stats.archivedCount, color: "from-gray-500/20 to-slate-500/20", border: "border-gray-500/30" },
          { label: "Today's", val: stats.todayCount, color: "from-sky-500/20 to-indigo-500/20", border: "border-sky-500/30" },
          { label: "This Month", val: stats.thisMonthCount, color: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/30" },
        ].map((item) => (
          <div
            key={item.label}
            className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} border ${item.border} backdrop-blur-md`}
          >
            <span className="text-xs font-medium text-white/60 block">{item.label}</span>
            <span className="text-2xl font-bold text-white mt-1 block">{item.val}</span>
          </div>
        ))}
      </div>

      {/* Analytics Toggle Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all"
          >
            <BarChart3 size={14} className="text-blue-400" />
            {showAnalytics ? "Hide Lead Analytics" : "View Lead Analytics"}
          </button>
        </div>
      </div>

      {/* Analytics Expandable Panel */}
      {showAnalytics && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl"
        >
          {/* Project Type Breakdown */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <PieChart size={16} className="text-purple-400" /> Project Types
            </h4>
            <div className="space-y-2">
              {analytics.byProjectType.map((pt) => (
                <div key={pt.type} className="flex items-center justify-between text-xs">
                  <span className="text-white/70">{pt.type}</span>
                  <span className="font-mono text-white/50">{pt.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Countries */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Globe size={16} className="text-blue-400" /> Top Inquiring Countries
            </h4>
            <div className="space-y-2">
              {analytics.topCountries.length === 0 ? (
                <p className="text-xs text-white/40">No country data recorded yet.</p>
              ) : (
                analytics.topCountries.map((c) => (
                  <div key={c.country} className="flex items-center justify-between text-xs">
                    <span className="text-white/70">{c.country}</span>
                    <span className="font-mono text-white/50">{c.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Response Rate */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" /> Response Rate
            </h4>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-emerald-400">{analytics.responseRate}%</div>
              <p className="text-xs text-white/50">Percentage of messages responded to.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search by name, email, company, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-12 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-blue-500/50"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "new", "read", "replied", "archived"] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                statusFilter === st
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-xs text-white"
        >
          <span>Selected {selectedIds.length} message(s)</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction("read")}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Mark Read
            </button>
            <button
              onClick={() => handleBulkAction("archive")}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              Archive
            </button>
            <button
              onClick={() => handleBulkAction("delete")}
              className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              Delete
            </button>
          </div>
        </motion.div>
      )}

      {/* Messages Table */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
        {filteredMessages.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <MessageSquare size={48} className="mx-auto text-white/20" />
            <p className="text-white/50 text-sm">No contact messages found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/70">
              <thead className="border-b border-white/10 bg-white/5 text-xs text-white/50 uppercase tracking-wider">
                <tr>
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredMessages.length && filteredMessages.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-white/20 bg-black/40 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="p-4">Sender</th>
                  <th className="p-4">Subject &amp; Scope</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredMessages.map((msg) => {
                  const isUnread = !msg.is_read && !msg.read
                  const senderName = msg.full_name || msg.name || "Anonymous"

                  return (
                    <tr
                      key={msg.id}
                      className={`hover:bg-white/[0.03] transition-colors cursor-pointer ${
                        isUnread ? "font-semibold text-white bg-blue-500/[0.04]" : ""
                      }`}
                      onClick={() => setSelectedMessage(msg)}
                    >
                      <td className="p-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(msg.id)}
                          onChange={() => handleToggleSelect(msg.id)}
                          className="rounded border-white/20 bg-black/40 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="text-white block font-medium flex items-center gap-1.5">
                            {senderName}
                            {isUnread && (
                              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                            )}
                          </span>
                          <span className="text-xs text-white/40 block">{msg.email}</span>
                          {msg.company && (
                            <span className="text-[10px] text-purple-400 block">{msg.company}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="text-white/90 block line-clamp-1">{msg.subject}</span>
                          <div className="flex items-center gap-2 text-xs text-white/40">
                            {msg.project_type && <span>{msg.project_type}</span>}
                            {msg.budget && (
                              <span className="text-emerald-400 font-mono">({msg.budget})</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {isUnread ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            New
                          </span>
                        ) : msg.replied ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Replied
                          </span>
                        ) : msg.archived ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-gray-500/20 text-gray-400 border border-gray-500/30">
                            Archived
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/10 text-white/60">
                            Read
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-xs text-white/50">
                        {new Date(msg.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleMarkRead(msg.id, !isUnread)}
                            title={isUnread ? "Mark Read" : "Mark Unread"}
                            className="p-2 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            {isUnread ? <CheckCircle size={16} /> : <XCircle size={16} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleArchive(msg.id, Boolean(msg.archived))}
                            title="Archive"
                            className="p-2 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                          >
                            <Archive size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(msg.id)}
                            title="Delete"
                            className="p-2 rounded-lg bg-white/5 text-white/50 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Detail Slide-over Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMessage(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#060a12] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl z-10 my-8 space-y-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedMessage.full_name || selectedMessage.name}
                  </h3>
                  <a href={`mailto:${selectedMessage.email}`} className="text-sm text-blue-400 hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="p-2 rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scope & Contact Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs">
                <div>
                  <span className="text-white/40 block">Phone</span>
                  <span className="text-white font-medium block mt-0.5">{selectedMessage.phone || "N/A"}</span>
                </div>
                <div>
                  <span className="text-white/40 block">Company</span>
                  <span className="text-white font-medium block mt-0.5">{selectedMessage.company || "N/A"}</span>
                </div>
                <div>
                  <span className="text-white/40 block">Country</span>
                  <span className="text-white font-medium block mt-0.5">{selectedMessage.country || "N/A"}</span>
                </div>
                <div>
                  <span className="text-white/40 block">Project Scope</span>
                  <span className="text-purple-400 font-medium block mt-0.5">{selectedMessage.project_type || "N/A"}</span>
                </div>
              </div>

              {/* Subject & Message */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>Subject: <strong className="text-white">{selectedMessage.subject}</strong></span>
                  <span>{new Date(selectedMessage.created_at).toLocaleString()}</span>
                </div>
                <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Attachment Preview */}
              {selectedMessage.attachment_url && (
                <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs">
                  <div className="flex items-center gap-2 text-white">
                    <Paperclip size={16} className="text-blue-400" />
                    <span>File Attachment Available</span>
                  </div>
                  <a
                    href={selectedMessage.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Download / View Attachment <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                  {!selectedMessage.replied && (
                    <button
                      type="button"
                      onClick={() => handleMarkReplied(selectedMessage.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/30"
                    >
                      <CheckCheck size={14} /> Mark as Replied
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20"
                  >
                    <Reply size={14} /> Send Email Reply
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
