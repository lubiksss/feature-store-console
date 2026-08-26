import { notFound } from "next/navigation"
import {
  getFeatureView,
  getFeatureViewActions,
  getBatchSource,
  listFeatureViewStores,
  isConflict,
  isNotFound,
} from "@/lib/meta-client"
import type { AvailableActions } from "@/lib/meta-client"
import { canEdit } from "@/lib/auth"
import { storeKindOptions, storeNamesByKind } from "@/lib/online-store-list"
import { FeatureViewDetail } from "@/components/feature-views/feature-view-detail"
import { toFeatureViewDetail } from "@/components/feature-views/feature-view-mappers"
import { toLocationData } from "@/components/batch-sources/location-mappers"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"
import { sourceParams } from "@/lib/fixtures/static-params"

interface Props {
  params: Promise<{ feature_view_name: string }>
}

// 아무것도 제공하지 않는 오퍼. 서버가 오퍼를 주지 못한 행에도 액션 메뉴는 어휘 전체를 비활성으로
// 보여준다 — 메뉴가 사라지면 "이 피처 뷰엔 액션이 없다"가 아니라 "기능이 없다"로 읽힌다.
const EMPTY_OFFER: AvailableActions = { lifecycle: [], feature_view_events: [], partition: [] }

// 오퍼 조회가 404 였다는 표식. null(= 오퍼가 빈 것)과 구분해야 "피처 뷰가 없다"와 "서버에 액션
// 평면이 없다"를 뒤섞지 않는다.
const OFFER_NOT_FOUND = "offer-route-not-found" as const

export default async function FeatureViewDetailPage({ params }: Props) {
  const { feature_view_name } = await params
  // The location is a 1:1 satellite read on this page. 404 is a normal state (→ null, rendered as
  // an empty Location/Target card offering Add). Anything else must NOT be swallowed: treating a
  // transient 5xx as "no location" would offer Add on a featureView that already has one, and the
  // save would then 409. Let it surface instead of lying about the state.
  // The serving target is the /v1/catalog projection of this featureView ⋈ its location. Its ONLY
  // documented 404 is a missing featureView (a featureView without a location row is a 200 with the serving
  // keys absent), so 404 → null here just defers to the notFound below. What that must not hide is
  // an UNDOCUMENTED 404: /v1/catalog is newer than this page, so a 서버 that predates it
  // answers 404 for an unregistered route. Rendering the all-"-" card then would state "nothing is
  // served here yet" about a featureView that is actively serving — see the assert after notFound.
  // 액션 오퍼는 이 페이지가 "이 피처 뷰로 무엇이 가능한가"를 스스로 계산하지 않게 하는 읽기다.
  // 피처 뷰 행과 함께 병렬로 한 번 읽는다(행마다 읽는 것이 아니라 상세 1회).
  const [featureView, actions, location, memberships, storeKinds, namesByKind, editable] =
    await Promise.all([
      getFeatureView(feature_view_name).catch(() => null),
      // 409 는 서버가 "이 행으로는 아무것도 할 수 없다"고 답한 것이므로 빈 오퍼로 렌더한다
      // (액션이 전부 비활성). 404 는 두 가지를 뜻하고 둘 다 여기서 판단하지 않는다: 피처 뷰가
      // 없거나(아래 notFound), 이 라우트를 모르는 옛 서버 이거나(notFound 뒤의 단언).
      // 그 외의 실패는 삼키지 않는다 — 장애를 "가능한 것이 없음"으로 보여주면 화면이 거짓말을 한다.
      getFeatureViewActions(feature_view_name).catch((e) => {
        if (isConflict(e)) return null
        if (isNotFound(e)) return OFFER_NOT_FOUND
        throw e
      }),
      getBatchSource(feature_view_name).catch((e) => {
        if (isNotFound(e)) return null
        throw e
      }),
      // 멤버십은 종류당 한 행이라 최대 몇 개다. 실패는 빈 목록으로 접는다 — 카드가 "아직 없다"
      // 로 읽히지만, 이 축은 피처 뷰의 존재나 형상을 판단하는 데 쓰이지 않으므로 화면이 잘못된
      // 단정을 하지는 않는다.
      listFeatureViewStores({ feature_view_name: [feature_view_name], limit: 100 }).catch(() => null),
      // 카드의 행 집합은 카탈로그의 종류다 — 어휘가 서버 것이므로 콘솔이 목록을 들지 않는다.
      storeKindOptions().catch(() => []),
      storeNamesByKind().catch(() => ({})),
      canEdit(),
    ])
  if (!featureView) notFound()
  // 피처 뷰가 있는데 오퍼가 404 였다면 이 서버에 액션 평면이 없다는 뜻이다(< v0.10.0). 빈 오퍼로
  // 렌더하면 "이 피처 뷰로 가능한 것이 없다"고 거짓말하므로 크게 실패한다. 순서가 핵심이다: notFound 를 먼저 답해야 없는 피처 뷰가 5xx 가 되지 않는다.
  if (actions === OFFER_NOT_FOUND) {
    throw new Error(
      `GET /v1/client/feature-view-actions/${feature_view_name} returned 404 for a featureView that exists — ` +
        `서버 likely predates the action plane (< v0.10.0)`,
    )
  }

  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Feature Views", href: "/feature-views" }, { label: feature_view_name }]} />
      <PageMain variant="detail">
        <FeatureViewDetail
          canEdit={editable}
          data={toFeatureViewDetail(featureView)}
          // 오퍼가 없으면(409) 아무 액션도 제공하지 않는 오퍼와 같다.
          actions={actions?.actions ?? EMPTY_OFFER}
          shapeEditable={actions?.shape_editable ?? false}
          location={location ? toLocationData(location) : undefined}
          storeKinds={storeKinds}
          storeNamesByKind={namesByKind}
          memberships={(memberships?.items ?? []).map((m) => ({
            storeKind: m.store_kind,
            storeName: m.store_name,
            createdAt: m.created_at,
          }))}
          metaServerUrl={process.env.META_SERVER_URL}
        />
      </PageMain>
    </>
  )
}

// 정적 export: 미리 렌더할 상세 좌표를 픽스처에서 파생시킨다.
export async function generateStaticParams() {
  return sourceParams()
}
