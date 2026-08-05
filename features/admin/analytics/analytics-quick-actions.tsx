"use client"

import Link from "next/link"
import {
  Plus,
  FolderKanban,
  Wrench,
  BookOpen,
  FileText,
  Award,
  Trophy,
  MessageSquare,
  Settings,
  Sparkles,
} from "lucide-react"

export function AnalyticsQuickActions() {
  const actions = [
    {
      label: "Add Project",
      href: "/admin/projects/new",
      icon: FolderKanban,
      color: "hover:border-blue-500/50 hover:bg-blue-500/10 text-blue-400",
    },
    {
      label: "Add Skill",
      href: "/admin/skills",
      icon: Wrench,
      color: "hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400",
    },
    {
      label: "Write Blog",
      href: "/admin/blog/new",
      icon: BookOpen,
      color: "hover:border-purple-500/50 hover:bg-purple-500/10 text-purple-400",
    },
    {
      label: "Upload Resume",
      href: "/admin/resume",
      icon: FileText,
      color: "hover:border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400",
    },
    {
      label: "Add Certificate",
      href: "/admin/certificates/new",
      icon: Award,
      color: "hover:border-amber-500/50 hover:bg-amber-500/10 text-amber-400",
    },
    {
      label: "Add Hackathon",
      href: "/admin/hackathons/new",
      icon: Trophy,
      color: "hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-400",
    },
    {
      label: "Inbox Messages",
      href: "/admin/messages",
      icon: MessageSquare,
      color: "hover:border-orange-500/50 hover:bg-orange-500/10 text-orange-400",
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: Settings,
      color: "hover:border-indigo-500/50 hover:bg-indigo-500/10 text-indigo-400",
    },
  ]

  return (
    <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          Quick Actions Shortcuts
        </h3>
        <span className="text-[11px] text-white/40 font-mono">1-Click Navigation</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
        {actions.map((act) => {
          const Icon = act.icon
          return (
            <Link
              key={act.label}
              href={act.href}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-center transition-all duration-200 ${act.color} group`}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 transition-transform duration-200 group-hover:scale-110">
                <Icon size={16} />
              </div>
              <span className="text-xs font-medium text-white/80 group-hover:text-white truncate w-full">
                {act.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
