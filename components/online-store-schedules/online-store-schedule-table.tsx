import type { ReadFailure } from "@/lib/read-failure"
import { TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  StoreEventScheduleRow,
  type StoreEventScheduleRowData,
} from "@/components/online-store-schedules/online-store-schedule-row"
import {
  EnumHeaderFilter,
  SourceHeaderFilter,
  toFilterOptions,
} from "@/components/shared/table-controls"
import { BOOL_OPTIONS, SCHEDULABLE_STORE_EVENT_KIND_OPTIONS } from "@/lib/catalog-enums"
import { TextHead } from "@/components/shared/text-cell"
import { TableEmptyState } from "@/components/shared/table-empty-state"
import { isPastEnd } from "@/lib/pagination"
import { SummaryTableShell } from "@/components/shared/summary-table-shell"
import { CalendarClockIcon } from "lucide-react"
import { ListAddMenu } from "@/components/shared/list-add-menu"
import {
  STORE_NAME_COLUMN,
  STORE_NAME_COLUMN_WIDTH,
  UPDATED_AT_COLUMN,
  UPDATED_AT_COLUMN_WIDTH,
  remainingColumnWidth,
} from "@/components/shared/table-column-widths"

interface Props {
  data: StoreEventScheduleRowData[]
  // 두 어휘 모두 서버의 테이블에서 온다(fs_store / fs_entity). 닫힌 enum 이 아니므로
  // 칩 목록이 아니라 타입어헤드다 — 콘솔이 모르는 값도 걸러볼 수 있어야 한다.
  storeNameOptions?: string[]
  storeKindOptions?: string[]
  entityOptions?: string[]
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

export function StoreEventScheduleTable({
  data,
  storeNameOptions = [],
  storeKindOptions = [],
  entityOptions = [],
  limit,
  offset,
  total,
  onRowClick,
  addHref,
  canEdit = false,
  failure,
  filtered,
  title = "Online Store Schedules",
  className,
}: Props) {
  return (
    <SummaryTableShell
      title={title}
      icon={CalendarClockIcon}
      adminOnly
      action={addHref ? <ListAddMenu addHref={addHref} canEdit={canEdit} /> : undefined}
      limit={limit}
      offset={offset}
      total={total}
      footerUnit="schedules"
      className={className}
      columns={[
        // 이름 칼럼은 어느 목록에서나 같은 고정 폭이다.
        STORE_NAME_COLUMN_WIDTH,
        remainingColumnWidth(0.18),
        remainingColumnWidth(0.18),
        remainingColumnWidth(0.18),
        remainingColumnWidth(0.28),
        remainingColumnWidth(0.18),
        UPDATED_AT_COLUMN_WIDTH,
      ]}
    >
      <TableHeader>
        <TableRow>
          <TableHead className={STORE_NAME_COLUMN}>
            <SourceHeaderFilter
              label="store_name"
              paramKey="store_name"
              options={storeNameOptions}
            />
          </TableHead>
          <TableHead>
            <SourceHeaderFilter
              label="store_kind"
              paramKey="store_kind"
              options={storeKindOptions}
            />
          </TableHead>
          <TableHead>
            <SourceHeaderFilter
              label="entity_name"
              paramKey="entity_name"
              options={entityOptions}
            />
          </TableHead>
          <TableHead>
            <EnumHeaderFilter
              label="event_kind"
              paramKey="event_kind"
              options={toFilterOptions(SCHEDULABLE_STORE_EVENT_KIND_OPTIONS)}
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
            colSpan={7}
            failure={failure}
            filtered={filtered}
            pastEnd={isPastEnd(offset, total)}
          />
        ) : (
          data.map((row) => (
            <StoreEventScheduleRow
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
