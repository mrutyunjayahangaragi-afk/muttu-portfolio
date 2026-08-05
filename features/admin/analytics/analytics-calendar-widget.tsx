"use client"

import { Calendar as CalendarIcon, Trophy, Award, BookOpen, Clock } from "lucide-react"
import type { DashboardAnalyticsData } from "@/services/analytics"

interface AnalyticsCalendarWidgetProps {
  events: DashboardAnalyticsData["calendarEvents"]
}

export function AnalyticsCalendarWidget({ events }: AnalyticsCalendarWidgetProps) {
  const getEventBadge = (type: string) => {
    switch (type) {
      case "hackathon":
        return { icon: Trophy, color: "text-rose-400 border-rose-500/20 bg-rose-500/10" }
      case "certificate":
        return { icon: Award, color: "text-amber-400 border-amber-500/20 bg-amber-500/10" }
      case "blog":
        return { icon: BookOpen, color: "text-purple-400 border-purple-500/20 bg-purple-500/10" }
      default:
        return { icon: Clock, color: "text-blue-400 border-blue-500/20 bg-blue-500/10" }
    }
  }

  return (
    <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-purple-400" />
          Calendar &amp; Upcoming Deadlines
        </h3>
        <span className="text-[11px] font-mono text-white/40">{events.length} Scheduled Items</span>
      </div>

      {events.length === 0 ? (
        <div className="py-8 text-center text-xs text-white/40 border border-dashed border-white/10 rounded-xl">
          No upcoming deadlines or scheduled events.
        </div>
      ) : (
        <div className="space-y-2.5">
          {events.map((evt) => {
            const badge = getEventBadge(evt.type)
            const BadgeIcon = badge.icon
            return (
              <div
                key={evt.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs transition-colors hover:border-white/15 hover:bg-white/5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${badge.color}`}>
                    <BadgeIcon size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{evt.title}</p>
                    <p className="text-[11px] text-white/50 truncate">{evt.subtitle}</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] text-white/70">
                  {evt.date}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
