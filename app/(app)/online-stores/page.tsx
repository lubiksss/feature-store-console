import { canEdit } from "@/lib/auth"
import { loadStoreList } from "@/lib/online-store-list"
import { toStoreRow } from "@/components/online-stores/online-store-mappers"
import { StoreTableClient } from "@/components/online-stores/online-store-table-client"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"

export default async function StoresPage() {
  const { stores, storeNameOptions, storeKindOptions, failure, limit, offset, total } =
    await loadStoreList({
      offset: 0,
      filters: {
        store_name: undefined,
        store_kind: undefined,
        owner: undefined,
      },
    })

  const editable = await canEdit()

  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Online Stores" }]} />
      <PageMain variant="list">
        <StoreTableClient
          data={stores.map(toStoreRow)}
          storeNameOptions={storeNameOptions}
          storeKindOptions={storeKindOptions}
          limit={limit}
          offset={offset}
          total={total}
          addHref="/stores/add"
          canEdit={editable}
          failure={failure}
          filtered={false}
          className="flex-1 min-h-0"
        />
      </PageMain>
    </>
  )
}
