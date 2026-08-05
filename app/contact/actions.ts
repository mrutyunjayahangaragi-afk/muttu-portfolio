"use server"

import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import type { ActionResult } from "@/types/actions"

const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address").max(100),
  subject: z.string().min(2, "Subject must be at least 2 characters").max(200),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000),
})

export async function submitContactMessage(
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient()

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  }

  const parsed = ContactSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  // Basic rate limiting via DB check could be added here, 
  // but for now we insert directly.
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
    read: false,
    replied: false,
  })

  if (error) {
    return { success: false, error: "Failed to send message. Please try again later." }
  }

  return { success: true }
}
