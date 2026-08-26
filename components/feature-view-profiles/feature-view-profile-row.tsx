import { TableCell, TableRow } from "@/components/ui/table"
import { FeatureViewNameLink } from "@/components/shared/feature-view-name-link"
import { FieldTypeBadge } from "@/components/shared/enum-badges"
import { TextCell } from "@/components/shared/text-cell"
import { display } from "@/lib/display"

export interface FeatureViewProfileRowData {
  featureViewName: string
  dt: string
  hr?: string
  min?: string
  segment?: string
  fieldPath: string
  fieldType: string
  createdAt: string
}

interface Props {
  data: FeatureViewProfileRowData
  onClick?: () => void
}

export function FeatureViewProfileRow({ data, onClick }: Props) {
  return (
    <TableRow className={onClick ? "cursor-pointer" : undefined} onClick={onClick}>
      <TableCell>
        <FeatureViewNameLink
          featureViewName={data.featureViewName}
          href={`/feature-view-profiles?feature_view_name=${encodeURIComponent(data.featureViewName)}`}
        />
      </TableCell>
      <TextCell className="tabular-nums">{data.dt}</TextCell>
      <TextCell className="tabular-nums">{display(data.hr)}</TextCell>
      <TextCell className="tabular-nums">{display(data.min)}</TextCell>
      <TextCell>{display(data.segment)}</TextCell>
      <TextCell>{data.fieldPath}</TextCell>
      <TableCell>
        <FieldTypeBadge value={data.fieldType} compact />
      </TableCell>
      <TextCell className="tabular-nums">{data.createdAt}</TextCell>
    </TableRow>
  )
}
