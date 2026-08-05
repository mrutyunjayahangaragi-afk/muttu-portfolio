"use client"

import { useState, useTransition } from "react"
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  AlertTriangle,
  Info,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "@/app/admin/(protected)/actions"
import type { SystemNotificationItem } from "@/services/system"

interface NotificationsManagerProps {
  notifications: SystemNotificationItem[]
  unreadCount: number
}

export function NotificationsManager({
  notifications: initialNotifications,
  unreadCount: initialUnread,
}: NotificationsManagerProps) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [unread, setUnread] = useState(initialUnread)
  const [category, setCategory] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [search, setSearch] = useState("")
  const [isPending, startTransition] = useTransition()

  // Filtering
  const filtered = notifications.filter((n) => {
    if (category !== "all" && n.category !== category) return false
    if (priorityFilter !== "all" && n.priority !== priorityFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q)
    }
    return true
  })

  function handleMarkRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setUnread((u) => Math.max(0, u - 1))
    startTransition(async () => {
      await markNotificationRead(id)
    })
  }

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnread(0)
    startTransition(async () => {
      await markAllNotificationsRead()
    })
  }

  function handleDelete(id: string) {
    const item = notifications.find((n) => n.id === id)
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    if (item && !item.read) setUnread((u) => Math.max(0, u - 1))
    startTransition(async () => {
      await deleteNotification(id)
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-amber-400" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-emerald-400" />
      default:
        return <Info className="h-4 w-4 text-blue-400" />
    }
  }

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case "urgent":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "medium":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30"
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Bar Controls */}
      <div className="glass rounded-2xl border border-white/10 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="h-5 w-5 text-white/80" />
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Notification Feed</h3>
              <p className="text-xs text-white/50">{unread} unread notifications requiring attention</p>
            </div>
          </div>

          <Button
            onClick={handleMarkAllRead}
            disabled={unread === 0 || isPending}
            variant="outline"
            size="sm"
            className="border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs gap-1.5"
          >
            <CheckCheck size={14} className="text-blue-400" />
            Mark All Read
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={14} className="text-white/40 shrink-0" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white focus:border-blue-500/50 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="system">System</option>
              <option value="content">Content</option>
              <option value="security">Security</option>
              <option value="messages">Messages</option>
              <option value="backups">Backups</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white focus:border-blue-500/50 focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="glass rounded-2xl border border-white/10 p-12 text-center">
          <Bell className="mx-auto h-8 w-8 text-white/20 mb-3" />
          <h4 className="text-sm font-medium text-white/70">No Notifications Found</h4>
          <p className="text-xs text-white/40 mt-1">There are no notifications matching your current filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`glass rounded-2xl border p-4 transition-all duration-200 ${
                item.read
                  ? "border-white/5 bg-white/[0.02] opacity-75"
                  : "border-blue-500/30 bg-blue-500/5 shadow-lg shadow-blue-500/5"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 shrink-0">{getTypeIcon(item.type)}</div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-semibold text-white truncate">{item.title}</h4>
                      <span
                        className={`rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase ${getPriorityBadge(
                          item.priority
                        )}`}
                      >
                        {item.priority}
                      </span>
                      <span className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/50 uppercase">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">{item.message}</p>
                    <p className="font-mono text-[10px] text-white/30">
                      {new Date(item.created_at).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {item.link && (
                    <a
                      href={item.link}
                      className="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white"
                      title="Open details"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {!item.read && (
                    <button
                      onClick={() => handleMarkRead(item.id)}
                      className="rounded-lg p-1.5 text-blue-400 hover:bg-blue-500/20"
                      title="Mark as Read"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg p-1.5 text-white/30 hover:bg-red-500/20 hover:text-red-400"
                    title="Delete Notification"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
