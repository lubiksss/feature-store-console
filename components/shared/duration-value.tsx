import { ClockIcon } from "lucide-react"
import { IconBadge } from "@/components/shared/icon-badge"
import { exactDurationUnit } from "@/lib/duration"

// 기간 헬퍼 뱃지만 따로. 읽기 뷰(DurationValue)와 폼 입력(form-fields의 numberField)이 같은
// 표기를 써야 하므로 마크업을 여기 한 곳에 둔다.
export function DurationBadge({ totalSeconds }: { totalSeconds: number }) {
  const { value, unit } = exactDurationUnit(totalSeconds)
  return <IconBadge icon={ClockIcon}>{`${value} ${unit}`}</IconBadge>
}

// raw 값(단위 없이) + 정확히 나누어지는 가장 큰 단위 하나의 헬퍼 뱃지.
export function DurationValue({ raw, totalSeconds }: { raw: number; totalSeconds: number }) {
  return (
    <span className="inline-flex items-center gap-1 tabular-nums">
      {raw}
      <DurationBadge totalSeconds={totalSeconds} />
    </span>
  )
}
