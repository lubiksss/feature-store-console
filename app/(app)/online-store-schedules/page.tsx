import { readList } from "@/lib/read-failure"
import { canEdit } from "@/lib/auth"
import { listStoreEventSchedules, PAGE_SIZE } from "@/lib/meta-client"
import { toStoreEventScheduleRow } from "@/components/online-store-schedules/online-store-schedule-mappers"
import { StoreEventScheduleTableClient } from "@/components/online-store-schedules/online-store-schedule-table-client"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"
import { entityNameOptions } from "@/lib/entity-list"
import { storeNameOptions, storeKindOptions } from "@/lib/online-store-list"

export default async function StoreEventSchedulesPage() {
  const offset = 0
  const scheduleEnabled = undefined?.[0]

  const listed = await readList(
    listStoreEventSchedules({
      limit: PAGE_SIZE,
      offset,
      store_name: undefined,
      store_kind: undefined,
      entity_name: undefined,
      event_kind: undefined,
      schedule_enabled: scheduleEnabled === undefined ? undefined : scheduleEnabled === "true",
    }),
  )

  const items = (listed.data?.items ?? []).map(toStoreEventScheduleRow)
  const editable = await canEdit()

  // 어휘는 서버 것이다 — 콘솔에 사본을 두면 새 스토어/대상을 걸러볼 수도, 예약할 수도 없다.
  const [names, kinds, entities] = await Promise.all([
    storeNameOptions().catch(() => []),
    storeKindOptions().catch(() => []),
    entityNameOptions().catch(() => []),
  ])

  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Online Store Schedules" }]} />
      <PageMain variant="list">
        <StoreEventScheduleTableClient
          data={items}
          storeNameOptions={names}
          storeKindOptions={kinds}
          entityOptions={entities}
          limit={listed.data?.pagination.limit ?? PAGE_SIZE}
          offset={listed.data?.pagination.offset ?? offset}
          total={listed.data?.pagination.total ?? 0}
          addHref="/online-store-schedules/add"
          canEdit={editable}
          failure={listed.failure}
          filtered={false}
          className="flex-1 min-h-0"
        />
      </PageMain>
    </>
  )
}
