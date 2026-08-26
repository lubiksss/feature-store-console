import type { ReadFailure } from "@/lib/read-failure"
import { TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  StreamSpecRow,
  type StreamSpecRowData,
} from "@/components/stream-sources/stream-spec-row"
import { SourceHeaderFilter } from "@/components/shared/table-controls"
import { TextHead } from "@/components/shared/text-cell"
import { TableEmptyState } from "@/components/shared/table-empty-state"
import { isPastEnd } from "@/lib/pagination"
import { SummaryTableShell } from "@/components/shared/summary-table-shell"
import { WavesIcon } from "lucide-react"
import { ListAddMenu } from "@/components/shared/list-add-menu"
import {
  SOURCE_NAME_COLUMN,
  SOURCE_NAME_COLUMN_WIDTH,
  UPDATED_AT_COLUMN,
  UPDATED_AT_COLUMN_WIDTH,
  remainingColumnWidth,
} from "@/components/shared/table-column-widths"

interface Props {
  data: StreamSpecRowData[]
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

export function StreamSpecTable({
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
  title = "Stream Specs",
  className,
}: Props) {
  return (
    <SummaryTableShell
      title={title}
      icon={WavesIcon}
      action={addHref ? <ListAddMenu addHref={addHref} canEdit={canEdit} /> : undefined}
      limit={limit}
      offset={offset}
      total={total}
      footerUnit="stream sources"
      className={className}
      columns={[
        SOURCE_NAME_COLUMN_WIDTH,
        remainingColumnWidth(0.3),
        remainingColumnWidth(0.23),
        remainingColumnWidth(0.23),
        remainingColumnWidth(0.24),
        UPDATED_AT_COLUMN_WIDTH,
      ]}
    >
      <TableHeader>
        <TableRow>
          <TableHead className={SOURCE_NAME_COLUMN}>
            <SourceHeaderFilter label="feature_view_name" options={sourceOptions} />
          </TableHead>
          <TextHead>input_topic</TextHead>
          <TextHead>key_path</TextHead>
          <TextHead>value_path</TextHead>
          <TextHead>event_ts_path</TextHead>
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
            <StreamSpecRow
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
