"use client"

import { useState } from "react"
import { Search, X, FolderKanban, BookOpen, Wrench, Award, MessageSquare } from "lucide-react"

interface SearchItem {
  id: string
  title: string
  type: "Project" | "Blog" | "Skill" | "Certificate" | "Message"
  href: string
}

interface AnalyticsSearchFilterProps {
  items: SearchItem[]
}

export function AnalyticsSearchFilter({ items }: AnalyticsSearchFilterProps) {
  const [query, setQuery] = useState("")

  const filtered = query.trim()
    ? items.filter(
        (i) =>
          i.title.toLowerCase().includes(query.toLowerCase()) ||
          i.type.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Project":
        return <FolderKanban size={14} className="text-blue-400" />
      case "Blog":
        return <BookOpen size={14} className="text-purple-400" />
      case "Skill":
        return <Wrench size={14} className="text-emerald-400" />
      case "Certificate":
        return <Award size={14} className="text-amber-400" />
      default:
        return <MessageSquare size={14} className="text-orange-400" />
    }
  }

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 h-4 w-4 text-white/40" />
        <input
          type="text"
          placeholder="Search projects, blogs, skills, certificates, messages..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-black/40 pl-10 pr-9 py-2.5 text-xs text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 text-white/40 hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {query.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-xl border border-white/15 bg-neutral-950/95 p-2 shadow-2xl backdrop-blur-xl">
          {filtered.length === 0 ? (
            <p className="p-3 text-center text-xs text-white/40">No matching portfolio items found.</p>
          ) : (
            <div className="space-y-1">
              {filtered.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-xs transition-colors hover:bg-white/10"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {getTypeIcon(item.type)}
                    <span className="truncate text-white/90 font-medium">{item.title}</span>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] uppercase text-white/40 border border-white/10 px-2 py-0.5 rounded-full">
                    {item.type}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
