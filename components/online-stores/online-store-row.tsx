import { OwnerBadges } from "@/components/shared/owner-badge"
import { TextCell } from "@/components/shared/text-cell"
import { EnumBadge } from "@/components/shared/enum-badges"
import { TableCell, TableRow } from "@/components/ui/table"

export interface StoreRowData {
  storeName: string
  storeKind: string
  owner: string
  updatedAt: string
}

interface Props {
  data: StoreRowData
  onClick?: () => void
}

export function StoreRow({ data, onClick }: Props) {
  return (
    <TableRow className={onClick ? "cursor-pointer" : undefined} onClick={onClick}>
      <TextCell>{data.storeName}</TextCell>
      {/* 종류는 계약의 닫힌 집합이다(파이프라인이 이것으로 디스패치한다) — 대상 이름과 달리
          칩이 정직하다. */}
      <TableCell>
        <EnumBadge set="storeKind" value={data.storeKind} link={false} />
      </TableCell>
      <TableCell>
        <OwnerBadges owner={data.owner} listPath="/stores" collapse />
      </TableCell>
      <TextCell className="tabular-nums">{data.updatedAt}</TextCell>
    </TableRow>
  )
}
