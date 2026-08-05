"use client"

import { useState, useTransition } from "react"
import { Plus, Trash2, Edit2, Save, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { FunFact } from "@/types/about"
import { createFunFact, updateFunFact, deleteFunFact } from "@/app/admin/(protected)/actions"

interface FunFactsManagerProps {
  initialFacts: FunFact[]
}

export function FunFactsManager({ initialFacts }: FunFactsManagerProps) {
  const [facts, setFacts] = useState<FunFact[]>(initialFacts)
  const [isPending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form states for New / Editing
  const [icon, setIcon] = useState("⚡")
  const [value, setValue] = useState("")
  const [label, setLabel] = useState("")
  const [order, setOrder] = useState(0)

  function startCreate() {
    setIcon("⚡")
    setValue("")
    setLabel("")
    setOrder(facts.length)
    setIsAdding(true)
    setEditingId(null)
    setError(null)
  }

  function startEdit(fact: FunFact) {
    setEditingId(fact.id)
    setIcon(fact.icon || "⚡")
    setValue(fact.value || "")
    setLabel(fact.label || "")
    setOrder(fact.order || 0)
    setIsAdding(false)
    setError(null)
  }

  function cancel() {
    setEditingId(null)
    setIsAdding(false)
    setError(null)
  }

  async function handleSaveNew() {
    if (!value.trim() || !label.trim()) {
      setError("Value and Label are required.")
      return
    }

    const fd = new FormData()
    fd.append("icon", icon)
    fd.append("value", value)
    fd.append("label", label)
    fd.append("order", String(order))

    startTransition(async () => {
      const res = await createFunFact({ success: false, error: "" }, fd)
      if (res.success) {
        setIsAdding(false)
        // Refresh local view
        window.location.reload()
      } else {
        setError(res.error || "Failed to create fun fact.")
      }
    })
  }

  async function handleSaveUpdate(id: string) {
    if (!value.trim() || !label.trim()) {
      setError("Value and Label are required.")
      return
    }

    const fd = new FormData()
    fd.append("icon", icon)
    fd.append("value", value)
    fd.append("label", label)
    fd.append("order", String(order))

    startTransition(async () => {
      const res = await updateFunFact(id, { success: false, error: "" }, fd)
      if (res.success) {
        setEditingId(null)
        // Refresh local view
        window.location.reload()
      } else {
        setError(res.error || "Failed to update fun fact.")
      }
    })
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this fun fact?")) return

    startTransition(async () => {
      const res = await deleteFunFact(id)
      if (res.success) {
        setFacts((prev) => prev.filter((f) => f.id !== id))
      } else {
        setError(res.error || "Failed to delete fun fact.")
      }
    })
  }

  return (
    <div className="glass rounded-2xl p-6 border border-white/10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Fun Facts & Highlights</h3>
          <p className="text-xs text-white/50">Displayed in the "A Little Extra" section on the About page</p>
        </div>
        {!isAdding && (
          <Button type="button" size="sm" variant="gradient" onClick={startCreate} className="gap-2 text-xs">
            <Plus size={14} /> Add Fun Fact
          </Button>
        )}
      </div>

      {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">{error}</div>}

      {/* Adding Form */}
      {isAdding && (
        <div className="p-4 rounded-xl bg-white/5 border border-purple-500/30 space-y-4">
          <h4 className="text-xs font-semibold text-purple-400">New Fun Fact</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] text-white/50 block mb-1">Icon (Emoji)</label>
              <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="☕" className="text-center text-lg" />
            </div>
            <div>
              <label className="text-[11px] text-white/50 block mb-1">Value *</label>
              <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 500+" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] text-white/50 block mb-1">Label *</label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Cups of Coffee" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <Button type="button" size="sm" variant="ghost" onClick={cancel} disabled={isPending}>
              <X size={14} className="mr-1" /> Cancel
            </Button>
            <Button type="button" size="sm" variant="gradient" onClick={handleSaveNew} disabled={isPending}>
              {isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : <Save size={14} className="mr-1" />}
              Save Fun Fact
            </Button>
          </div>
        </div>
      )}

      {/* List of Fun Facts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {facts.map((fact) => {
          const isEditing = editingId === fact.id

          if (isEditing) {
            return (
              <div key={fact.id} className="p-4 rounded-xl bg-white/5 border border-blue-500/30 space-y-3 col-span-full">
                <h4 className="text-xs font-semibold text-blue-400">Editing Fun Fact</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] text-white/50 block mb-1">Icon (Emoji)</label>
                    <Input value={icon} onChange={(e) => setIcon(e.target.value)} className="text-center text-lg" />
                  </div>
                  <div>
                    <label className="text-[11px] text-white/50 block mb-1">Value *</label>
                    <Input value={value} onChange={(e) => setValue(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-white/50 block mb-1">Label *</label>
                    <Input value={label} onChange={(e) => setLabel(e.target.value)} />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button type="button" size="sm" variant="ghost" onClick={cancel} disabled={isPending}>
                    <X size={14} className="mr-1" /> Cancel
                  </Button>
                  <Button type="button" size="sm" variant="gradient" onClick={() => handleSaveUpdate(fact.id)} disabled={isPending}>
                    {isPending ? <Loader2 size={14} className="animate-spin mr-1" /> : <Save size={14} className="mr-1" />}
                    Update
                  </Button>
                </div>
              </div>
            )
          }

          return (
            <div
              key={fact.id}
              className="glass rounded-xl p-4 border border-white/10 flex items-center justify-between gap-3 group hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl shrink-0">{fact.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{fact.value}</p>
                  <p className="text-xs text-white/50 truncate uppercase tracking-wider">{fact.label}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => startEdit(fact)}
                  className="p-1.5 rounded-lg text-white/50 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                  title="Edit"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(fact.id)}
                  className="p-1.5 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}

        {!facts.length && !isAdding && (
          <div className="col-span-full py-8 text-center text-xs text-white/40 border border-dashed border-white/10 rounded-xl">
            No fun facts added yet. Click "Add Fun Fact" above to create one!
          </div>
        )}
      </div>
    </div>
  )
}
