"use client"

import { cn } from "@/lib/utils"

interface TrustScoreProps {
  score: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
}

export function TrustScore({ score, size = "md", showLabel = true, className }: TrustScoreProps) {
  const sizes = {
    sm: { container: "w-12 h-12", text: "text-xs", ring: 3 },
    md: { container: "w-20 h-20", text: "text-lg", ring: 4 },
    lg: { container: "w-28 h-28", text: "text-2xl", ring: 5 },
  }

  const getColor = (score: number) => {
    if (score >= 80) return { stroke: "#10b981", bg: "bg-emerald-500/10" }
    if (score >= 60) return { stroke: "#8b5cf6", bg: "bg-violet-500/10" }
    if (score >= 40) return { stroke: "#f59e0b", bg: "bg-amber-500/10" }
    return { stroke: "#ef4444", bg: "bg-red-500/10" }
  }

  const { container, text, ring } = sizes[size]
  const { stroke, bg } = getColor(score)
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (score / 100) * circumference

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div className={cn("relative flex items-center justify-center", container)}>
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth={ring}
            className="text-border"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={stroke}
            strokeWidth={ring}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className={cn("font-bold", text)}>{score}</span>
      </div>
      {showLabel && (
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Trust Score
        </span>
      )}
    </div>
  )
}
