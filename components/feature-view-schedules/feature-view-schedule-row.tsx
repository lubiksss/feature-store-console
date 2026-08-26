import { TableCell, TableRow } from "@/components/ui/table"
import { FeatureViewNameLink } from "@/components/shared/feature-view-name-link"
import { EnumBadge } from "@/components/shared/enum-badges"
import { TextCell } from "@/components/shared/text-cell"
import type { SchedulableFeatureViewEventKind } from "@/lib/meta-client"

export interface FeatureViewScheduleRowData {
  // 주어가 먼저다 — 이 평면의 주어는 피처 뷰 하나이고, 그것이 행을 읽는 순서의 시작이다.
  featureViewName: string
  eventKind: SchedulableFeatureViewEventKind
  scheduleId: number
  cronExpression?: string
  scheduleEnabled: boolean
  updatedAt: string
}

interface Props {
  data: FeatureViewScheduleRowData
  onClick?: () => void
}

export function FeatureViewScheduleRow({ data, onClick }: Props) {
  return (
    <TableRow className={onClick ? "cursor-pointer" : undefined} onClick={onClick}>
      <TableCell>
        <FeatureViewNameLink
          featureViewName={data.featureViewName}
          href={`/feature-view-schedules?feature_view_name=${encodeURIComponent(data.featureViewName)}`}
        />
      </TableCell>
      <TableCell>
        <EnumBadge set="schedulableFeatureViewEventKind" value={data.eventKind} />
      </TableCell>
      <TextCell>{data.cronExpression ?? "-"}</TextCell>
      <TableCell>
        <EnumBadge set="bool" value={String(data.scheduleEnabled)} />
      </TableCell>
      <TextCell className="tabular-nums">{data.updatedAt}</TextCell>
    </TableRow>
  )
}
