"use client"

import { useState, useTransition } from "react"
import {
  Plus,
  Trash2,
  Star,
  Tag,
  ImageIcon,
  Check,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  addHackathonGalleryItem,
  updateHackathonGalleryItem,
  deleteHackathonGalleryItem,
} from "@/app/admin/(protected)/actions"
import type { HackathonGalleryItem } from "@/types"

interface HackathonGalleryManagerProps {
  hackathonId: string
  initialGallery: HackathonGalleryItem[]
}

const CATEGORIES = [
  "Opening Ceremony",
  "Team Photos",
  "Coding Session",
  "Mentor Discussion",
  "Presentation",
  "Judging",
  "Prize Distribution",
  "Networking",
  "Event",
]

export function HackathonGalleryManager({
  hackathonId,
  initialGallery,
}: HackathonGalleryManagerProps) {
  const [gallery, setGallery] = useState<HackathonGalleryItem[]>(initialGallery)
  const [newImageUrl, setNewImageUrl] = useState("")
  const [newTitle, setNewTitle] = useState("")
  const [newCategory, setNewCategory] = useState("Coding Session")
  const [newDesc, setNewDesc] = useState("")
  const [isPending, startTransition] = useTransition()
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  function handleAddPhoto() {
    if (!newImageUrl.trim()) {
      setMsg({ type: "error", text: "Please provide an image URL or upload an image." })
      return
    }

    setMsg(null)
    startTransition(async () => {
      const res = await addHackathonGalleryItem({
        hackathon_id: hackathonId,
        image_url: newImageUrl,
        image_title: newTitle,
        image_description: newDesc,
        category: newCategory,
      })

      if (res.success) {
        setMsg({ type: "success", text: "Photo added to participation gallery!" })
        const newItem: HackathonGalleryItem = {
          id: `g-${Date.now()}`,
          hackathon_id: hackathonId,
          image_url: newImageUrl,
          image_title: newTitle || null,
          image_description: newDesc || null,
          category: newCategory,
          image_order: gallery.length,
          display_order: gallery.length,
          is_featured: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        setGallery((prev) => [...prev, newItem])
        setNewImageUrl("")
        setNewTitle("")
        setNewDesc("")
      } else {
        setMsg({ type: "error", text: res.error || "Failed to add image." })
      }
    })
  }

  function handleUpdate(
    id: string,
    updates: Partial<Pick<HackathonGalleryItem, "image_title" | "image_description" | "category" | "is_featured">>
  ) {
    setGallery((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )

    const target = gallery.find((item) => item.id === id)
    if (!target) return

    startTransition(async () => {
      const titleVal = updates.image_title !== undefined ? updates.image_title : target.image_title
      const descVal = updates.image_description !== undefined ? updates.image_description : target.image_description
      const catVal = updates.category !== undefined ? updates.category : target.category

      await updateHackathonGalleryItem(id, {
        image_title: titleVal || undefined,
        image_description: descVal || undefined,
        category: catVal || undefined,
        is_featured: updates.is_featured !== undefined ? updates.is_featured : target.is_featured,
      })
    })
  }

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this participation photo?")) return
    setGallery((prev) => prev.filter((item) => item.id !== id))
    startTransition(async () => {
      await deleteHackathonGalleryItem(id, hackathonId)
    })
  }

  return (
    <div className="space-y-6 pt-4">
      {/* Header & Add Section */}
      <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ImageIcon size={16} className="text-rose-400" />
            Hackathon Participation Gallery ({gallery.length} Photos)
          </h3>
          <span className="text-[11px] font-mono text-white/40">Unlimited Uploads</span>
        </div>

        {msg && (
          <div
            className={`rounded-xl border p-3 text-xs font-medium ${
              msg.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            {msg.text}
          </div>
        )}

        {/* Add Photo Form */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-4">
          <h4 className="text-xs font-semibold text-white/80">Add New Event Photo</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/60 font-medium">Image URL (Cloudinary / Direct Link) *</label>
              <input
                type="text"
                placeholder="https://res.cloudinary.com/... or https://..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/60 font-medium">Photo Title / Stage Caption</label>
                <input
                  type="text"
                  placeholder="e.g. Presenting Demo on Stage"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-white/60 font-medium">Stage Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-white/60 font-medium">Short Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Discussing system architecture with judges"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleAddPhoto}
              disabled={isPending || !newImageUrl}
              size="sm"
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs gap-1.5 shadow-lg shadow-rose-500/20"
            >
              <Plus size={14} />
              {isPending ? "Adding..." : "Add Photo to Gallery"}
            </Button>
          </div>
        </div>
      </div>

      {/* Gallery Photos Grid */}
      {gallery.length === 0 ? (
        <div className="glass rounded-2xl border border-white/10 p-12 text-center">
          <ImageIcon className="mx-auto h-8 w-8 text-white/20 mb-3" />
          <h4 className="text-sm font-medium text-white/70">No Participation Photos Added Yet</h4>
          <p className="text-xs text-white/40 mt-1">
            Upload stage photos, team photos, and presentation images above to showcase your hackathon experience.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="glass rounded-2xl border border-white/10 overflow-hidden space-y-3 p-3 transition-all hover:border-white/20"
            >
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/60">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image_url} alt={item.image_title || "Hackathon photo"} className="h-full w-full object-cover" />
                <span className="absolute top-2 left-2 rounded-md bg-black/70 backdrop-blur-md px-2 py-0.5 font-mono text-[10px] text-white/80">
                  {item.category || "Event"}
                </span>
                {item.is_featured && (
                  <span className="absolute top-2 right-2 rounded-md bg-amber-500 text-black px-2 py-0.5 font-bold text-[10px]">
                    Featured
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <input
                  type="text"
                  value={item.image_title || ""}
                  placeholder="Photo Title"
                  onChange={(e) => handleUpdate(item.id, { image_title: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 text-xs text-white focus:outline-none"
                />

                <select
                  value={item.category || "Event"}
                  onChange={(e) => handleUpdate(item.id, { category: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 text-xs text-white focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => handleUpdate(item.id, { is_featured: !item.is_featured })}
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      item.is_featured
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-white/5 text-white/50 hover:bg-white/10"
                    }`}
                  >
                    <Star size={12} className={item.is_featured ? "fill-amber-400 text-amber-400" : ""} />
                    {item.is_featured ? "Featured" : "Mark Featured"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="rounded-lg p-1.5 text-white/40 hover:bg-red-500/20 hover:text-red-400"
                    title="Delete Photo"
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
