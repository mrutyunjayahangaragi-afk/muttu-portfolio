"use client"

import { useState } from "react"
import {
  Activity,
  Search,
  Filter,
  Download,
  CheckCircle,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ActivityLogItem } from "@/services/system"

interface ActivityLogsManagerProps {
  initialLogs: ActivityLogItem[]
  totalCount: number
}

export function ActivityLogsManager({ initialLogs, totalCount }: ActivityLogsManagerProps) {
  const [logs] = useState(initialLogs)
  const [moduleFilter, setModuleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [search, setSearch] = useState("")

  const filtered = logs.filter((l) => {
    if (moduleFilter !== "all" && l.module !== moduleFilter) return false
    if (statusFilter !== "all" && l.status !== statusFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return l.action.toLowerCase().includes(q) || (l.details && l.details.toLowerCase().includes(q))
    }
    return true
  })

  function exportCSV() {
    const rows = [
      ["ID", "Action", "Module", "Status", "Details", "Date"],
      ...filtered.map((l) => [
        l.id,
        `"${l.action.replace(/"/g, '""')}"`,
        l.module,
        l.status,
        `"${(l.details || "").replace(/"/g, '""')}"`,
        l.created_at,
      ]),
    ]

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `Activity_Logs_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusIcon = (st: string) => {
    switch (st) {
      case "error":
        return <XCircle className="h-4 w-4 text-red-400" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-400" />
      default:
        return <CheckCircle className="h-4 w-4 text-emerald-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Search & Export Bar */}
      <div className="glass rounded-2xl border border-white/10 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">System Audit Log</h3>
              <p className="text-xs text-white/50">{totalCount} total audit records logged</p>
            </div>
          </div>

          <Button
            onClick={exportCSV}
            variant="outline"
            size="sm"
            className="border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs gap-1.5"
          >
            <FileSpreadsheet size={14} className="text-emerald-400" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
            <input
              type="text"
              placeholder="Search action or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:border-blue-500/50 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={14} className="text-white/40 shrink-0" />
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white focus:border-blue-500/50 focus:outline-none"
            >
              <option value="all">All Modules</option>
              <option value="auth">Auth &amp; Login</option>
              <option value="projects">Projects</option>
              <option value="blog">Blog</option>
              <option value="skills">Skills</option>
              <option value="backups">Backups</option>
              <option value="theme">Theme &amp; Settings</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-white focus:border-blue-500/50 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass overflow-hidden rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-white/5 font-mono uppercase text-white/50 text-[10px]">
              <tr>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-white/40">
                    No activity log entries match your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3">{getStatusIcon(item.status)}</td>
                    <td className="px-4 py-3 font-medium text-white">{item.action}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] uppercase text-white/70">
                        {item.module}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/60 max-w-xs truncate">
                      {item.details || "—"}
                    </td>
                    <td className="px-4 py-3 font-mono text-white/40 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleString("en-US", {
                        dateStyle: "short",
                        timeStyle: "medium",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
