import { NextResponse } from "next/server"
import { getPortfolioContext } from "@/services/ai"
import { getSettings } from "@/services/settings"
import { checkRateLimit } from "@/lib/rate-limit"
import { createClient } from "@/lib/supabase/server"

const FALLBACK_MODELS = [
  "google/gemini-2.0-flash-lite-preview-02-05:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "openai/gpt-3.5-turbo",
  "deepseek/deepseek-chat",
]

function generateLocalRAGResponse(userMessage: string, context: string): string {
  const lowerMsg = userMessage.toLowerCase()

  if (lowerMsg.includes("skill") || lowerMsg.includes("tech") || lowerMsg.includes("stack") || lowerMsg.includes("framework")) {
    const skillsMatch = context.match(/Skills:([\s\S]*?)(?=Experience:|$)/i)
    if (skillsMatch && skillsMatch[1].trim()) {
      return `Here are the core technical skills listed in the portfolio:\n\n${skillsMatch[1].trim().slice(0, 400)}`
    }
  }

  if (lowerMsg.includes("project") || lowerMsg.includes("build") || lowerMsg.includes("work")) {
    const projectsMatch = context.match(/Projects:([\s\S]*?)(?=Instructions:|$)/i)
    if (projectsMatch && projectsMatch[1].trim()) {
      return `Here are some featured projects from the portfolio:\n\n${projectsMatch[1].trim().slice(0, 400)}`
    }
  }

  if (lowerMsg.includes("experience") || lowerMsg.includes("job") || lowerMsg.includes("company") || lowerMsg.includes("role")) {
    const expMatch = context.match(/Experience:([\s\S]*?)(?=Projects:|$)/i)
    if (expMatch && expMatch[1].trim()) {
      return `Here is the professional experience overview:\n\n${expMatch[1].trim().slice(0, 400)}`
    }
  }

  if (lowerMsg.includes("contact") || lowerMsg.includes("email") || lowerMsg.includes("reach") || lowerMsg.includes("location")) {
    const nameMatch = context.match(/Name:\s*(.*)/i)
    const emailMatch = context.match(/Email:\s*(.*)/i)
    const locMatch = context.match(/Location:\s*(.*)/i)

    return `You can get in touch with ${nameMatch ? nameMatch[1] : "me"} via:\n- Email: ${emailMatch ? emailMatch[1] : "Contact Section"}\n- Location: ${locMatch ? locMatch[1] : "Available online"}\n\nFeel free to send a message through the Contact page!`
  }

  const aboutMatch = context.match(/About:\s*(.*)/i)
  return `Hi! I am the Portfolio AI assistant. ${aboutMatch ? aboutMatch[1] : "Welcome to the portfolio!"} Feel free to ask me about core skills, projects, work experience, or contact details!`
}

async function logAiConversation(userMessage: string, assistantReply: string, ip: string) {
  try {
    const supabase = await createClient()
    const { data: conv } = await supabase
      .from("ai_conversations")
      .insert({ visitor_ip: ip, created_at: new Date().toISOString() })
      .select("id")
      .single()

    if (conv?.id) {
      await supabase.from("ai_messages").insert([
        { conversation_id: conv.id, role: "user", content: userMessage, created_at: new Date().toISOString() },
        { conversation_id: conv.id, role: "assistant", content: assistantReply, created_at: new Date().toISOString() },
      ])
    }
  } catch (err) {
    // Ignore DB logging failure silently
  }
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous"
    const rateCheck = checkRateLimit(`chat:${ip}`, 15, 60000)

    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many AI assistant requests. Please wait a minute before trying again." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(rateCheck.resetMs / 1000).toString(),
          },
        }
      )
    }

    const { messages } = await req.json()
    const userMessage = messages[messages.length - 1]?.content || ""

    const settings = await getSettings().catch(() => null)
    const apiKey = settings?.openrouter_api_key || process.env.OPENROUTER_API_KEY
    const context = await getPortfolioContext().catch(() => "Context unavailable")

    // If OpenRouter API Key is available, try fetching external LLM
    if (apiKey) {
      const systemMessage = { role: "system", content: context }

      for (const model of FALLBACK_MODELS) {
        try {
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
              "X-Title": "Portfolio AI Assistant",
            },
            body: JSON.stringify({
              model,
              messages: [systemMessage, ...messages],
              stream: false,
            }),
          })

          if (response.ok) {
            const data = await response.json()
            if (data.choices && data.choices[0]?.message?.content) {
              const reply = data.choices[0].message.content
              await logAiConversation(userMessage, reply, ip)
              return NextResponse.json(data)
            }
          }
        } catch (e) {
          // Continue fallback model loop
        }
      }
    }

    // Smart Local Knowledgebase Fallback when API key is unconfigured or offline
    const localReply = generateLocalRAGResponse(userMessage, context)
    await logAiConversation(userMessage, localReply, ip)

    return NextResponse.json({
      choices: [
        {
          message: {
            role: "assistant",
            content: localReply,
          },
        },
      ],
    })
  } catch (error: unknown) {
    console.error("Chat API Error:", error)
    return NextResponse.json({
      choices: [
        {
          message: {
            role: "assistant",
            content: "Hi! I am the Portfolio AI assistant. You can explore skills, projects, and career highlights right here on the portfolio!",
          },
        },
      ],
    })
  }
}
