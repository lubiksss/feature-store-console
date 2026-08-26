import type { ReadFailure } from "@/lib/read-failure"
import { TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  FeatureViewScheduleRow,
  type FeatureViewScheduleRowData,
} from "@/components/feature-view-schedules/feature-view-schedule-row"
import {
  SourceHeaderFilter,
  EnumHeaderFilter,
  toFilterOptions,
} from "@/components/shared/table-controls"
import { BOOL_OPTIONS, SCHEDULABLE_SOURCE_EVENT_KIND_OPTIONS } from "@/lib/catalog-enums"
import { TextHead } from "@/components/shared/text-cell"
import { TableEmptyState } from "@/components/shared/table-empty-state"
import { isPastEnd } from "@/lib/pagination"
import { SummaryTableShell } from "@/components/shared/summary-table-shell"
import { CalendarClockIcon } from "lucide-react"
import { ListAddMenu } from "@/components/shared/list-add-menu"
import {
  SOURCE_NAME_COLUMN,
  SOURCE_NAME_COLUMN_WIDTH,
  UPDATED_AT_COLUMN,
  UPDATED_AT_COLUMN_WIDTH,
  remainingColumnWidth,
} from "@/components/shared/table-column-widths"

interface Props {
  data: FeatureViewScheduleRowData[]
  sourceOptions: string[]
  limit: number
  offset: number
  total: number
  onRowClick?: (scheduleId: number) => void
  addHref?: string
  canEdit?: boolean
  failure?: ReadFailure
  filtered?: boolean
  title?: string
  className?: string
}

export function FeatureViewScheduleTable({
  data,
  sourceOptions,
  limit,
  offset,
  total,
  onRowClick,
  addHref,
  canEdit = false,
  failure,
  filtered,
  title = "Feature View Schedules",
  className,
}: Props) {
  return (
    <SummaryTableShell
      title={title}
      icon={CalendarClockIcon}
      action={addHref ? <ListAddMenu addHref={addHref} canEdit={canEdit} /> : undefined}
      limit={limit}
      offset={offset}
      total={total}
      footerUnit="schedules"
      className={className}
      columns={[
        SOURCE_NAME_COLUMN_WIDTH,
        remainingColumnWidth(0.25),
        remainingColumnWidth(0.35),
        remainingColumnWidth(0.4),
        UPDATED_AT_COLUMN_WIDTH,
      ]}
    >
      <TableHeader>
        <TableRow>
          <TableHead className={SOURCE_NAME_COLUMN}>
            <SourceHeaderFilter label="feature_view_name" options={sourceOptions} />
          </TableHead>
          <TableHead>
            <EnumHeaderFilter
              label="event_kind"
              paramKey="event_kind"
              options={toFilterOptions(SCHEDULABLE_SOURCE_EVENT_KIND_OPTIONS)}
            />
          </TableHead>
          <TextHead>cron_expression</TextHead>
          <TableHead>
            <EnumHeaderFilter
              label="schedule_enabled"
              paramKey="schedule_enabled"
              options={toFilterOptions(BOOL_OPTIONS)}
              single
            />
          </TableHead>
          <TextHead className={UPDATED_AT_COLUMN}>updated_at</TextHead>
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
            <FeatureViewScheduleRow
              key={row.scheduleId}
              data={row}
              onClick={onRowClick ? () => onRowClick(row.scheduleId) : undefined}
            />
          ))
        )}
      </TableBody>
    </SummaryTableShell>
  )
}
