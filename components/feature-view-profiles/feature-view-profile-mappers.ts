import type { FeatureViewProfile } from "@/lib/meta-client"
import type { FeatureViewProfileRowData } from "@/components/feature-view-profiles/feature-view-profile-row"

// ─── FeatureView Profile (server → flat per-field list rows) ───────────────────────
export function toFeatureViewProfileRow(p: FeatureViewProfile): FeatureViewProfileRowData {
  const c = p.partition
  return {
    featureViewName: p.feature_view_name,
    dt: c.dt,
    hr: c.hr,
    min: c.min,
    segment: c.segment || undefined,
    fieldPath: p.field_path,
    fieldType: p.field_type,
    createdAt: p.created_at,
  }
}
