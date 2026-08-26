import { notFound } from "next/navigation"
import { getStore, isNotFound } from "@/lib/meta-client"
import { canEdit } from "@/lib/auth"
import { StoreDetail } from "@/components/online-stores/online-store-detail"
import { toStoreDetail } from "@/components/online-stores/online-store-mappers"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"
import { storeParams } from "@/lib/fixtures/static-params"

interface Props {
  params: Promise<{ store_name: string; store_kind: string }>
}

export default async function StorePage({ params }: Props) {
  const { store_name, store_kind } = await params
  const store = await getStore(store_name, store_kind).catch((e) => {
    if (isNotFound(e)) return null
    throw e
  })
  if (!store) notFound()

  const editable = await canEdit()

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Online Stores", href: "/online-stores" },
          { label: `${store.store_name}/${store.store_kind}` },
        ]}
      />
      <PageMain variant="detail">
        <StoreDetail data={toStoreDetail(store)} canEdit={editable} />
      </PageMain>
    </>
  )
}

// 정적 export: 미리 렌더할 상세 좌표를 픽스처에서 파생시킨다.
export async function generateStaticParams() {
  return storeParams()
}
