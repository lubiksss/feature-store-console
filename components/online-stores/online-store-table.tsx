import type { ReadFailure } from "@/lib/read-failure"
import { TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StoreRow, type StoreRowData } from "@/components/online-stores/online-store-row"
import { SourceHeaderFilter } from "@/components/shared/table-controls"
import { TextHead } from "@/components/shared/text-cell"
import { ListAddMenu } from "@/components/shared/list-add-menu"
import { TableEmptyState } from "@/components/shared/table-empty-state"
import { isPastEnd } from "@/lib/pagination"
import { SummaryTableShell } from "@/components/shared/summary-table-shell"
import { DatabaseIcon } from "lucide-react"
import {
  SOURCE_NAME_COLUMN,
  SOURCE_NAME_COLUMN_WIDTH,
  UPDATED_AT_COLUMN,
  UPDATED_AT_COLUMN_WIDTH,
  remainingColumnWidth,
} from "@/components/shared/table-column-widths"

interface Props {
  data: StoreRowData[]
  // 이름도 종류도 이 테이블의 행에서 온다 — 칩 목록이 아니라 서버가 준 값들에 대한
  // 타입어헤드인 이유다.
  storeNameOptions?: string[]
  storeKindOptions?: string[]
  limit: number
  offset: number
  total: number
  onRowClick?: (row: StoreRowData) => void
  addHref?: string
  canEdit?: boolean
  failure?: ReadFailure
  filtered?: boolean
  title?: string
  className?: string
}

export function StoreTable({
  data,
  storeNameOptions = [],
  storeKindOptions = [],
  limit,
  offset,
  total,
  onRowClick,
  addHref,
  canEdit = false,
  failure,
  filtered,
  title = "Online Stores",
  className,
}: Props) {
  return (
    <SummaryTableShell
      title={title}
      icon={DatabaseIcon}
      adminOnly
      action={addHref ? <ListAddMenu addHref={addHref} canEdit={canEdit} /> : undefined}
      limit={limit}
      offset={offset}
      total={total}
      footerUnit="stores"
      className={className}
      columns={[
        SOURCE_NAME_COLUMN_WIDTH,
        remainingColumnWidth(0.35),
        remainingColumnWidth(0.65),
        UPDATED_AT_COLUMN_WIDTH,
      ]}
    >
      <TableHeader>
        <TableRow>
          <TableHead className={SOURCE_NAME_COLUMN}>
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
            <SourceHeaderFilter label="owner" paramKey="owner" options={[]} />
          </TableHead>
          <TextHead className={UPDATED_AT_COLUMN}>updated_at</TextHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableEmptyState
            colSpan={4}
            failure={failure}
            filtered={filtered}
            pastEnd={isPastEnd(offset, total)}
          />
        ) : (
          data.map((row) => (
            <StoreRow
              key={`${row.storeName}/${row.storeKind}`}
              data={row}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            />
          ))
        )}
      </TableBody>
    </SummaryTableShell>
  )
}
