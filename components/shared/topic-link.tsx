"use client"

import Link from "next/link"
import { WavesIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TruncateTip } from "@/components/shared/truncate-tip"
import { cn } from "@/lib/utils"

interface Props {
  topic: string
  broker?: string
  className?: string
}

// "broker-a.example.net:9092" → "broker-a"
function clusterOf(broker: string): string {
  return broker.split(".")[0]
}

function monitorUrl(cluster: string, topic: string): string {
  const params = new URLSearchParams({
    orgId: "1",
    "var-cluster": cluster,
    "var-topic": topic,
  })
  return `http://kafka-monitor.example.net:3000/d/kafka-topics/kafka-topics?${params.toString()}`
}

// With a broker, TopicLink shows its own always-on tooltip carrying extra info
// (broker + topic), not the overflow-gated TruncateTip. The app-root TooltipProvider
// (app/layout) covers it — no local provider needed. Without a broker it's plain
// text, so it uses TruncateTip like every other truncating cell.
export function TopicLink({ topic, broker, className }: Props) {
  if (!broker) {
    return (
      <span className={cn("inline-flex min-w-0 max-w-full items-center gap-1", className)}>
        <WavesIcon className="size-3 shrink-0" />
        <TruncateTip>{topic}</TruncateTip>
      </span>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            href={monitorUrl(clusterOf(broker), topic)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "inline-flex min-w-0 max-w-full items-center gap-1 hover:text-foreground hover:underline transition-colors",
              className,
            )}
          />
        }
      >
        <WavesIcon className="size-3 shrink-0" />
        <span className="truncate">{topic}</span>
      </TooltipTrigger>
      <TooltipContent className="flex-col items-start gap-0.5">
        <span>{broker}</span>
        <span>/ {topic}</span>
      </TooltipContent>
    </Tooltip>
  )
}
