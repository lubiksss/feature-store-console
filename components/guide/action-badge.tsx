import type { LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// 액션 이름 뱃지. 액션에는 enum이 없어(Pause/Resume/Redraft는 이벤트를 남기지 않는 동기 전이)
// EnumBadge를 쓸 수 없으므로, 액션 메뉴와 같은 lucide 아이콘을 단 outline 뱃지로 통일한다.
// 상태 머신 도식과 액션 표가 같은 것을 쓰게 두어 두 곳이 갈라지지 않는다.
export function ActionBadge({
  icon: Icon,
  text,
  className,
}: {
  icon: LucideIcon
  text: string
  className?: string
}) {
  return (
    <Badge variant="outline" className={cn(className)}>
      <Icon className="size-3" />
      {text}
    </Badge>
  )
}
