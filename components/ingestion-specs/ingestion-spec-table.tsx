import type { ReadFailure } from "@/lib/read-failure"
import { TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  IngestionSpecRow,
  type IngestionSpecRowData,
} from "@/components/ingestion-specs/ingestion-spec-row"
import { SourceHeaderFilter } from "@/components/shared/table-controls"
import { TextHead } from "@/components/shared/text-cell"
import { TableEmptyState } from "@/components/shared/table-empty-state"
import { isPastEnd } from "@/lib/pagination"
import { SummaryTableShell } from "@/components/shared/summary-table-shell"
import { ScrollTextIcon } from "lucide-react"
import { ListAddMenu } from "@/components/shared/list-add-menu"
import {
  SOURCE_NAME_COLUMN,
  SOURCE_NAME_COLUMN_WIDTH,
  UPDATED_AT_COLUMN,
  UPDATED_AT_COLUMN_WIDTH,
  remainingColumnWidth,
} from "@/components/shared/table-column-widths"

interface Props {
  data: IngestionSpecRowData[]
  sourceOptions: string[]
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

export function IngestionSpecTable({
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
  title = "Ingestion Specs",
  className,
}: Props) {
  return (
    <SummaryTableShell
      title={title}
      icon={ScrollTextIcon}
      action={addHref ? <ListAddMenu addHref={addHref} canEdit={canEdit} /> : undefined}
      limit={limit}
      offset={offset}
      total={total}
      footerUnit="specs"
      className={className}
      columns={[
        SOURCE_NAME_COLUMN_WIDTH,
        remainingColumnWidth(0.5),
        remainingColumnWidth(0.5),
        UPDATED_AT_COLUMN_WIDTH,
      ]}
    >
      <TableHeader>
        <TableRow>
          <TableHead className={SOURCE_NAME_COLUMN}>
            <SourceHeaderFilter label="feature_view_name" options={sourceOptions} />
          </TableHead>
          <TextHead>source_path_pattern</TextHead>
          <TextHead>output_hdfs_path_pattern</TextHead>
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
            <IngestionSpecRow
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
