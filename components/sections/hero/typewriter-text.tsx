"use client"

import { useState, useEffect } from "react"

interface TypewriterTextProps {
  texts: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  className?: string
}

/**
 * TypewriterText cycles through an array of strings with a typing/deleting animation.
 * Fully accessible — screen readers see all roles, visual users see animation.
 */
export function TypewriterText({
  texts,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
  className = "",
}: TypewriterTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fullText = texts[currentIndex]
    let timeout: NodeJS.Timeout

    if (!isDeleting && currentText === fullText) {
      // Pause at full text
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration)
    } else if (isDeleting && currentText === "") {
      // Move to next text
      setIsDeleting(false)
      setCurrentIndex((prev) => (prev + 1) % texts.length)
    } else {
      // Type or delete
      const nextText = isDeleting
        ? fullText.substring(0, currentText.length - 1)
        : fullText.substring(0, currentText.length + 1)
      timeout = setTimeout(() => setCurrentText(nextText), isDeleting ? deletingSpeed : typingSpeed)
    }

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, currentIndex, texts, typingSpeed, deletingSpeed, pauseDuration])

  return (
    <span className={className}>
      {currentText}
      <span className="ml-1 animate-pulse text-blue-400" aria-hidden="true">
        |
      </span>
      <span className="sr-only">{texts.join(", ")}</span>
    </span>
  )
}
