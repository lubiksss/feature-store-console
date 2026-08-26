import type { ReadFailure } from "@/lib/read-failure"
import { TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FeatureViewRow, type FeatureViewRowData } from "@/components/feature-views/feature-view-row"
import {
  SourceHeaderFilter,
  EnumHeaderFilter,
  toFilterOptions,
} from "@/components/shared/table-controls"
import { PRODUCER_OPTIONS, SOURCE_LIFECYCLE_OPTIONS } from "@/lib/catalog-enums"
import { TextHead } from "@/components/shared/text-cell"
import { ListAddMenu } from "@/components/shared/list-add-menu"
import { TableEmptyState } from "@/components/shared/table-empty-state"
import { isPastEnd } from "@/lib/pagination"
import { SummaryTableShell } from "@/components/shared/summary-table-shell"
import { BoxesIcon } from "lucide-react"
import {
  SOURCE_NAME_COLUMN,
  SOURCE_NAME_COLUMN_WIDTH,
  UPDATED_AT_COLUMN,
  UPDATED_AT_COLUMN_WIDTH,
  remainingColumnWidth,
} from "@/components/shared/table-column-widths"

interface Props {
  data: FeatureViewRowData[]
  sourceOptions: string[]
  // 대상 어휘. entity_name 은 닫힌 enum 이 아니라 fs_entity 의 행이므로, 필터도 칩 목록이
  // 아니라 서버가 준 이름들에 대한 타입어헤드다 — 아니면 새 대상은 걸러볼 수 없다.
  entityOptions?: string[]
  limit: number
  offset: number
  total: number
  onRowClick?: (featureViewName: string) => void
  addHref?: string
  canEdit?: boolean
  failure?: ReadFailure
  filtered?: boolean
  title?: string
  className?: string
}

export function FeatureViewTable({
  data,
  sourceOptions,
  entityOptions = [],
  limit,
  offset,
  total,
  onRowClick,
  addHref,
  canEdit = false,
  failure,
  filtered,
  title = "Feature Views",
  className,
}: Props) {
  return (
    <SummaryTableShell
      title={title}
      icon={BoxesIcon}
      action={addHref ? <ListAddMenu addHref={addHref} canEdit={canEdit} /> : undefined}
      limit={limit}
      offset={offset}
      total={total}
      footerUnit="feature views"
      className={className}
      columns={[
        SOURCE_NAME_COLUMN_WIDTH,
        remainingColumnWidth(0.2),
        remainingColumnWidth(0.2),
        remainingColumnWidth(0.35),
        remainingColumnWidth(0.25),
        UPDATED_AT_COLUMN_WIDTH,
      ]}
    >
      <TableHeader>
        <TableRow>
          <TableHead className={SOURCE_NAME_COLUMN}>
            <SourceHeaderFilter label="feature_view_name" options={sourceOptions} />
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
              label="producer"
              paramKey="producer"
              options={toFilterOptions(PRODUCER_OPTIONS)}
            />
          </TableHead>
          <TableHead>
            <SourceHeaderFilter label="owner" paramKey="owner" options={[]} />
          </TableHead>
          <TableHead>
            <EnumHeaderFilter
              label="lifecycle_status"
              paramKey="lifecycle_status"
              options={toFilterOptions(SOURCE_LIFECYCLE_OPTIONS)}
            />
          </TableHead>
          <TextHead className={UPDATED_AT_COLUMN}>updated_at</TextHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableEmptyState
            colSpan={6}
            failure={failure}
            filtered={filtered}
            pastEnd={isPastEnd(offset, total)}
          />
        ) : (
          data.map((row) => (
            <FeatureViewRow
              key={row.featureViewName}
              data={row}
              onClick={onRowClick ? () => onRowClick(row.featureViewName) : undefined}
            />
          ))
        )}
      </TableBody>
    </SummaryTableShell>
  )
}
