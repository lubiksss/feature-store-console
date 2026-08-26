import type { ReadFailure } from "@/lib/read-failure"
import { TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EntityRow, type EntityRowData } from "@/components/entities/entity-row"
import { SourceHeaderFilter } from "@/components/shared/table-controls"
import { TextHead } from "@/components/shared/text-cell"
import { ListAddMenu } from "@/components/shared/list-add-menu"
import { TableEmptyState } from "@/components/shared/table-empty-state"
import { isPastEnd } from "@/lib/pagination"
import { SummaryTableShell } from "@/components/shared/summary-table-shell"
import { GroupIcon } from "lucide-react"
import {
  SOURCE_NAME_COLUMN,
  SOURCE_NAME_COLUMN_WIDTH,
  UPDATED_AT_COLUMN,
  UPDATED_AT_COLUMN_WIDTH,
  remainingColumnWidth,
} from "@/components/shared/table-column-widths"

interface Props {
  data: EntityRowData[]
  // The vocabulary itself, for the name filter. It is a data-driven typeahead rather than an
  // enum chip list precisely because the set is rows now.
  entityOptions: string[]
  limit: number
  offset: number
  total: number
  onRowClick?: (entityName: string) => void
  addHref?: string
  canEdit?: boolean
  failure?: ReadFailure
  filtered?: boolean
  title?: string
  className?: string
}

export function EntityTable({
  data,
  entityOptions,
  limit,
  offset,
  total,
  onRowClick,
  addHref,
  canEdit = false,
  failure,
  filtered,
  title = "Entities",
  className,
}: Props) {
  return (
    <SummaryTableShell
      title={title}
      icon={GroupIcon}
      adminOnly
      action={addHref ? <ListAddMenu addHref={addHref} canEdit={canEdit} /> : undefined}
      limit={limit}
      offset={offset}
      total={total}
      footerUnit="entities"
      className={className}
      columns={[
        SOURCE_NAME_COLUMN_WIDTH,
        remainingColumnWidth(0.6),
        remainingColumnWidth(0.4),
        UPDATED_AT_COLUMN_WIDTH,
      ]}
    >
      <TableHeader>
        <TableRow>
          <TableHead className={SOURCE_NAME_COLUMN}>
            <SourceHeaderFilter
              label="entity_name"
              paramKey="entity_name"
              options={entityOptions}
            />
          </TableHead>
          <TextHead>description</TextHead>
          {/* owner is filtered server-side by set membership, and the console has no roster of
              principals to offer — free-text exact entry, as on the featureViews list. */}
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
            <EntityRow
              key={row.entityName}
              data={row}
              onClick={onRowClick ? () => onRowClick(row.entityName) : undefined}
            />
          ))
        )}
      </TableBody>
    </SummaryTableShell>
  )
}
