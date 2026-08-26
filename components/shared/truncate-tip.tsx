"use client"

import * as React from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Truncating text that shows a styled tooltip with the full value — but ONLY when
// the text actually overflows its box. Relies on the app-root TooltipProvider.
// Renders a block span so it fills a table-fixed cell; min-w-0 lets it also shrink
// as a flex item inside link/badge atoms.
export function TruncateTip({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const [overflowing, setOverflowing] = React.useState(false)
  const full =
    typeof children === "string" || typeof children === "number" ? String(children) : undefined

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setOverflowing(el.scrollWidth > el.clientWidth)
    measure()
    if (typeof ResizeObserver === "undefined") return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [full])

  return (
    <Tooltip>
      <TooltipTrigger
        render={<span ref={ref} className={cn("block min-w-0 truncate", className)} />}
      >
        {children}
      </TooltipTrigger>
      {overflowing && full ? (
        <TooltipContent className="max-w-sm break-all">{full}</TooltipContent>
      ) : null}
    </Tooltip>
  )
}
