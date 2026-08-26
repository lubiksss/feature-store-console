import { TableCell, TableRow } from "@/components/ui/table"
import { FeatureViewNameLink } from "@/components/shared/feature-view-name-link"
import { EventIdBadge } from "@/components/shared/event-id-badge"
import { EnumBadge } from "@/components/shared/enum-badges"
import { ConsistencyScoreBadge } from "@/components/shared/consistency-score-badge"
import { TextCell } from "@/components/shared/text-cell"
import { display } from "@/lib/display"

export interface PartitionEventRowData {
  partitionEventId: number
  featureViewName: string
  dt: string
  hr?: string
  min?: string
  segment: string
  status: string
  // consistency score joined from the consistency result (null when no result yet).
  score?: number | null
  updatedAt: string
}

interface Props {
  data: PartitionEventRowData
  onClick?: () => void
}

export function PartitionEventRow({ data, onClick }: Props) {
  return (
    <TableRow className={onClick ? "cursor-pointer" : undefined} onClick={onClick}>
      <TableCell>
        <EventIdBadge eventId={data.partitionEventId} displayModulo={1_000} />
      </TableCell>
      <TableCell>
        <FeatureViewNameLink
          featureViewName={data.featureViewName}
          href={`/partition-events?feature_view_name=${encodeURIComponent(data.featureViewName)}`}
        />
      </TableCell>
      <TextCell className="tabular-nums">{data.dt}</TextCell>
      <TextCell className="tabular-nums">{display(data.hr)}</TextCell>
      <TextCell className="tabular-nums">{display(data.min)}</TextCell>
      <TextCell>{display(data.segment)}</TextCell>
      <TableCell>
        <EnumBadge set="partitionStatus" value={data.status} postfix />
      </TableCell>
      <TableCell>
        <ConsistencyScoreBadge score={data.score} />
      </TableCell>
      <TextCell className="tabular-nums">{data.updatedAt}</TextCell>
    </TableRow>
  )
}
