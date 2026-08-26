import { CheckCircle2Icon, TriangleAlertIcon, XCircleIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { displayScore } from "@/lib/display"

interface Props {
  score?: number | null
  className?: string
}

function toneClass(score: number): string {
  if (score >= 80) return "bg-status-active text-status-active-fg"
  if (score >= 50) return "bg-status-validating text-status-validating-fg"
  return "bg-status-failed text-status-failed-fg"
}

function scoreIcon(score: number) {
  if (score >= 80) return <CheckCircle2Icon className="size-3" />
  if (score >= 50) return <TriangleAlertIcon className="size-3" />
  return <XCircleIcon className="size-3" />
}

export function ConsistencyScoreBadge({ score, className }: Props) {
  if (score == null) {
    return <span className="text-sm text-muted-foreground">-</span>
  }
  return (
    <Badge className={cn("border-transparent tabular-nums", toneClass(score), className)}>
      {scoreIcon(score)}
      {displayScore(score)}
    </Badge>
  )
}
