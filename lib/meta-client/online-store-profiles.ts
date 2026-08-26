import { client, unwrap, type Query } from "./transport"
import type { components } from "./schema"

// ─── Store Event (admin; store-scoped work-event) ─────────────────────────────
// fs_store_event: one store-profiling run. The third event subject — feature_view_event is
// about a featureView, partition_event about a partition, this about a STORE. A run probes one
// store with one key sample, so its subject is the entity_name: one key is a hash holding
// every feature of that type, and a single probe observes all of them.
export type StoreEvent = components["schemas"]["StoreEvent"]
export type StoreEventKind = components["schemas"]["StoreEventKindEnum"]
export type StoreEventList = components["schemas"]["StoreEventList"]

export async function listStoreEvents(query?: Query<"listStoreEvents">) {
  return unwrap(await client.GET("/v1/admin/online-store-events", { params: { query } }))
}

export async function getStoreEvent(id: number) {
  return unwrap(
    await client.GET("/v1/admin/online-store-events/{store_event_id}", {
      params: { path: { store_event_id: id } },
    }),
  )
}

// ─── Store Profile (admin; per-observed-field store statistics) ───────────────
// fs_store_profile: one row per (store_event_id, field_name, field_path). Read-only in
// the console; runs are triggered via /v1/client/event-triggers.
//
// Keyed by the OBSERVED field, not by a featureView — nothing enumerates the fields for a run,
// so a field serving with no catalog featureView appears here like any other. That is the
// finding the plane exists to surface, not an anomaly to hide.
export type StoreProfile = components["schemas"]["StoreProfile"]
export type StoreProfileList = components["schemas"]["StoreProfileList"]

// GET /v1/admin/online-store-profiles → flat per-field filter list.
// All list filters are IN-lists (array/explode), same as featureView profiles. entity_name is the
// SUBJECT filter: the row carries it so a list can be read without joining the event.
export async function listStoreProfiles(query?: Query<"listStoreProfiles">) {
  return unwrap(await client.GET("/v1/admin/online-store-profiles", { params: { query } }))
}

// GET /v1/admin/online-store-profiles/{store_event_id}/fields/{field_name} → one node's stats.
// The natural key is (store_event_id, field_name, field_path); field_path rides as a query
// coord because the path already carries the other two — the same place featureView profiles put
// the partition's hr/min/segment, which are natural-key coords the hierarchy has no
// room for.
export async function getStoreProfile(storeEventId: number, fieldName: string, fieldPath: string) {
  return unwrap(
    await client.GET("/v1/admin/online-store-profiles/{store_event_id}/fields/{field_name}", {
      params: {
        path: { store_event_id: storeEventId, field_name: fieldName },
        query: { field_path: fieldPath },
      },
    }),
  )
}
