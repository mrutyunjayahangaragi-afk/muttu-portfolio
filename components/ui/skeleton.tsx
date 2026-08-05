import { cn } from "@/lib/utils"

// ─── Skeleton Primitives ─────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton", className)}
      role="status"
      aria-label="Loading"
    />
  )
}

export function SkeletonText({ className, lines = 3 }: SkeletonProps & { lines?: number }) {
  return (
    <div className={cn("space-y-2", className)} role="status" aria-label="Loading text">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "skeleton h-4",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  )
}

export function SkeletonCircle({ className, size = 48 }: SkeletonProps & { size?: number }) {
  return (
    <div
      className={cn("skeleton rounded-full", className)}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  )
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn("glass rounded-2xl p-6 space-y-4", className)} role="status" aria-label="Loading card">
      <Skeleton className="h-40 w-full rounded-xl" />
      <Skeleton className="h-6 w-3/4" />
      <SkeletonText lines={2} />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-14 rounded-full" />
      </div>
    </div>
  )
}

export function SkeletonGrid({
  count = 6,
  className,
}: SkeletonProps & { count?: number }) {
  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
