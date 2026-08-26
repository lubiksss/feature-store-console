import { client, unwrap } from "./transport"
import type { components } from "./schema"

// ─── FeatureView Location (admin) ──────────────────────────────────────────────────
// Pure catalog with hadoop_/redis_ grouped fields. Hadoop storage fields are all nullable;
// the Redis group carries the serving contract and is entirely server-managed at create:
// entity_prefix is derived from the featureView's (immutable) entity_name — read-only, never sent;
// 서빙 좌표는 이 리소스에 없다 — 접두사는 대상의 것이고 온라인 스토어는 멤버십이 답한다.
// editable via patch. entity_prefix is a scalar key prefix (max 64, no ':'); the pipeline
// composes the full key from it.
//
// 이 satellite 는 피처 뷰의 "형상"이다 — 잡이 읽는 것이므로 서버가 draft 에서만 쓰기를 받는다
// (오퍼의 shape_editable).
export type BatchSource = components["schemas"]["BatchSource"]
export type HadoopCluster = components["schemas"]["HadoopClusterEnum"]
export type KeyDataType = components["schemas"]["KeyDataTypeEnum"]
export type ValueDataType = components["schemas"]["ValueDataTypeEnum"]
export type BatchFeatureViewCreate = components["schemas"]["BatchFeatureViewCreate"]
export type BatchFeatureViewPatch = components["schemas"]["BatchFeatureViewPatch"]

export async function getBatchSource(featureViewName: string) {
  return unwrap(
    await client.GET("/v1/admin/batch-sources/{feature_view_name}", {
      params: { path: { feature_view_name: featureViewName } },
    }),
  )
}

export async function createBatchSource(featureViewName: string, body: BatchFeatureViewCreate) {
  return unwrap(
    await client.POST("/v1/admin/batch-sources/{feature_view_name}", {
      params: { path: { feature_view_name: featureViewName } },
      body,
    }),
  )
}

export async function patchBatchSource(featureViewName: string, body: BatchFeatureViewPatch) {
  return unwrap(
    await client.PATCH("/v1/admin/batch-sources/{feature_view_name}", {
      params: { path: { feature_view_name: featureViewName } },
      body,
    }),
  )
}

export async function deleteBatchSource(featureViewName: string): Promise<void> {
  unwrap(
    await client.DELETE("/v1/admin/batch-sources/{feature_view_name}", {
      params: { path: { feature_view_name: featureViewName } },
    }),
  )
}
