import { TableCell, TableRow } from "@/components/ui/table"
import { display } from "@/lib/display"
import { StoreNameLink } from "@/components/shared/online-store-name-link"
import { EntityNameLink } from "@/components/shared/entity-name"
import { EventIdBadge } from "@/components/shared/event-id-badge"
import { EnumBadge } from "@/components/shared/enum-badges"
import { TextCell } from "@/components/shared/text-cell"

export interface StoreEventRowData {
  storeEventId: number
  eventKind: string
  storeName: string
  storeKind: string
  entityName: string
  status: string
  updatedAt: string
}

// 온라인 스토어 런의 주어는 스토어(store_name + store_kind)이고 entity_name 은 그 안에서 런을 좁히는
// 좌표다. 세 칸이 형제 이벤트 테이블의 feature_view_name 자리를 나눠 쓴다 — 같은 질문("이 런은 무엇에
// 관한 것인가")에 답하고, 온라인 스토어 런에는 댈 피처 뷰가 없다.
//
// store_name 이 칸을 차지하는 이유: 한 종류에 인스턴스가 둘 이상이 되면, 이름 없이는 두 런이
// 구별되지 않는다.
export function StoreEventRow({
  data,
  onClick,
}: {
  data: StoreEventRowData
  onClick?: () => void
}) {
  return (
    <TableRow className={onClick ? "cursor-pointer" : undefined} onClick={onClick}>
      <TableCell>
        <EventIdBadge eventId={data.storeEventId} displayModulo={1_000} />
      </TableCell>
      <TableCell>
        <StoreNameLink
          storeName={data.storeName}
          href={`/online-store-events?store_name=${encodeURIComponent(data.storeName)}`}
        />
      </TableCell>
      <TableCell>
        <EnumBadge set="storeKind" value={data.storeKind} />
      </TableCell>
      <TableCell>
        <EnumBadge set="storeEventKind" value={data.eventKind} />
      </TableCell>
      <TableCell>
        {data.entityName === "" ? (
          display(undefined)
        ) : (
          <EntityNameLink
            entityName={data.entityName}
            href={`/online-store-events?entity_name=${encodeURIComponent(data.entityName)}`}
          />
        )}
      </TableCell>
      <TableCell>
        <EnumBadge
          set="eventStatus"
          value={data.status}
          href={`/online-store-events?status=${data.status}`}
        />
      </TableCell>
      <TextCell className="tabular-nums">{data.updatedAt}</TextCell>
    </TableRow>
  )
}
