"use client"

import Link from "next/link"
import { Clock, Eye, MapPin, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface RequestCardProps {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  urgency: "low" | "medium" | "high" | "critical"
  status: "open" | "in_progress" | "resolved" | "closed"
  authorName: string
  location: string
  views: number
  createdAt: string
  helpersCount: number
  className?: string
}

const urgencyColors = {
  low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  critical: "bg-red-500/10 text-red-500 border-red-500/20",
}

const statusColors = {
  open: "bg-blue-500/10 text-blue-500",
  in_progress: "bg-violet-500/10 text-violet-500",
  resolved: "bg-emerald-500/10 text-emerald-500",
  closed: "bg-muted text-muted-foreground",
}

const categoryLabels: Record<string, string> = {
  technical: "Technical",
  career: "Career",
  academic: "Academic",
  creative: "Creative",
  life: "Life",
  other: "Other",
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

export function RequestCard({
  id,
  title,
  description,
  category,
  tags,
  urgency,
  status,
  authorName,
  location,
  views,
  createdAt,
  helpersCount,
  className,
}: RequestCardProps) {
  return (
    <Link href={`/dashboard/requests/${id}`}>
      <Card
        className={cn(
          "group hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer overflow-hidden border-border/50",
          className
        )}
      >
        <CardContent className="p-5">
          {/* Top: Category + Urgency + Status */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">
              {categoryLabels[category] || category}
            </Badge>
            <Badge className={cn("text-[10px] font-bold uppercase tracking-wider border", urgencyColors[urgency])}>
              {urgency}
            </Badge>
            <Badge className={cn("text-[10px] font-bold uppercase tracking-wider border-none", statusColors[status])}>
              {status.replace("_", " ")}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1.5">
            {title}
          </h3>

          {/* Description preview */}
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-md bg-accent text-accent-foreground font-medium"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 4 && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-accent text-muted-foreground">
                  +{tags.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Footer: Author, Location, Views, Time */}
          <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-3 border-t border-border/50">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {authorName}
              </span>
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {location}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {views}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo(createdAt)}
              </span>
              {helpersCount > 0 && (
                <span className="text-primary font-medium">
                  {helpersCount} helper{helpersCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
