import type { FeatureView } from "@/lib/meta-client"
import type { FeatureViewDetailData } from "@/components/feature-views/feature-view-detail"
import type { FeatureViewRowData } from "@/components/feature-views/feature-view-row"

// ─── FeatureView (server → view) ─────────────────────────────────────────────────
export function toFeatureViewDetail(s: FeatureView): FeatureViewDetailData {
  return {
    featureViewName: s.feature_view_name,
    featureName: s.feature_name,
    entityName: s.entity_name,
    producer: s.producer,
    owner: s.owner,
    description: s.description ?? undefined,
    ttlSeconds: s.ttl_seconds ?? undefined,
    lifecycleStatus: s.lifecycle_status,
    baselineEpochAt: s.baseline_epoch_at,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
  }
}

export function toFeatureViewRow(s: FeatureView): FeatureViewRowData {
  return {
    featureViewName: s.feature_view_name,
    entityName: s.entity_name,
    producer: s.producer,
    owner: s.owner,
    lifecycleStatus: s.lifecycle_status,
    updatedAt: s.updated_at,
  }
}
