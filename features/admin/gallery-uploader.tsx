"use client"

import { useState, useRef, useTransition } from "react"
import { Upload, Loader2, CheckCircle, AlertCircle, Trash2, Copy, Check } from "lucide-react"
import Image from "next/image"
import type { MediaItem } from "@/types"
import { saveMediaItem, deleteMediaItem } from "@/app/admin/(protected)/actions"

interface GalleryUploaderProps {
  initialItems?: MediaItem[]
}

export function GalleryUploader({ initialItems = [] }: GalleryUploaderProps) {
  const [items, setItems] = useState<MediaItem[]>(initialItems)
  const [uploading, setUploading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || [])
    if (!selected.length) return

    setUploading(true)
    setError(null)

    for (const file of selected) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", "gallery")

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Upload failed")
      } else {
        // Save to Supabase DB via Server Action
        const dbRes = await saveMediaItem({
          url: data.secure_url,
          public_id: data.public_id,
          filename: file.name,
          file_size: file.size,
        })

        if (dbRes.success) {
          const newItem: MediaItem = {
            id: data.public_id || Math.random().toString(),
            url: data.secure_url,
            public_id: data.public_id,
            filename: file.name,
            file_type: "image",
            file_size: file.size,
            caption: null,
            created_at: new Date().toISOString(),
          }
          setItems((prev) => [newItem, ...prev])
        } else {
          setError(dbRes.error || "Failed to persist gallery image")
        }
      }
    }
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ""
  }

  function handleCopy(id: string, url: string) {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this media item?")) return

    startTransition(async () => {
      const res = await deleteMediaItem(id)
      if (res.success) {
        setItems((prev) => prev.filter((item) => item.id !== id))
      } else {
        setError(res.error || "Failed to delete item")
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <label className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/20 p-10 transition-all hover:border-blue-500/50 hover:bg-blue-500/5">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
          disabled={uploading || isPending}
        />
        {uploading ? (
          <Loader2 size={32} className="animate-spin text-blue-400" />
        ) : (
          <Upload size={32} className="text-white/40 transition-colors group-hover:text-blue-400" />
        )}
        <div className="text-center">
          <p className="text-sm font-medium text-white/80">
            {uploading ? "Uploading to Cloudinary & Supabase…" : "Click or drop images to upload"}
          </p>
          <p className="mt-1 text-xs text-white/40">PNG, JPG, WebP, GIF — max 50MB per file</p>
        </div>
      </label>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {/* Gallery Media Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white">
          Media Library ({items.length} {items.length === 1 ? "item" : "items"})
        </h3>

        {!items.length ? (
          <div className="glass rounded-2xl p-12 text-center text-white/40 text-sm border border-white/10">
            No gallery images uploaded yet. Drag & drop images above to start!
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square overflow-hidden rounded-xl bg-white/5 border border-white/10"
              >
                <Image
                  src={item.url}
                  alt={item.filename || "Gallery item"}
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 p-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, item.url)}
                    className="flex items-center gap-1.5 rounded-lg bg-white/20 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/30"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                    {copiedId === item.id ? "Copied!" : "Copy Link"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/80 text-white transition-colors hover:bg-red-600"
                    title="Delete Image"
                    disabled={isPending}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="absolute bottom-2 left-2 pointer-events-none">
                  <CheckCircle size={14} className="text-green-400 shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
