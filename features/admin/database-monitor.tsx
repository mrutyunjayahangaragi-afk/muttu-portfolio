"use client"

import {
  Database,
  ShieldCheck,
  HardDrive,
  Activity,
  CheckCircle,
  AlertTriangle,
  Server,
  Layers,
  Cpu,
  KeyRound,
} from "lucide-react"
import type { DatabaseStatsData } from "@/services/system"

interface DatabaseMonitorProps {
  stats: DatabaseStatsData
}

export function DatabaseMonitor({ stats }: DatabaseMonitorProps) {
  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-8">
      {/* Service Health Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass rounded-2xl border border-white/10 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/50 font-medium">Supabase DB Status</p>
            <p className="text-lg font-bold text-white mt-1 capitalize">{stats.health.supabase}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <Server size={20} />
          </div>
        </div>

        <div className="glass rounded-2xl border border-white/10 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/50 font-medium">Cloudinary CDN</p>
            <p className="text-lg font-bold text-white mt-1 capitalize">{stats.health.cloudinary}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <HardDrive size={20} />
          </div>
        </div>

        <div className="glass rounded-2xl border border-white/10 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/50 font-medium">OpenRouter AI API</p>
            <p className="text-lg font-bold text-white mt-1 capitalize">{stats.health.openrouter}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <Cpu size={20} />
          </div>
        </div>

        <div className="glass rounded-2xl border border-white/10 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/50 font-medium">RLS Security Status</p>
            <p className="text-lg font-bold text-emerald-400 mt-1">{stats.rlsProtectedRatio} Active</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck size={20} />
          </div>
        </div>
      </div>

      {/* Database Overview Banner */}
      <div className="glass rounded-2xl border border-white/10 p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <p className="text-xs text-white/50">Total Managed Tables</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.totalTables} Tables</p>
        </div>
        <div>
          <p className="text-xs text-white/50">Total Database Records</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.totalRows.toLocaleString()} Rows</p>
        </div>
        <div>
          <p className="text-xs text-white/50">Estimated DB Size</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.estimatedSizeMb} MB</p>
        </div>
        <div>
          <p className="text-xs text-white/50">Active Pool Connections</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.activeConnections} Connections</p>
        </div>
      </div>

      {/* Table Statistics */}
      <div className="glass overflow-hidden rounded-2xl border border-white/10 space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <Layers size={16} className="text-blue-400" />
            Supabase Table Audit &amp; Row Counts
          </h4>
          <span className="font-mono text-[11px] text-white/40">{stats.tables.length} Active Tables</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-white/5 font-mono uppercase text-white/50 text-[10px]">
              <tr>
                <th className="px-4 py-3">Table Name</th>
                <th className="px-4 py-3">Row Count</th>
                <th className="px-4 py-3">RLS Status</th>
                <th className="px-4 py-3">Indexes</th>
                <th className="px-4 py-3">Foreign Keys</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats.tables.map((t) => (
                <tr key={t.name} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono font-medium text-white">{t.name}</td>
                  <td className="px-4 py-3 font-mono text-white/80">{t.rowCount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                      <CheckCircle size={10} /> RLS Enabled
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-white/60">{t.indexCount} B-tree Indexes</td>
                  <td className="px-4 py-3 font-mono text-white/60">{t.foreignKeys} FK Refs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Storage Buckets Statistics */}
      <div className="glass overflow-hidden rounded-2xl border border-white/10 space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <HardDrive size={16} className="text-purple-400" />
            Supabase Storage Buckets Status
          </h4>
          <span className="font-mono text-[11px] text-white/40">{stats.buckets.length} Buckets</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.buckets.map((b) => (
            <div key={b.name} className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-white">{b.name}</span>
                <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/60">
                  Public
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-sm font-bold text-white">{b.fileCount} files</span>
                <span className="font-mono text-xs text-white/50">{formatBytes(b.sizeBytes)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
