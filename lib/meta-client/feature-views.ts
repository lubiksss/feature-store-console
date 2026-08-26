import { client, unwrap, type Query } from "./transport"
import type { components } from "./schema"

// ─── FeatureView (admin) ───────────────────────────────────────────────────────────
// Flat featureView: no composite read. Each satellite (location/ingestion_spec/stream_spec/schedule)
// is its own admin resource. lifecycle_status carries the shape state; what a featureView can be
// asked to do right now comes from /v1/client/feature-view-actions (see client-workflow.ts).
export type FeatureView = components["schemas"]["FeatureView"]
export type FeatureViewList = components["schemas"]["FeatureViewList"]

// 피처 뷰 행의 닫힌 어휘. 화면·필터가 이 이름을 쓰면 "그 값이 존재하는가"를 계약이 답한다.
export type FeatureViewLifecycleStatus = components["schemas"]["FeatureViewLifecycleStatusEnum"]
export type Producer = components["schemas"]["ProducerEnum"]
// EntityName 은 대상 리소스가 소유한 이름이므로 여기서 다시 선언하지 않고 그쪽에서 가져온다 —
// 두 별칭이 갈리면 같은 값이 화면마다 다른 타입이 된다.
export type { EntityName } from "./entities"

// ─── FeatureView write (admin) ─────────────────────────────────────────────────────
// feature_view_name is NOT a client input — the server derives it as feature_name + "_" +
// entity_name. A created featureView always starts in the state its producer's machine declares;
// lifecycle_status is not seedable. owner is a comma-separated set (min 1). PATCH is
// annotation-only: identity (feature_name/entity_name) and producer are immutable, and
// lifecycle_status/baseline_epoch_at change ONLY via the action endpoint
// (/v1/client/lifecycle-transitions), never a raw set.
export type FeatureViewCreate = components["schemas"]["FeatureViewCreate"]
export type FeatureViewPatch = components["schemas"]["FeatureViewPatch"]

export async function listFeatureViews(query?: Query<"listFeatureViews">) {
  return unwrap(await client.GET("/v1/admin/feature-views", { params: { query } }))
}

export async function getFeatureView(featureViewName: string) {
  return unwrap(
    await client.GET("/v1/admin/feature-views/{feature_view_name}", {
      params: { path: { feature_view_name: featureViewName } },
    }),
  )
}

export async function createFeatureView(body: FeatureViewCreate) {
  return unwrap(await client.POST("/v1/admin/feature-views", { body }))
}

export async function patchFeatureView(featureViewName: string, body: FeatureViewPatch) {
  return unwrap(
    await client.PATCH("/v1/admin/feature-views/{feature_view_name}", {
      params: { path: { feature_view_name: featureViewName } },
      body,
    }),
  )
}

export async function deleteFeatureView(featureViewName: string): Promise<void> {
  unwrap(
    await client.DELETE("/v1/admin/feature-views/{feature_view_name}", {
      params: { path: { feature_view_name: featureViewName } },
    }),
  )
}
