import type { ReadFailure } from "@/lib/read-failure"
import { TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  StoreProfileRow,
  type StoreProfileRowData,
} from "@/components/online-store-profiles/online-store-profile-row"
import { SourceHeaderFilter } from "@/components/shared/table-controls"
import { TextHead } from "@/components/shared/text-cell"
import { TableEmptyState } from "@/components/shared/table-empty-state"
import { SummaryTableShell } from "@/components/shared/summary-table-shell"
import { ChartColumnIcon } from "lucide-react"
import {
  SOURCE_NAME_COLUMN,
  SOURCE_NAME_COLUMN_WIDTH,
  SOURCE_NAME_COLUMN_WIDTH_REM,
  STORE_NAME_COLUMN,
  STORE_NAME_COLUMN_WIDTH,
  UPDATED_AT_COLUMN,
  UPDATED_AT_COLUMN_WIDTH,
  remainingColumnWidth,
} from "@/components/shared/table-column-widths"

interface Props {
  data: StoreProfileRowData[]
  // 대상 어휘(서버). entity_name 은 닫힌 enum 이 아니라 fs_entity 의 행이다.
  entityOptions?: string[]
  storeNameOptions?: string[]
  storeKindOptions?: string[]
  limit: number
  offset: number
  total: number
  onRowClick?: (row: StoreProfileRowData) => void
  failure?: ReadFailure
  filtered?: boolean
  title?: string
  className?: string
}

// fs_store_profile — one row per observed (field_name, field_path). Identity only: the
// statistics live in the detail view, the same split the featureView profile list uses.
export function StoreProfileTable({
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
  title = "Online Store Profiles",
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
        // field_name is this table's identity — a store profile row is keyed by the OBSERVED
        // field — so it leads, in the fixed width feature_view_name takes elsewhere.
        // remainingColumnWidth() subtracts that pair from the flexible share, so a table
        // without it computes the rest 20rem too wide.
        SOURCE_NAME_COLUMN_WIDTH,
        // store_name 도 이름 칼럼이라 같은 고정 폭이다. 고정 칼럼이 하나 늘었으므로 남는
        // 폭 계산에 그 20rem 을 알려준다 — 안 넘기면 나머지가 그만큼 넓게 잡힌다.
        STORE_NAME_COLUMN_WIDTH,
        remainingColumnWidth(0.15, SOURCE_NAME_COLUMN_WIDTH_REM),
        remainingColumnWidth(0.15, SOURCE_NAME_COLUMN_WIDTH_REM),
        remainingColumnWidth(0.4, SOURCE_NAME_COLUMN_WIDTH_REM),
        remainingColumnWidth(0.3, SOURCE_NAME_COLUMN_WIDTH_REM),
        UPDATED_AT_COLUMN_WIDTH,
      ]}
    >
      <TableHeader>
        <TableRow>
          <TableHead className={SOURCE_NAME_COLUMN}>
            <SourceHeaderFilter label="field_name" paramKey="field_name" options={[]} />
          </TableHead>
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
          <TableEmptyState colSpan={7} failure={failure} filtered={filtered} />
        ) : (
          data.map((row) => (
            <StoreProfileRow
              key={`${row.storeEventId}:${row.fieldName}:${row.fieldPath}`}
              data={row}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            />
          ))
        )}
      </TableBody>
    </SummaryTableShell>
  )
}
