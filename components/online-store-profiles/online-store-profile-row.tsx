import { TableCell, TableRow } from "@/components/ui/table"
import { StoreNameLink } from "@/components/shared/online-store-name-link"
import { EntityNameLink } from "@/components/shared/entity-name"
import { EnumBadge, FieldTypeBadge } from "@/components/shared/enum-badges"
import { TextCell } from "@/components/shared/text-cell"

export interface StoreProfileRowData {
  // Carried for navigation, not shown: a surrogate id says nothing to a reader. What the
  // row is ABOUT is entity_name, which is why it lives on the row instead of behind the event.
  storeEventId: number
  // 온라인 스토어가 바깥 그릇이고 키 타입이 그 안의 주제다 — 넓은 쪽을 앞에 둔다.
  storeName: string
  storeKind: string
  entityName: string
  fieldName: string
  fieldPath: string
  fieldType: string
  createdAt: string
}

interface Props {
  data: StoreProfileRowData
  onClick?: () => void
}

// Badges narrow THIS list. The global map gives each set one destination — entityName's is
// /feature-views — so a store screen has to say where "the rest that look like this" lives for it.
// Identity only, like the featureView profile list — the statistics belong to the detail view.
// A store profile row is keyed by the OBSERVED field: field_name comes from the store, not
// the catalog, so a field serving with no featureView appears here like any other.
export function StoreProfileRow({ data, onClick }: Props) {
  return (
    <TableRow className={onClick ? "cursor-pointer" : undefined} onClick={onClick}>
      <TextCell>{data.fieldName}</TextCell>
      <TableCell>
        <StoreNameLink
          storeName={data.storeName}
          href={`/online-store-profiles?store_name=${encodeURIComponent(data.storeName)}`}
        />
      </TableCell>
      <TableCell>
        <EnumBadge
          set="storeKind"
          value={data.storeKind}
          href={`/online-store-profiles?store_kind=${data.storeKind}`}
        />
      </TableCell>
      <TableCell>
        <EntityNameLink
          entityName={data.entityName}
          href={`/online-store-profiles?entity_name=${encodeURIComponent(data.entityName)}`}
        />
      </TableCell>
      <TextCell>{data.fieldPath}</TextCell>
      <TableCell>
        <FieldTypeBadge value={data.fieldType} compact listPath="/online-store-profiles" />
      </TableCell>
      <TextCell className="tabular-nums">{data.createdAt}</TextCell>
    </TableRow>
  )
}
