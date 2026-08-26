import type { ReadFailure } from "@/lib/read-failure"
import { TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  PartitionEventRow,
  type PartitionEventRowData,
} from "@/components/partition-events/partition-event-row"
import {
  SourceHeaderFilter,
  EnumHeaderFilter,
  toFilterOptions,
  TimeHeaderFilter,
} from "@/components/shared/table-controls"
import { PARTITION_STATUS_OPTIONS } from "@/lib/catalog-enums"
import { TextHead } from "@/components/shared/text-cell"
import { TableEmptyState } from "@/components/shared/table-empty-state"
import { isPastEnd } from "@/lib/pagination"
import { SummaryTableShell } from "@/components/shared/summary-table-shell"
import { ActivityIcon } from "lucide-react"
import {
  SOURCE_NAME_COLUMN,
  SOURCE_NAME_COLUMN_WIDTH,
  UPDATED_AT_COLUMN,
  UPDATED_AT_COLUMN_WIDTH,
  EVENT_ID_COLUMN,
  EVENT_ID_COLUMN_WIDTH,
  EVENT_ID_COLUMN_WIDTH_REM,
  remainingColumnWidth,
} from "@/components/shared/table-column-widths"

interface Props {
  data: PartitionEventRowData[]
  sourceOptions: string[]
  limit: number
  offset: number
  total: number
  onRowClick?: (id: number) => void
  failure?: ReadFailure
  filtered?: boolean
  title?: string
  className?: string
}

export function PartitionEventTable({
  data,
  sourceOptions,
  limit,
  offset,
  total,
  onRowClick,
  failure,
  filtered,
  title = "Partition Events",
  className,
}: Props) {
  return (
    <SummaryTableShell
      title={title}
      icon={ActivityIcon}
      limit={limit}
      offset={offset}
      total={total}
      footerUnit="events"
      className={className}
      columns={[
        EVENT_ID_COLUMN_WIDTH,
        SOURCE_NAME_COLUMN_WIDTH,
        remainingColumnWidth(1 / 6, EVENT_ID_COLUMN_WIDTH_REM),
        remainingColumnWidth(1 / 6, EVENT_ID_COLUMN_WIDTH_REM),
        remainingColumnWidth(1 / 6, EVENT_ID_COLUMN_WIDTH_REM),
        remainingColumnWidth(1 / 6, EVENT_ID_COLUMN_WIDTH_REM),
        remainingColumnWidth(1 / 6, EVENT_ID_COLUMN_WIDTH_REM),
        remainingColumnWidth(1 / 6, EVENT_ID_COLUMN_WIDTH_REM),
        UPDATED_AT_COLUMN_WIDTH,
      ]}
    >
      <TableHeader>
        <TableRow>
          <TextHead className={EVENT_ID_COLUMN}>partition_event_id</TextHead>
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
            <EnumHeaderFilter
              label="status"
              paramKey="status"
              options={toFilterOptions(PARTITION_STATUS_OPTIONS)}
            />
          </TableHead>
          <TextHead>score</TextHead>
          <TableHead className={UPDATED_AT_COLUMN}>
            <TimeHeaderFilter label="updated_at" paramKey="updated_within" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableEmptyState
            colSpan={9}
            failure={failure}
            filtered={filtered}
            pastEnd={isPastEnd(offset, total)}
          />
        ) : (
          data.map((row) => (
            <PartitionEventRow
              key={row.partitionEventId}
              data={row}
              onClick={onRowClick ? () => onRowClick(row.partitionEventId) : undefined}
            />
          ))
        )}
      </TableBody>
    </SummaryTableShell>
  )
}
