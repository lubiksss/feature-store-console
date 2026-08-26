import type { FeatureViewEvent } from "@/lib/meta-client"
import type { FeatureViewEventRowData } from "@/components/feature-view-events/feature-view-event-row"

// ─── FeatureView work-events (server → list rows) ──────────────────────────────────
export function toFeatureViewEventRow(e: FeatureViewEvent): FeatureViewEventRowData {
  return {
    featureViewEventId: e.feature_view_event_id,
    featureViewName: e.feature_view_name,
    eventKind: e.event_kind,
    status: e.status,
    updatedAt: e.updated_at,
  }
}
