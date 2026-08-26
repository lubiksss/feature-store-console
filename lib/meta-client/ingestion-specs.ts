import { client, unwrap, type Query } from "./transport"
import type { components } from "./schema"

// ─── FeatureView Ingestion Spec (admin) ────────────────────────────────────────────────
// feature_name/entity_name are NOT on this satellite — they live on the parent featureView (SSOT).
// feature_view_name comes from the path on create. 형상이므로 쓰기는 draft 에서만 받는다.
export type IngestionSpec = components["schemas"]["IngestionSpec"]
export type SourceFormat = components["schemas"]["SourceFormatEnum"]
export type HDFSFormat = components["schemas"]["HDFSFormatEnum"]
export type IngestionSpecList = components["schemas"]["IngestionSpecList"]
export type IngestionSpecCreate = components["schemas"]["IngestionSpecCreate"]
export type IngestionSpecPatch = components["schemas"]["IngestionSpecPatch"]

export async function listIngestionSpecs(query?: Query<"listIngestionSpecs">) {
  return unwrap(await client.GET("/v1/admin/ingestion-specs", { params: { query } }))
}

export async function getIngestionSpec(featureViewName: string) {
  return unwrap(
    await client.GET("/v1/admin/ingestion-specs/{feature_view_name}", {
      params: { path: { feature_view_name: featureViewName } },
    }),
  )
}

export async function createIngestionSpec(
  featureViewName: string,
  body: IngestionSpecCreate,
) {
  return unwrap(
    await client.POST("/v1/admin/ingestion-specs/{feature_view_name}", {
      params: { path: { feature_view_name: featureViewName } },
      body,
    }),
  )
}

export async function patchIngestionSpec(featureViewName: string, body: IngestionSpecPatch) {
  return unwrap(
    await client.PATCH("/v1/admin/ingestion-specs/{feature_view_name}", {
      params: { path: { feature_view_name: featureViewName } },
      body,
    }),
  )
}

export async function deleteIngestionSpec(featureViewName: string): Promise<void> {
  unwrap(
    await client.DELETE("/v1/admin/ingestion-specs/{feature_view_name}", {
      params: { path: { feature_view_name: featureViewName } },
    }),
  )
}
