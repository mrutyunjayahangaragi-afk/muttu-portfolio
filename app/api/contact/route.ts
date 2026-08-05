import { NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { checkRateLimit } from "@/lib/rate-limit"

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(5000),
})

export async function POST(request: Request) {
  try {
    // Determine client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous"
    const rateCheck = checkRateLimit(`contact:${ip}`, 5, 60000)

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many contact messages. Please try again shortly." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(rateCheck.resetMs / 1000).toString(),
          },
        }
      )
    }

    const body = await request.json()
    const validated = contactSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validated.error.flatten() },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { error } = await supabase.from("contact_messages").insert(validated.data)

    if (error) {
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
    }

    return NextResponse.json({ message: "Message sent successfully" })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

