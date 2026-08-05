/**
 * POST /api/admin/upload
 *
 * Admin-only Cloudinary upload endpoint.
 * Returns { secure_url, public_id, resource_type }.
 *
 * Security:
 *  - Admin session check via getAdminSession()
 *  - File type allowlist
 *  - Max size enforcement
 */
import { NextResponse } from "next/server"
import { getAdminSession } from "@/lib/auth"

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
  "video/mp4",
  "video/webm",
]

const MAX_SIZE_MB = 50
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

export async function POST(request: Request) {
  // Auth check — 403 if not admin
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const folder = (formData.get("folder") as string) || "portfolio"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `File type not allowed: ${file.type}` }, { status: 400 })
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File too large. Max size is ${MAX_SIZE_MB}MB` },
        { status: 400 }
      )
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: "Cloudinary not configured" }, { status: 500 })
    }

    // Build Cloudinary upload request
    const timestamp = Math.floor(Date.now() / 1000)
    const uploadFolder = `portfolio/${folder}`

    // Sign the upload request server-side
    const { createHash } = await import("crypto")
    const signature = createHash("sha1")
      .update(`folder=${uploadFolder}&timestamp=${timestamp}${apiSecret}`)
      .digest("hex")

    const uploadData = new FormData()
    uploadData.append("file", file)
    uploadData.append("api_key", apiKey)
    uploadData.append("timestamp", String(timestamp))
    uploadData.append("signature", signature)
    uploadData.append("folder", uploadFolder)

    const resourceType = file.type.startsWith("video/")
      ? "video"
      : file.type === "application/pdf"
        ? "raw"
        : "image"

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: uploadData,
    })

    if (!response.ok) {
      const err = await response.json()
      return NextResponse.json({ error: err.error?.message || "Upload failed" }, { status: 500 })
    }

    const result = await response.json()
    return NextResponse.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      format: result.format,
      bytes: result.bytes,
    })
  } catch (err) {
    console.error("[upload]", err)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
