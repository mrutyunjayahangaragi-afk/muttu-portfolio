import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminStatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  color?: string
  change?: string
}

export function AdminStatCard({
  title,
  value,
  icon: Icon,
  color = "from-blue-500 to-cyan-500",
  change,
}: AdminStatCardProps) {
  return (
    <div className="glass rounded-2xl border border-white/10 p-5 transition-colors hover:border-white/20">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-white/60">{title}</span>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br",
            color
          )}
        >
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
      {change && <div className="mt-1 text-xs text-white/40">{change}</div>}
    </div>
  )
}
