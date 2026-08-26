import { client, unwrap, type Query } from "./transport"
import type { components } from "./schema"

// ─── FeatureView Profile (admin; per-field profiling result) ───────────────────────
// fs_feature_view_profile: one row per profiled field, keyed by (feature_view_name, partition,
// field_path). Read-only in the console; profiling runs are triggered via /v1/client.
// Exposed as a flat per-field list → single-field detail.
export type FeatureViewProfile = components["schemas"]["FeatureViewProfile"]
export type FeatureViewProfileList = components["schemas"]["FeatureViewProfileList"]

// GET /v1/admin/feature-view-profiles → flat per-field filter list.
// All list filters are IN-lists (array/explode) — including the partition coords and
// field_path. (The single-field detail below uses scalar natural-key params — different route.)
export async function listFeatureViewProfiles(query?: Query<"listFeatureViewProfiles">) {
  return unwrap(await client.GET("/v1/admin/feature-view-profiles", { params: { query } }))
}

// GET /v1/admin/feature-view-profiles/{feature_view_name}/partitions/{dt}/fields/{field_path} → one field's stats.
export async function getFeatureViewProfile(
  featureViewName: string,
  dt: string,
  fieldPath: string,
  coord?: { hr?: string; min?: string; segment?: string },
) {
  return unwrap(
    await client.GET(
      "/v1/admin/feature-view-profiles/{feature_view_name}/partitions/{dt}/fields/{field_path}",
      {
        params: {
          path: { feature_view_name: featureViewName, dt: dt, field_path: fieldPath },
          // hr/min/segment are required-but-may-be-empty on the natural key; always send them.
          query: {
            hr: coord?.hr ?? "",
            min: coord?.min ?? "",
            segment: coord?.segment ?? "",
          },
        },
      },
    ),
  )
}
