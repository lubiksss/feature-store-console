import type { StoreProfile } from "@/lib/meta-client"
import type { StoreProfileRowData } from "@/components/online-store-profiles/online-store-profile-row"

// ─── Store Profile (server → flat per-field list rows) ────────────────────────
// entity_name rides on the row rather than behind the event, so a list is readable and
// filterable without a second fetch — the same choice fs_feature_view_profile makes with
// feature_view_name.
export function toStoreProfileRow(p: StoreProfile): StoreProfileRowData {
  return {
    storeEventId: p.store_event_id,
    storeName: p.store_name,
    storeKind: p.store_kind,
    entityName: p.entity_name,
    fieldName: p.field_name,
    fieldPath: p.field_path,
    fieldType: p.field_type,
    createdAt: p.created_at,
  }
}
