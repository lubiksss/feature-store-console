import type { ReadFailure } from "@/lib/read-failure"
import { TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StoreEventRow, type StoreEventRowData } from "@/components/online-store-events/online-store-event-row"
import {
  SourceHeaderFilter,
  EnumHeaderFilter,
  toFilterOptions,
  TimeHeaderFilter,
} from "@/components/shared/table-controls"
import { STORE_EVENT_KIND_OPTIONS, EVENT_STATUS_OPTIONS } from "@/lib/catalog-enums"
import { TextHead } from "@/components/shared/text-cell"
import { TableEmptyState } from "@/components/shared/table-empty-state"
import { isPastEnd } from "@/lib/pagination"
import { SummaryTableShell } from "@/components/shared/summary-table-shell"
import { ActivityIcon } from "lucide-react"
import {
  STORE_NAME_COLUMN,
  STORE_NAME_COLUMN_WIDTH,
  UPDATED_AT_COLUMN,
  UPDATED_AT_COLUMN_WIDTH,
  EVENT_ID_COLUMN,
  EVENT_ID_COLUMN_WIDTH,
  EVENT_ID_COLUMN_WIDTH_REM,
  remainingColumnWidth,
} from "@/components/shared/table-column-widths"

interface Props {
  data: StoreEventRowData[]
  // 대상 어휘(서버). entity_name 은 닫힌 enum 이 아니라 fs_entity 의 행이다.
  entityOptions?: string[]
  storeNameOptions?: string[]
  storeKindOptions?: string[]
  limit: number
  offset: number
  total: number
  onRowClick?: (id: number) => void
  failure?: ReadFailure
  filtered?: boolean
  title?: string
  className?: string
}

// fs_store_event — store-profiling runs. Same shape as the sibling event tables; the
// subject is the store (name + kind) with an entity coordinate, three columns splitting the slot feature_view_name fills on the
// sibling tables — the same total width, not a merged cell. key_source_table
// is provenance of the sample, so it belongs to the run's detail, not to this summary.
export function StoreEventTable({
  data,
  entityOptions = [],
  storeNameOptions = [],
  storeKindOptions = [],
  limit,
  offset,
  total,
  onRowClick,
  failure,
  filtered,
  title = "Online Store Events",
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
        // 이름 칼럼은 피처 뷰 이벤트·파티션 이벤트와 같은 고정 폭이다. 나머지 넷이 남는 폭을
        // 나눈다.
        STORE_NAME_COLUMN_WIDTH,
        remainingColumnWidth(1 / 4, EVENT_ID_COLUMN_WIDTH_REM),
        remainingColumnWidth(1 / 4, EVENT_ID_COLUMN_WIDTH_REM),
        remainingColumnWidth(1 / 4, EVENT_ID_COLUMN_WIDTH_REM),
        remainingColumnWidth(1 / 4, EVENT_ID_COLUMN_WIDTH_REM),
        UPDATED_AT_COLUMN_WIDTH,
      ]}
    >
      <TableHeader>
        <TableRow>
          <TextHead className={EVENT_ID_COLUMN}>store_event_id</TextHead>
          {/* id 다음이 주어다 — 이벤트 세 목록이 같은 자리, 같은 폭으로 이름을 보여준다. */}
          <TableHead className={STORE_NAME_COLUMN}>
            <SourceHeaderFilter
              label="store_name"
              paramKey="store_name"
              options={storeNameOptions}
            />
          </TableHead>
          {/* 주어가 붙어 있다: 온라인 스토어 평면의 주어는 (store_name, store_kind) 짝이라, 그 둘
              사이에 다른 축이 끼면 한 주어를 읽으려고 눈이 두 번 건너뛴다. */}
          <TableHead>
            <SourceHeaderFilter
              label="store_kind"
              paramKey="store_kind"
              options={storeKindOptions}
            />
          </TableHead>
          <TableHead>
            <EnumHeaderFilter
              label="event_kind"
              paramKey="event_kind"
              options={toFilterOptions(STORE_EVENT_KIND_OPTIONS)}
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
            colSpan={7}
            failure={failure}
            filtered={filtered}
            pastEnd={isPastEnd(offset, total)}
          />
        ) : (
          data.map((row) => (
            <StoreEventRow
              key={row.storeEventId}
              data={row}
              onClick={onRowClick ? () => onRowClick(row.storeEventId) : undefined}
            />
          ))
        )}
      </TableBody>
    </SummaryTableShell>
  )
}
