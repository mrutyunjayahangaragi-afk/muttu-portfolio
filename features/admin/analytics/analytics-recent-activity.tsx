"use client"

import { useState } from "react"
import {
  FolderKanban,
  BookOpen,
  Award,
  MessageSquare,
  Bot,
  FileText,
  Activity,
} from "lucide-react"
import type { DashboardAnalyticsData } from "@/services/analytics"

interface AnalyticsRecentActivityProps {
  activities: DashboardAnalyticsData["recentActivity"]
}

export function AnalyticsRecentActivity({ activities }: AnalyticsRecentActivityProps) {
  const [filter, setFilter] = useState<string>("all")

  const filtered = activities.filter((act) => {
    if (filter === "all") return true
    return act.category === filter
  })

  const getIcon = (cat: string) => {
    switch (cat) {
      case "project":
        return <FolderKanban size={14} className="text-blue-400" />
      case "blog":
        return <BookOpen size={14} className="text-purple-400" />
      case "certificate":
        return <Award size={14} className="text-amber-400" />
      case "message":
        return <MessageSquare size={14} className="text-orange-400" />
      case "ai":
        return <Bot size={14} className="text-emerald-400" />
      default:
        return <FileText size={14} className="text-cyan-400" />
    }
  }

  return (
    <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-400" />
          Recent Activity Feed
        </h3>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {["all", "project", "blog", "message", "certificate"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-lg px-2.5 py-1 capitalize transition-all ${
                filter === cat
                  ? "bg-blue-600 text-white font-medium shadow-md shadow-blue-500/20"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-8 text-center text-xs text-white/40 border border-dashed border-white/10 rounded-xl">
          No recent activity matches the selected filter.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs transition-colors hover:border-white/15 hover:bg-white/5"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
                  {getIcon(item.category)}
                </div>
                <span className="truncate text-white/90 font-medium">{item.title}</span>
              </div>
              <span className="shrink-0 font-mono text-[10px] text-white/40">{item.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
