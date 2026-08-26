import { getStreamSource } from "@/lib/meta-client"
import { canEdit } from "@/lib/auth"
import { isShapeEditable } from "@/lib/shape-editable"
import { StreamSpecDetail } from "@/components/stream-sources/stream-spec-detail"
import { toStreamSpecDetail } from "@/components/stream-sources/stream-spec-mappers"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"
import { streamSpecParams } from "@/lib/fixtures/static-params"

interface Props {
  params: Promise<{ feature_view_name: string }>
}

export default async function StreamSpecDetailPage({ params }: Props) {
  const { feature_view_name } = await params
  // 이 스펙은 피처 뷰의 형상이라 서버가 draft 에서만 쓰기를 받는다. Edit/Delete 를 그 사실로
  // 잠근다 — Location 카드와 같은 게이트이고, 한쪽만 잠그면 같은 피처 뷰가 한 화면에서는 얼어
  // 있고 두 클릭 옆에서는 편집 가능한 상태가 된다.
  const [spec, editable, shapeEditable] = await Promise.all([
    getStreamSource(feature_view_name).catch(() => null),
    canEdit(),
    isShapeEditable(feature_view_name),
  ])

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Stream Specs", href: "/stream-sources" },
          { label: feature_view_name },
        ]}
      />
      <PageMain variant="detail">
        <StreamSpecDetail
          featureViewName={feature_view_name}
          canEdit={editable && shapeEditable}
          data={spec ? toStreamSpecDetail(spec) : undefined}
        />
      </PageMain>
    </>
  )
}

// 정적 export: 미리 렌더할 상세 좌표를 픽스처에서 파생시킨다.
export async function generateStaticParams() {
  return streamSpecParams()
}
