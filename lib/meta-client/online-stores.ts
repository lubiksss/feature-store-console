import { client, unwrap, type Query } from "./transport"
import type { components } from "./schema"

// ─── Store (admin) ────────────────────────────────────────────────────────────
// fs_store: one serving store instance — where a featureView's feature values land and are
// served from. A row rather than a pair of env vars, because the values ARE content (an
// endpoint, a credential, the topic a write travels through) and a deployment that holds
// them in its environment can only have one of each.
//
// Identity is the PAIR (store_name, store_kind): the name says WHICH instance, the kind says
// what to treat it as. Both travel in the path because both are its identity.
//
// store_password is write-only. It is accepted on create/patch and appears in no read — the
// operator who needs the value reads the secret store, not this API.
export type Store = components["schemas"]["Store"]
export type StoreList = components["schemas"]["StoreList"]
export type StoreCreate = components["schemas"]["StoreCreate"]
export type StorePatch = components["schemas"]["StorePatch"]
export type StoreKind = components["schemas"]["StoreKind"]

export async function listStores(query?: Query<"listStores">) {
  return unwrap(await client.GET("/v1/admin/online-stores", { params: { query } }))
}

export async function getStore(storeName: string, storeKind: string) {
  return unwrap(
    await client.GET("/v1/admin/online-stores/{store_name}/{store_kind}", {
      params: { path: { store_name: storeName, store_kind: storeKind } },
    }),
  )
}

export async function createStore(body: StoreCreate) {
  return unwrap(await client.POST("/v1/admin/online-stores", { body }))
}

export async function patchStore(storeName: string, storeKind: string, body: StorePatch) {
  return unwrap(
    await client.PATCH("/v1/admin/online-stores/{store_name}/{store_kind}", {
      params: { path: { store_name: storeName, store_kind: storeKind } },
      body,
    }),
  )
}

export async function deleteStore(storeName: string, storeKind: string): Promise<void> {
  unwrap(
    await client.DELETE("/v1/admin/online-stores/{store_name}/{store_kind}", {
      params: { path: { store_name: storeName, store_kind: storeKind } },
    }),
  )
}
