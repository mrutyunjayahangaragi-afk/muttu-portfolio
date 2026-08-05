"use client"

import { useState, useTransition } from "react"
import {
  Database,
  Download,
  RotateCcw,
  Plus,
  Trash2,
  HardDrive,
  ImageIcon,
  Video,
  FileText,
  ShieldCheck,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  createDatabaseBackup,
  restoreDatabaseBackup,
  deleteBackup,
} from "@/app/admin/(protected)/actions"
import type { BackupItem } from "@/services/system"

interface BackupsManagerProps {
  backups: BackupItem[]
  mediaSummary: {
    totalFiles: number
    totalSizeBytes: number
    imagesCount: number
    videosCount: number
    documentsCount: number
  }
}

export function BackupsManager({
  backups: initialBackups,
  mediaSummary,
}: BackupsManagerProps) {
  const [backups, setBackups] = useState(initialBackups)
  const [isPending, startTransition] = useTransition()
  const [restoringId, setRestoringId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  function handleCreateBackup() {
    setMessage(null)
    startTransition(async () => {
      const res = await createDatabaseBackup()
      if (res.success) {
        setMessage({ type: "success", text: "Database backup created successfully!" })
        // Add optimistic backup item
        const newBackup: BackupItem = {
          id: `b-${Date.now()}`,
          name: `db_backup_${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
          file_url: null,
          size_bytes: 45000,
          type: "database",
          status: "completed",
          created_at: new Date().toISOString(),
        }
        setBackups((prev) => [newBackup, ...prev])
      } else {
        setMessage({ type: "error", text: res.error || "Failed to create backup." })
      }
    })
  }

  function handleRestore(id: string, name: string) {
    if (!confirm(`Are you sure you want to restore from ${name}? This will verify database records.`)) return
    setRestoringId(id)
    setMessage(null)
    startTransition(async () => {
      const res = await restoreDatabaseBackup(id)
      setRestoringId(null)
      if (res.success) {
        setMessage({ type: "success", text: `Verified & restored database from ${name}` })
      } else {
        setMessage({ type: "error", text: res.error || "Restore failed." })
      }
    })
  }

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this backup record?")) return
    setBackups((prev) => prev.filter((b) => b.id !== id))
    startTransition(async () => {
      await deleteBackup(id)
    })
  }

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Trigger */}
      <div className="glass rounded-2xl border border-white/10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
            <Database size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Database Backup &amp; Integrity</h3>
            <p className="text-xs text-white/50">Create full snapshots of your Supabase content tables</p>
          </div>
        </div>

        <Button
          onClick={handleCreateBackup}
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs gap-1.5 shadow-lg shadow-blue-500/20"
        >
          <Plus size={14} />
          {isPending ? "Creating Backup..." : "Create Backup Now"}
        </Button>
      </div>

      {/* Alert Messages */}
      {message && (
        <div
          className={`rounded-xl border p-4 text-xs font-medium ${
            message.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Media Bucket Summary Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass rounded-2xl border border-white/10 p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <HardDrive size={18} />
          </div>
          <div>
            <p className="text-xs text-white/50">Total Media Size</p>
            <p className="text-base font-bold text-white">{formatBytes(mediaSummary.totalSizeBytes)}</p>
          </div>
        </div>

        <div className="glass rounded-2xl border border-white/10 p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <ImageIcon size={18} />
          </div>
          <div>
            <p className="text-xs text-white/50">Images &amp; Assets</p>
            <p className="text-base font-bold text-white">{mediaSummary.imagesCount} Files</p>
          </div>
        </div>

        <div className="glass rounded-2xl border border-white/10 p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
            <Video size={18} />
          </div>
          <div>
            <p className="text-xs text-white/50">Video Demos</p>
            <p className="text-base font-bold text-white">{mediaSummary.videosCount} Videos</p>
          </div>
        </div>

        <div className="glass rounded-2xl border border-white/10 p-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <FileText size={18} />
          </div>
          <div>
            <p className="text-xs text-white/50">Resumes &amp; Documents</p>
            <p className="text-base font-bold text-white">{mediaSummary.documentsCount} Documents</p>
          </div>
        </div>
      </div>

      {/* Backup History Table */}
      <div className="glass overflow-hidden rounded-2xl border border-white/10 space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            Backup History &amp; Point-in-Time Restore
          </h4>
          <span className="font-mono text-[11px] text-white/40">{backups.length} Snapshots</span>
        </div>

        {backups.length === 0 ? (
          <div className="py-8 text-center text-xs text-white/40 border border-dashed border-white/10 rounded-xl">
            No database backups created yet. Click &quot;Create Backup Now&quot; above to take a full snapshot.
          </div>
        ) : (
          <div className="space-y-3">
            {backups.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-xs transition-colors hover:bg-white/5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-white truncate">{b.name}</p>
                    <p className="font-mono text-[10px] text-white/40">
                      {formatBytes(b.size_bytes)} • Created on{" "}
                      {new Date(b.created_at).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    onClick={() => handleRestore(b.id, b.name)}
                    disabled={restoringId === b.id}
                    variant="outline"
                    size="sm"
                    className="border-white/10 bg-white/5 text-white hover:bg-white/10 text-xs gap-1.5"
                  >
                    <RotateCcw size={12} className="text-amber-400" />
                    {restoringId === b.id ? "Restoring..." : "Restore"}
                  </Button>

                  <button
                    onClick={() => handleDelete(b.id)}
                    className="rounded-lg p-2 text-white/30 hover:bg-red-500/20 hover:text-red-400"
                    title="Delete Backup Record"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
