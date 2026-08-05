"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, AlertCircle, Info, XCircle } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start gap-3">
              {/* Icon based on variant */}
              {variant === "success" && <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-400" />}
              {variant === "destructive" && <XCircle className="mt-0.5 h-5 w-5 text-red-400" />}
              {variant === "warning" && <AlertCircle className="mt-0.5 h-5 w-5 text-amber-400" />}
              {(!variant || variant === "default") && <Info className="mt-0.5 h-5 w-5 text-blue-400" />}
              
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
