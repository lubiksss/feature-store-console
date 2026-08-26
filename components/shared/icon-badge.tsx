import type * as React from "react"
import type { LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TruncateTip } from "@/components/shared/truncate-tip"
import { cn } from "@/lib/utils"

interface Props {
  icon?: LucideIcon
  // 아이콘 자리에 놓을 요소(프로필 사진 등). icon보다 우선한다.
  leading?: React.ReactNode
  variant?: React.ComponentProps<typeof Badge>["variant"]
  className?: string
  children: React.ReactNode
}

export function IconBadge({
  icon: Icon,
  leading,
  variant = "outline",
  className,
  children,
}: Props) {
  return (
    <Badge variant={variant} className={cn("max-w-full min-w-0", className)}>
      {leading ?? (Icon && <Icon className="size-3" />)}
      <TruncateTip>{children}</TruncateTip>
    </Badge>
  )
}
