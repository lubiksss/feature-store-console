import { OwnerBadges } from "@/components/shared/owner-badge"
import { TextCell } from "@/components/shared/text-cell"
import { TableCell, TableRow } from "@/components/ui/table"
import { display } from "@/lib/display"

export interface EntityRowData {
  entityName: string
  description?: string
  owner: string
  updatedAt: string
}

interface Props {
  data: EntityRowData
  onClick?: () => void
}

export function EntityRow({ data, onClick }: Props) {
  return (
    <TableRow className={onClick ? "cursor-pointer" : undefined} onClick={onClick}>
      {/* 이름은 평문이다 — 대상은 fs_entity 의 행이라 어휘가 언제든 늘어나고, 칩으로
          그리면 콘솔이 아는 몇 개가 어휘 전체처럼 보인다. */}
      <TextCell>{data.entityName}</TextCell>
      <TextCell>{display(data.description)}</TextCell>
      <TableCell>
        <OwnerBadges owner={data.owner} listPath="/entities" collapse />
      </TableCell>
      <TextCell className="tabular-nums">{data.updatedAt}</TextCell>
    </TableRow>
  )
}
