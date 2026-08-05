"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"

type Message = {
  role: "user" | "assistant"
  content: string
}

const SUGGESTIONS = [
  "What projects have you built?",
  "What are your core technical skills?",
  "Tell me about your hackathon achievements.",
  "Are you available for freelance work?",
]

export function AiChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm the portfolio AI assistant. Ask me anything about my experience, skills, or projects!",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return

    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      })

      const data = await response.json()

      if (data.error) {
        setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${data.error}` }])
      } else if (data.choices && data.choices[0]) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.choices[0].message.content }])
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't process that response." }])
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error occurred." }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    const text = input
    setInput("")
    handleSendMessage(text)
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-4 z-50 flex h-[550px] w-[360px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#050810]/95 shadow-2xl backdrop-blur-2xl sm:right-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3.5">
              <div className="flex items-center gap-2 text-white">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/25">
                  <Sparkles size={16} className="text-blue-400 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold leading-none">Portfolio AI</span>
                  <span className="text-[10px] text-emerald-400 mt-1 leading-none flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-white/50 transition-all hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  key={i}
                  className={cn("flex gap-3", m.role === "user" ? "flex-row-reverse" : "")}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                      m.role === "user" 
                        ? "bg-blue-500/10 border-blue-500/25 text-blue-400" 
                        : "bg-purple-500/10 border-purple-500/25 text-purple-400"
                    )}
                  >
                    {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm max-w-[80%] leading-relaxed shadow-sm",
                      m.role === "user"
                        ? "bg-blue-500/10 text-blue-100 border border-blue-500/10"
                        : "bg-white/5 text-white/90 border border-white/5"
                    )}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-400">
                    <Bot size={14} />
                  </div>
                  <div className="flex items-center rounded-2xl bg-white/5 border border-white/5 px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/40 animate-bounce" />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Chips */}
            {messages.length === 1 && !isLoading && (
              <div className="px-4 py-2 flex flex-wrap gap-2 border-t border-white/5 bg-black/10">
                {SUGGESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(suggestion)}
                    className="text-left text-[11px] font-medium px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-blue-500/5 text-white/70 hover:text-blue-300 transition-all select-none cursor-pointer"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="border-t border-white/10 bg-black/40 p-3">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-4 pr-12 text-sm text-white placeholder-white/35 outline-none focus:border-blue-500/40"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white disabled:opacity-30 disabled:scale-100 transition-all hover:scale-105 active:scale-95 hover:bg-blue-600 cursor-pointer"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulsing AI Orb Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-xl hover:scale-110 active:scale-95 transition-transform duration-300 group cursor-pointer"
        aria-label="Toggle AI assistant"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-30 blur-md group-hover:scale-125 transition-transform animate-pulse" />
        {isOpen ? (
          <X size={22} className="relative z-10" />
        ) : (
          <MessageSquare size={22} className="relative z-10 animate-float" style={{ animationDuration: '3s' }} />
        )}
      </button>
    </>
  )
}
