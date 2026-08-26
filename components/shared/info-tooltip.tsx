"use client"

import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Small info icon with a hover tooltip. Relies on the app-root TooltipProvider
// (same pattern as TruncateTip / TopicLink). Used next to field labels where a
// short explanation of the field's contract / system role helps the operator.
export function InfoTooltip({ text, className }: { text: string; className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger render={<span className={cn("inline-flex", className)} />}>
        <InfoIcon className="size-3.5 text-foreground" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">{text}</TooltipContent>
    </Tooltip>
  )
}
