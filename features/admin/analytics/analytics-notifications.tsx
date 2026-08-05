"use client"

import { Bell, AlertTriangle, CheckCircle, Mail, AlertCircle } from "lucide-react"

interface AnalyticsNotificationsProps {
  unreadMessages: number
  draftProjects: number
  draftBlogs: number
  totalErrorLogs: number
}

export function AnalyticsNotifications({
  unreadMessages,
  draftProjects,
  draftBlogs,
  totalErrorLogs,
}: AnalyticsNotificationsProps) {
  const alerts = []

  if (unreadMessages > 0) {
    alerts.push({
      id: "msg",
      title: `${unreadMessages} Unread Contact Message${unreadMessages > 1 ? "s" : ""}`,
      desc: "New contact form submissions waiting for review in inbox.",
      icon: Mail,
      color: "border-orange-500/30 bg-orange-500/10 text-orange-400",
      href: "/admin/messages",
    })
  }

  if (draftProjects > 0) {
    alerts.push({
      id: "draft-p",
      title: `${draftProjects} Draft Project${draftProjects > 1 ? "s" : ""}`,
      desc: "Projects currently saved as drafts and hidden from live portfolio.",
      icon: AlertCircle,
      color: "border-blue-500/30 bg-blue-500/10 text-blue-400",
      href: "/admin/projects",
    })
  }

  if (draftBlogs > 0) {
    alerts.push({
      id: "draft-b",
      title: `${draftBlogs} Draft Blog Post${draftBlogs > 1 ? "s" : ""}`,
      desc: "Blog posts pending review and publication.",
      icon: AlertCircle,
      color: "border-purple-500/30 bg-purple-500/10 text-purple-400",
      href: "/admin/blog",
    })
  }

  if (totalErrorLogs > 0) {
    alerts.push({
      id: "errors",
      title: `${totalErrorLogs} System Exception Logs`,
      desc: "Exception logs captured during server execution.",
      icon: AlertTriangle,
      color: "border-red-500/30 bg-red-500/10 text-red-400",
      href: "/admin/settings",
    })
  }

  return (
    <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Bell className="h-4 w-4 text-amber-400" />
          Notification Alert Center
        </h3>
        <span className="text-[11px] font-mono text-white/40">{alerts.length} Active Alerts</span>
      </div>

      {alerts.length === 0 ? (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-xs text-emerald-300">
          <CheckCircle size={18} className="shrink-0" />
          <div>
            <p className="font-semibold">All Systems Operational</p>
            <p className="text-[11px] text-emerald-300/70">No pending unread messages, drafts, or critical errors.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alerts.map((item) => {
            const Icon = item.icon
            return (
              <a
                key={item.id}
                href={item.href}
                className={`flex items-start gap-3 rounded-xl border p-3 text-xs transition-all hover:scale-[1.01] ${item.color}`}
              >
                <Icon size={16} className="mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-[11px] opacity-80 line-clamp-1">{item.desc}</p>
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
