"use client"

import dynamic from "next/dynamic"

const AiChatModule = dynamic(
  () => import("./ai-chat").then((m) => ({ default: m.AiChat })),
  { ssr: false }
)

export function AiChatWrapper() {
  return <AiChatModule />
}
