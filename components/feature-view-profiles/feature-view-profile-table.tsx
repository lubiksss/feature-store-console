import type { ReadFailure } from "@/lib/read-failure"
import { TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  FeatureViewProfileRow,
  type FeatureViewProfileRowData,
} from "@/components/feature-view-profiles/feature-view-profile-row"
import { SourceHeaderFilter } from "@/components/shared/table-controls"
import { TextHead } from "@/components/shared/text-cell"
import { TableEmptyState } from "@/components/shared/table-empty-state"
import { isPastEnd } from "@/lib/pagination"
import { SummaryTableShell } from "@/components/shared/summary-table-shell"
import { ChartColumnIcon } from "lucide-react"
import {
  SOURCE_NAME_COLUMN,
  SOURCE_NAME_COLUMN_WIDTH,
  UPDATED_AT_COLUMN,
  UPDATED_AT_COLUMN_WIDTH,
  remainingColumnWidth,
} from "@/components/shared/table-column-widths"

interface Props {
  data: FeatureViewProfileRowData[]
  sourceOptions: string[]
  limit: number
  offset: number
  total: number
  onRowClick?: (row: FeatureViewProfileRowData) => void
  failure?: ReadFailure
  filtered?: boolean
  title?: string
  className?: string
}

export function FeatureViewProfileTable({
  data,
  sourceOptions,
  limit,
  offset,
  total,
  onRowClick,
  failure,
  filtered,
  title = "Feature View Profiles",
  className,
}: Props) {
  return (
    <SummaryTableShell
      title={title}
      icon={ChartColumnIcon}
      limit={limit}
      offset={offset}
      total={total}
      footerUnit="profiles"
      className={className}
      columns={[
        SOURCE_NAME_COLUMN_WIDTH,
        remainingColumnWidth(0.16),
        remainingColumnWidth(0.08),
        remainingColumnWidth(0.08),
        remainingColumnWidth(0.2),
        remainingColumnWidth(0.32),
        remainingColumnWidth(0.16),
        UPDATED_AT_COLUMN_WIDTH,
      ]}
    >
      <TableHeader>
        <TableRow>
          <TableHead className={SOURCE_NAME_COLUMN}>
            <SourceHeaderFilter label="feature_view_name" options={sourceOptions} />
          </TableHead>
          <TableHead>
            <SourceHeaderFilter label="dt" paramKey="dt" options={[]} />
          </TableHead>
          <TableHead>
            <SourceHeaderFilter label="hr" paramKey="hr" options={[]} />
          </TableHead>
          <TableHead>
            <SourceHeaderFilter label="min" paramKey="min" options={[]} />
          </TableHead>
          <TableHead>
            <SourceHeaderFilter label="segment" paramKey="segment" options={[]} />
          </TableHead>
          <TableHead>
            <SourceHeaderFilter label="field_path" paramKey="field_path" options={[]} />
          </TableHead>
          <TableHead>
            <SourceHeaderFilter label="field_type" paramKey="field_type" options={[]} />
          </TableHead>
          <TextHead className={UPDATED_AT_COLUMN}>created_at</TextHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableEmptyState
            colSpan={8}
            failure={failure}
            filtered={filtered}
            pastEnd={isPastEnd(offset, total)}
          />
        ) : (
          data.map((row) => (
            <FeatureViewProfileRow
              key={`${row.featureViewName}:${row.dt}:${row.hr}:${row.min}:${row.segment}:${row.fieldPath}`}
              data={row}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            />
          ))
        )}
      </TableBody>
    </SummaryTableShell>
  )
}
