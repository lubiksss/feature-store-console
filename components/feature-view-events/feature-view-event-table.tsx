import type { ReadFailure } from "@/lib/read-failure"
import { TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  FeatureViewEventRow,
  type FeatureViewEventRowData,
} from "@/components/feature-view-events/feature-view-event-row"
import {
  SourceHeaderFilter,
  EnumHeaderFilter,
  toFilterOptions,
  TimeHeaderFilter,
} from "@/components/shared/table-controls"
import { SOURCE_EVENT_KIND_OPTIONS, EVENT_STATUS_OPTIONS } from "@/lib/catalog-enums"
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
  data: FeatureViewEventRowData[]
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

export function FeatureViewEventTable({
  data,
  sourceOptions,
  limit,
  offset,
  total,
  onRowClick,
  failure,
  filtered,
  title = "Feature View Events",
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
        remainingColumnWidth(1 / 2, EVENT_ID_COLUMN_WIDTH_REM),
        remainingColumnWidth(1 / 2, EVENT_ID_COLUMN_WIDTH_REM),
        UPDATED_AT_COLUMN_WIDTH,
      ]}
    >
      <TableHeader>
        <TableRow>
          <TextHead className={EVENT_ID_COLUMN}>feature_view_event_id</TextHead>
          {/* id 다음이 주어다. 이벤트 세 목록이 같은 자리에서 같은 폭으로 이름을 보여줘야
              화면을 옮길 때 눈이 자리를 다시 찾지 않는다. */}
          <TableHead className={SOURCE_NAME_COLUMN}>
            <SourceHeaderFilter label="feature_view_name" options={sourceOptions} />
          </TableHead>
          <TableHead>
            <EnumHeaderFilter
              label="event_kind"
              paramKey="event_kind"
              options={toFilterOptions(SOURCE_EVENT_KIND_OPTIONS)}
            />
          </TableHead>
          <TableHead>
            <EnumHeaderFilter
              label="status"
              paramKey="status"
              options={toFilterOptions(EVENT_STATUS_OPTIONS)}
            />
          </TableHead>
          <TableHead className={UPDATED_AT_COLUMN}>
            <TimeHeaderFilter label="updated_at" paramKey="updated_within" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableEmptyState
            colSpan={5}
            failure={failure}
            filtered={filtered}
            pastEnd={isPastEnd(offset, total)}
          />
        ) : (
          data.map((row) => (
            <FeatureViewEventRow
              key={row.featureViewEventId}
              data={row}
              onClick={onRowClick ? () => onRowClick(row.featureViewEventId) : undefined}
            />
          ))
        )}
      </TableBody>
    </SummaryTableShell>
  )
}
