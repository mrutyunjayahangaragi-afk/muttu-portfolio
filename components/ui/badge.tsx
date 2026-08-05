import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-blue-500/10 text-blue-300 border border-blue-500/20",
        secondary: "bg-white/10 text-white/70 border border-white/10",
        blue: "bg-blue-500/10 text-blue-300 border border-blue-500/20",
        purple: "bg-purple-500/10 text-purple-300 border border-purple-500/20",
        green: "bg-green-500/10 text-green-300 border border-green-500/20",
        amber: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
        red: "bg-red-500/10 text-red-300 border border-red-500/20",
        outline: "border border-white/20 text-white/70",
        success: "bg-green-500/10 text-green-300 border border-green-500/20",
        warning: "bg-amber-500/10 text-amber-300 border border-amber-500/20",
        destructive: "bg-red-500/10 text-red-300 border border-red-500/20",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  pulse?: boolean
}

function Badge({ className, variant, size, pulse, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            variant === 'green' || variant === 'success' ? "bg-green-400" :
            variant === 'red' || variant === 'destructive' ? "bg-red-400" :
            variant === 'amber' || variant === 'warning' ? "bg-amber-400" :
            variant === 'purple' ? "bg-purple-400" :
            "bg-blue-400"
          )}></span>
          <span className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            variant === 'green' || variant === 'success' ? "bg-green-500" :
            variant === 'red' || variant === 'destructive' ? "bg-red-500" :
            variant === 'amber' || variant === 'warning' ? "bg-amber-500" :
            variant === 'purple' ? "bg-purple-500" :
            "bg-blue-500"
          )}></span>
        </span>
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
