import { TableCell, TableRow } from "@/components/ui/table"
import { display } from "@/lib/display"
import { StoreNameLink } from "@/components/shared/online-store-name-link"
import { EntityNameLink } from "@/components/shared/entity-name"
import { EnumBadge } from "@/components/shared/enum-badges"
import { TextCell } from "@/components/shared/text-cell"
import type { SchedulableStoreEventKind } from "@/lib/meta-client"

export interface StoreEventScheduleRowData {
  // 주어(스토어)가 먼저, 좌표(대상)가 그 다음이다. 넓은 쪽이 앞이다 — 온라인 스토어가 그릇이고
  // 대상은 그 안에서 런이 좁혀지는 축이다.
  storeName: string
  storeKind: string
  entityName: string
  eventKind: SchedulableStoreEventKind
  scheduleId: number
  cronExpression?: string
  scheduleEnabled: boolean
  updatedAt: string
}

interface Props {
  data: StoreEventScheduleRowData
  onClick?: () => void
}

export function StoreEventScheduleRow({ data, onClick }: Props) {
  return (
    <TableRow className={onClick ? "cursor-pointer" : undefined} onClick={onClick}>
      <TableCell>
        <StoreNameLink
          storeName={data.storeName}
          href={`/online-store-schedules?store_name=${encodeURIComponent(data.storeName)}`}
        />
      </TableCell>
      <TableCell>
        <EnumBadge
          set="storeKind"
          value={data.storeKind}
          href={`/online-store-schedules?store_kind=${data.storeKind}`}
        />
      </TableCell>
      <TableCell>
        {/* 빈 좌표는 값이다: 이 런은 대상에 엮이지 않는다. 없는 것처럼 "-" 로 그리면 결손과
            구별되지 않는다. */}
        {data.entityName === "" ? (
          display(undefined)
        ) : (
          <EntityNameLink
            entityName={data.entityName}
            href={`/online-store-schedules?entity_name=${encodeURIComponent(data.entityName)}`}
          />
        )}
      </TableCell>
      <TableCell>
        <EnumBadge set="schedulableStoreEventKind" value={data.eventKind} />
      </TableCell>
      <TextCell>{data.cronExpression ?? "-"}</TextCell>
      <TableCell>
        <EnumBadge set="bool" value={String(data.scheduleEnabled)} />
      </TableCell>
      <TextCell className="tabular-nums">{data.updatedAt}</TextCell>
    </TableRow>
  )
}
