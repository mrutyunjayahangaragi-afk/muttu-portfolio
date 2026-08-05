"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/types/actions"

const ContactFormSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(30).optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(150),
  project_type: z.string().optional().nullable(),
  budget: z.string().optional().nullable(),
  timeline: z.string().optional().nullable(),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
  website_url: z.string().optional().nullable(),
})

const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function submitContactFormAction(formData: FormData): Promise<ActionResult> {
  try {
    const honeypot = formData.get("website_url")
    if (honeypot && String(honeypot).trim() !== "") {
      return { success: true }
    }

    const rawData = {
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      phone: formData.get("phone") || null,
      company: formData.get("company") || null,
      country: formData.get("country") || null,
      subject: formData.get("subject"),
      project_type: formData.get("project_type") || null,
      budget: formData.get("budget") || null,
      timeline: formData.get("timeline") || null,
      message: formData.get("message"),
      website_url: formData.get("website_url") || null,
    }

    const parsed = ContactFormSchema.safeParse(rawData)
    if (!parsed.success) {
      return { success: false, error: parsed.error.errors[0].message }
    }

    let attachmentUrl: string | null = null

    const attachmentFile = formData.get("attachment") as File | null
    if (attachmentFile && attachmentFile.size > 0) {
      if (attachmentFile.size > MAX_FILE_SIZE) {
        return { success: false, error: "Attachment size must be 10MB or smaller." }
      }

      if (!ALLOWED_FILE_TYPES.includes(attachmentFile.type)) {
        return { success: false, error: "Only PDF, DOCX, JPG, PNG, and WEBP files are allowed." }
      }

      const supabase = await createClient()
      const ext = attachmentFile.name.split(".").pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("contact_attachments")
        .upload(fileName, attachmentFile, {
          contentType: attachmentFile.type,
          upsert: true,
        })

      if (!uploadError && uploadData) {
        const { data: publicUrlData } = supabase.storage
          .from("contact_attachments")
          .getPublicUrl(fileName)
        attachmentUrl = publicUrlData?.publicUrl || null
      }
    }

    const supabase = await createClient()

    // Primary insert with full schema
    let { error: dbError } = await supabase.from("contact_messages").insert({
      full_name: parsed.data.full_name,
      name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company,
      country: parsed.data.country,
      subject: parsed.data.subject,
      project_type: parsed.data.project_type,
      budget: parsed.data.budget,
      timeline: parsed.data.timeline,
      message: parsed.data.message,
      attachment_url: attachmentUrl,
      status: "new",
      is_read: false,
      read: false,
      replied: false,
      archived: false,
      created_at: new Date().toISOString(),
    })

    // Fallback if legacy schema table exists
    if (dbError && dbError.message.includes('column "status" does not exist')) {
      const fallback = await supabase.from("contact_messages").insert({
        name: parsed.data.full_name,
        email: parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
        read: false,
        replied: false,
        created_at: new Date().toISOString(),
      })
      dbError = fallback.error
    }

    if (dbError) {
      console.error("Error inserting contact message:", dbError)
      return { success: false, error: dbError.message || "Failed to submit message." }
    }

    revalidatePath("/", "layout")
    revalidatePath("/admin/messages")

    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred."
    return { success: false, error: message }
  }
}
