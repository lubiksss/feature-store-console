import { TableCell, TableRow } from "@/components/ui/table"
import { FeatureViewNameLink } from "@/components/shared/feature-view-name-link"
import { EventIdBadge } from "@/components/shared/event-id-badge"
import { EnumBadge } from "@/components/shared/enum-badges"
import { TextCell } from "@/components/shared/text-cell"

export interface FeatureViewEventRowData {
  featureViewEventId: number
  eventKind: string
  featureViewName: string
  status: string
  updatedAt: string
}

interface Props {
  data: FeatureViewEventRowData
  onClick?: () => void
}

export function FeatureViewEventRow({ data, onClick }: Props) {
  return (
    <TableRow className={onClick ? "cursor-pointer" : undefined} onClick={onClick}>
      <TableCell>
        <EventIdBadge eventId={data.featureViewEventId} displayModulo={1_000} />
      </TableCell>
      <TableCell>
        <FeatureViewNameLink
          featureViewName={data.featureViewName}
          href={`/feature-view-events?feature_view_name=${encodeURIComponent(data.featureViewName)}`}
        />
      </TableCell>
      <TableCell>
        <EnumBadge set="featureViewEventKind" value={data.eventKind} />
      </TableCell>
      <TableCell>
        <EnumBadge set="eventStatus" value={data.status} />
      </TableCell>
      <TextCell className="tabular-nums">{data.updatedAt}</TextCell>
    </TableRow>
  )
}
