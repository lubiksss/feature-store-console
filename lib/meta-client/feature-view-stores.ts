import { client, unwrap, type Query } from "./transport"
import type { components } from "./schema"

// ─── FeatureView Store (admin; membership) ─────────────────────────────────────────
// fs_feature_view_store: 이 피처 뷰의 값이 어느 온라인 스토어 인스턴스에 적재되는가. 정체성은
// (feature_view_name, store_kind) 짝이라 한 피처 뷰는 한 종류의 온라인 스토어 하나에만 실리고, store_name 은
// 그 종류의 어느 인스턴스인지를 말하므로 바꿀 수 있는 유일한 값이다.
//
// 다른 피처 뷰 위성(location / specs)과 같은 규약이다: 서버가 draft 에서만 쓰기를 받는다
// (형상이 얼면 409). 적재 대상도 피처 뷰의 형상이기 때문이다.
export type FeatureViewStore = components["schemas"]["FeatureViewStore"]
export type FeatureViewStoreList = components["schemas"]["FeatureViewStoreList"]
export type FeatureViewStoreCreate = components["schemas"]["FeatureViewStoreCreate"]
export type FeatureViewStorePatch = components["schemas"]["FeatureViewStorePatch"]

export async function listFeatureViewStores(query?: Query<"listFeatureViewStores">) {
  return unwrap(await client.GET("/v1/admin/feature-view-stores", { params: { query } }))
}

export async function getFeatureViewStore(featureViewName: string, storeKind: string) {
  return unwrap(
    await client.GET("/v1/admin/feature-view-stores/{feature_view_name}/{store_kind}", {
      params: { path: { feature_view_name: featureViewName, store_kind: storeKind } },
    }),
  )
}

export async function createFeatureViewStore(body: FeatureViewStoreCreate) {
  return unwrap(await client.POST("/v1/admin/feature-view-stores", { body }))
}

export async function patchFeatureViewStore(
  featureViewName: string,
  storeKind: string,
  body: FeatureViewStorePatch,
) {
  return unwrap(
    await client.PATCH("/v1/admin/feature-view-stores/{feature_view_name}/{store_kind}", {
      params: { path: { feature_view_name: featureViewName, store_kind: storeKind } },
      body,
    }),
  )
}

export async function deleteFeatureViewStore(featureViewName: string, storeKind: string): Promise<void> {
  unwrap(
    await client.DELETE("/v1/admin/feature-view-stores/{feature_view_name}/{store_kind}", {
      params: { path: { feature_view_name: featureViewName, store_kind: storeKind } },
    }),
  )
}
