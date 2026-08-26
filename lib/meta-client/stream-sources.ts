import { client, unwrap, type Query } from "./transport"
import type { components } from "./schema"

// ─── FeatureView Stream Spec (admin) ───────────────────────────────────────────────
// feature_name/entity_name stay on this satellite (unlike ingestion spec); only feature_view_name
// is immutable identity, derived from the path. 형상이므로 쓰기는 draft 에서만 받는다.
//
// Create 의 max_window_seconds/max_window_items 는 계약상 필수(minimum 1)인데, 콘솔은 빈
// 입력을 값으로 꾸며 보내지 않고 생략한다 — 서버가 "required" 를 답한다(thin client).
// 생성 타입이 그 둘을 필수로 두므로 폼은 Partial 로 모아 보낸다.
export type StreamSource = components["schemas"]["StreamSource"]
export type Aggregation = components["schemas"]["AggregationEnum"]
export type IdentityFilter = components["schemas"]["IdentityFilterEnum"]
export type StreamFeatureViewList = components["schemas"]["StreamFeatureViewList"]
export type StreamFeatureViewCreate = components["schemas"]["StreamFeatureViewCreate"]
export type StreamFeatureViewPatch = components["schemas"]["StreamFeatureViewPatch"]

export async function listStreamSources(query?: Query<"listStreamSources">) {
  return unwrap(await client.GET("/v1/admin/stream-sources", { params: { query } }))
}

export async function getStreamSource(featureViewName: string) {
  return unwrap(
    await client.GET("/v1/admin/stream-sources/{feature_view_name}", {
      params: { path: { feature_view_name: featureViewName } },
    }),
  )
}

export async function createStreamSource(featureViewName: string, body: StreamFeatureViewCreate) {
  return unwrap(
    await client.POST("/v1/admin/stream-sources/{feature_view_name}", {
      params: { path: { feature_view_name: featureViewName } },
      body,
    }),
  )
}

export async function patchStreamSource(featureViewName: string, body: StreamFeatureViewPatch) {
  return unwrap(
    await client.PATCH("/v1/admin/stream-sources/{feature_view_name}", {
      params: { path: { feature_view_name: featureViewName } },
      body,
    }),
  )
}

export async function deleteStreamSource(featureViewName: string): Promise<void> {
  unwrap(
    await client.DELETE("/v1/admin/stream-sources/{feature_view_name}", {
      params: { path: { feature_view_name: featureViewName } },
    }),
  )
}
