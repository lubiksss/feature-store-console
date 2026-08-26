import type { Store } from "@/lib/meta-client"
import type { StoreRowData } from "@/components/online-stores/online-store-row"
import type { StoreDetailData } from "@/components/online-stores/online-store-detail"

// ─── Store (server → view) ────────────────────────────────────────────────────
export function toStoreRow(s: Store): StoreRowData {
  return {
    storeName: s.store_name,
    storeKind: s.store_kind,
    owner: s.owner,
    updatedAt: s.updated_at,
  }
}

export function toStoreDetail(s: Store): StoreDetailData {
  return {
    storeName: s.store_name,
    storeKind: s.store_kind,
    owner: s.owner,
    description: s.description ?? undefined,
    storeEndpoint: s.store_endpoint ?? undefined,
    kafkaBroker: s.kafka_broker,
    kafkaTopic: s.kafka_topic,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
  }
}

