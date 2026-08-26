import { readList } from "@/lib/read-failure"
import { windowStart } from "@/lib/time-window"
import { listStoreEvents, PAGE_SIZE } from "@/lib/meta-client"
import { toStoreEventRow } from "@/components/online-store-events/online-store-event-mappers"
import { StoreEventTableClient } from "@/components/online-store-events/online-store-event-table-client"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"
import { entityNameOptions } from "@/lib/entity-list"
import {
  storeNameOptions as loadStoreNameOptions,
  storeKindOptions as loadStoreKindOptions,
} from "@/lib/online-store-list"

// fs_store_event — store-profiling runs. The third event subject: feature_view_event is about a
// featureView, partition_event about a partition, this about a STORE.
export default async function StoreEventsPage() {
  const offset = 0

  const listed = await readList(
    listStoreEvents({
      limit: PAGE_SIZE,
      offset,
      event_kind: undefined,
      store_name: undefined,
      store_kind: undefined,
      entity_name: undefined,
      status: undefined,
      updated_from: windowStart(undefined),
    }),
  )

  const items = (listed.data?.items ?? []).map(toStoreEventRow)

  // 어휘는 서버 것이다: 필터 선택지를 콘솔이 들고 있으면 새 대상은 걸러볼 수 없다.
  const [entityOptions, storeKindOptions, storeNameOptions] = await Promise.all([
    entityNameOptions().catch(() => []),
    loadStoreKindOptions().catch(() => []),
    loadStoreNameOptions().catch(() => []),
  ])

  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Online Store Events" }]} />
      <PageMain variant="list">
        <StoreEventTableClient
          entityOptions={entityOptions}
          storeNameOptions={storeNameOptions}
          storeKindOptions={storeKindOptions}
          data={items}
          limit={listed.data?.pagination.limit ?? PAGE_SIZE}
          offset={listed.data?.pagination.offset ?? offset}
          total={listed.data?.pagination.total ?? 0}
          failure={listed.failure}
          filtered={false}
          className="flex-1 min-h-0"
        />
      </PageMain>
    </>
  )
}
