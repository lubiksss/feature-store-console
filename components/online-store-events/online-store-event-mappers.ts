import type { StoreEvent } from "@/lib/meta-client"
import type { StoreEventRowData } from "@/components/online-store-events/online-store-event-row"

// ─── Store work-events (server → list rows) ───────────────────────────────────
// entity_name is nullable in the schema so a future store-wide sweep needs no migration; a
// store_profiling run always carries one.
export function toStoreEventRow(e: StoreEvent): StoreEventRowData {
  return {
    storeEventId: e.store_event_id,
    storeName: e.store_name,
    storeKind: e.store_kind,
    // 빈 좌표는 값이다 — undefined 로 접으면 "대상에 엮이지 않는 런"과 "못 읽었다"가 같아진다.
    entityName: e.entity_name,
    eventKind: e.event_kind,
    status: e.status,
    updatedAt: e.updated_at,
  }
}
