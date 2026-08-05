"use client"

import { useState, useRef } from "react"
import { FileText, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function ResumeUploader() {
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [version, setVersion] = useState("1.0")
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.")
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(false)

    // Upload to Cloudinary via the admin upload API
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", "resume")

    const res = await fetch("/api/admin/upload", { method: "POST", body: formData })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || "Upload failed")
      setUploading(false)
      return
    }

    // Save to DB — deactivate all previous, then insert active one
    const supabase = createClient()
    await supabase.from("resumes").update({ active: false }).neq("id", "none")

    const { error: dbError } = await supabase.from("resumes").insert({
      file_url: data.secure_url,
      file_name: file.name,
      version,
      active: true,
    })

    if (dbError) {
      setError(dbError.message)
    } else {
      setSuccess(true)
    }

    setUploading(false)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="space-y-1">
          <label className="text-xs text-white/60" htmlFor="resume-version">
            Version
          </label>
          <input
            id="resume-version"
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="e.g. 2.1"
            className="h-9 w-28 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/30 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <label className="mt-5 flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/80 transition-all hover:border-white/20 hover:bg-white/10">
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
          {uploading ? (
            <Loader2 size={15} className="animate-spin text-blue-400" />
          ) : (
            <Upload size={15} />
          )}
          {uploading ? "Uploading…" : "Choose PDF"}
        </label>
      </div>

      {success && (
        <div className="flex items-center gap-2 text-sm text-green-400">
          <CheckCircle size={15} />
          Resume uploaded and set as active!
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle size={15} />
          {error}
        </div>
      )}
    </div>
  )
}
