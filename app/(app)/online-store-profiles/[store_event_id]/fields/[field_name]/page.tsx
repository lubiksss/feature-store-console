import { notFound } from "next/navigation"
import { getStoreProfile } from "@/lib/meta-client"
import { StoreProfileDetail } from "@/components/online-store-profiles/online-store-profile-detail"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"
import { storeProfileParams } from "@/lib/fixtures/static-params"

interface Props {
  params: Promise<{ store_event_id: string; field_name: string }>
}

// One observed node's full statistics. The natural key is (store_event_id, field_name,
// field_path); the path carries the first two and field_path rides as a query coord — the
// same split the featureView profile detail route uses.
export default async function StoreProfileDetailPage({ params }: Props) {
  // Next.js already URL-decodes dynamic segments; getStoreProfile re-encodes for the API
  // call, so use the param directly (a second decode would 500 on a literal '%').
  const { store_event_id, field_name } = await params

  // 정적 export: 좌표 쿼리가 없으므로 필드 루트 경로로 조회한다.
  const data = await getStoreProfile(Number(store_event_id), field_name, "$").catch(() => null)
  if (!data) notFound()

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Online Store Profiles", href: "/online-store-profiles" },
          { label: `${field_name} · ${data.field_path}` },
        ]}
      />
      <PageMain variant="detail">
        <StoreProfileDetail data={data} />
      </PageMain>
    </>
  )
}

// 정적 export: 미리 렌더할 상세 좌표를 픽스처에서 파생시킨다.
export async function generateStaticParams() {
  return storeProfileParams()
}
