"use client"

import Link from "next/link"
import { GitCommitHorizontalIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Props {
  eventId: number
  displayModulo?: number
  href?: string
  className?: string
}

export function EventIdBadge({ eventId, displayModulo, href, className }: Props) {
  const displayedEventId = displayModulo ? eventId % displayModulo : eventId

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 tabular-nums",
        href && "cursor-pointer hover:bg-accent transition-colors",
        className,
      )}
      title={displayModulo ? String(eventId) : undefined}
      render={href ? <Link href={href} onClick={(e) => e.stopPropagation()} /> : undefined}
    >
      <GitCommitHorizontalIcon className="size-3 shrink-0" />
      {displayedEventId}
    </Badge>
  )
}
