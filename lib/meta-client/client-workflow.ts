import { client, unwrap } from "./transport"
import type { components } from "./schema"

// ─── Client workflow (trigger actions) ────────────────────────────────────────
// /v1/client/* — the action plane. Admin-gated for everything but the offer read.
//
// 콘솔은 "이 피처 뷰로 무엇이 가능한가"의 사본을 갖지 않는다. 서버가 오퍼(available actions)를
// 내려주고 콘솔은 그것을 렌더한다 — 예전에는 콘솔이 상태기계 사본을 들고 있었고 이미 갈라져서,
// retired stream 피처 뷰의 유일한 활성 버튼이 400 을 냈다.
export type AvailableActions = components["schemas"]["AvailableActions"]

// 오퍼가 쓰는 세 어휘. 전집합은 스펙 enum 이므로 콘솔이 "어떤 액션이 존재하는가"를 손으로
// 나열하지 않는다 — 무엇이 지금 가능한가만 오퍼에서 읽는다.
export type FeatureViewAction = components["schemas"]["FeatureViewActionEnum"]

// The event kinds a featureView offers as an ACTION right now (AvailableActions.feature_view_events).
// Not the trigger vocabulary — that is SchedulableEventKind, which also carries the kinds no
// featureView can offer (store_profiling runs against a keyspace).
export type FeatureViewOfferableEventKind = components["schemas"]["FeatureViewOfferableEventKindEnum"]
export type PartitionCommand = components["schemas"]["PartitionCommandEnum"]

// 피처 뷰 하나의 오퍼. 상태·producer·shape_editable 을 같이 실어, 편집 폼 잠금도 콘솔이
// lifecycle_status 로 추론하지 않게 한다.
export async function getFeatureViewActions(featureViewName: string) {
  return unwrap(
    await client.GET("/v1/client/feature-view-actions/{feature_view_name}", {
      params: { path: { feature_view_name: featureViewName } },
    }),
  )
}

// 목록판(GET /v1/client/feature-view-actions)은 아직 부르지 않는다: 액션 메뉴가 피처 뷰 상세에만 있어서
// 행마다 오퍼가 필요한 화면이 없다. 목록 행에 액션을 놓게 되면 그때 추가한다 — 지금 두면
// 아무도 안 쓰는 코드가 계약의 일부인 척한다.

// 라이프사이클 전이는 액션 이름을 보낸다. 착지 상태는 서버가 정한다 — lifecycle_status 는
// 관측 결과이지 명세가 아니어서(retire 는 콜백까지 suspended 에 머물고, validate 와 resume 이
// 같은 active 로 착지한다) 목표 상태로는 어느 조작인지 구분할 수 없었다.
// 보내는 문자열은 오퍼에 있던 그 문자열이므로 이름→엔드포인트 매핑이 콘솔에 없다.
export async function transitionSource(featureViewName: string, action: FeatureViewAction) {
  return unwrap(
    await client.POST("/v1/client/lifecycle-transitions", {
      body: { feature_view_name: featureViewName, action },
    }),
  )
}

// Partition submit. Unlike the other client verbs this one carries a payload: the partition
// coordinate. The server validates `segment` against the featureView location's declared
// partition_columns (undeclared key / missing declared column / bad value all 400),
// requires the featureView to permit submit, rejects a partition whose coordinate is behind one the
// featureView already published, and fires the materialization job on success. 201 with the created
// partition event.
export async function createSubmission(
  featureViewName: string,
  partition: components["schemas"]["PartitionCoord"],
) {
  return unwrap(
    await client.POST("/v1/client/submissions", {
      body: { feature_view_name: featureViewName, partition },
    }),
  )
}

// The body carries the subject the kind's plane takes — feature_view_name for a featureView event
// kind, store_kind + entity_name for a store one — so a caller never assembles half of a pair.
export async function triggerEvent(body: components["schemas"]["EventTriggerCreate"]) {
  return unwrap(await client.POST("/v1/client/event-triggers", { body }))
}
