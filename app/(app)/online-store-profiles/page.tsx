import { readList } from "@/lib/read-failure"
import { listStoreProfiles, PAGE_SIZE } from "@/lib/meta-client"
import { toStoreProfileRow } from "@/components/online-store-profiles/online-store-profile-mappers"
import { StoreProfileTableClient } from "@/components/online-store-profiles/online-store-profile-table-client"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"
import { entityNameOptions } from "@/lib/entity-list"
import {
  storeNameOptions as loadStoreNameOptions,
  storeKindOptions as loadStoreKindOptions,
} from "@/lib/online-store-list"

// fs_store_profile — flat per-observed-field list. Row click → the node's full stats.
// The subject filter is entity_name: a store run is about a key type, not a featureView.
export default async function StoreProfilesPage() {
  const offset = 0

  const listed = await readList(
    listStoreProfiles({
      limit: PAGE_SIZE,
      offset,
      store_event_id: undefined,
      store_name: undefined,
      entity_name: undefined,
      field_name: undefined,
      field_path: undefined,
      store_kind: undefined,
      field_type: undefined,
    }),
  )

  const items = (listed.data?.items ?? []).map(toStoreProfileRow)

  // 어휘는 서버 것이다: 필터 선택지를 콘솔이 들고 있으면 새 대상은 걸러볼 수 없다.
  const [entityOptions, storeKindOptions, storeNameOptions] = await Promise.all([
    entityNameOptions().catch(() => []),
    loadStoreKindOptions().catch(() => []),
    loadStoreNameOptions().catch(() => []),
  ])

  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Online Store Profiles" }]} />
      <PageMain variant="list">
        <StoreProfileTableClient
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
