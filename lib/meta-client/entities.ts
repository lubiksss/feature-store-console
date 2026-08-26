import { client, unwrap, type Query } from "./transport"
import type { components } from "./schema"

// ─── Entity (admin) ───────────────────────────────────────────────────────────
// fs_entity: what a feature is measured on — a user, a keyword, a product. A first-class
// row rather than an enum in some binary, because two of its properties are content no enum
// can hold: the serving-key prefix it owns, and the roster of its instances.
//
// entity_prefix is the keyspace. A serving key is prefix + ":" + the key value, and that ONE
// key is ONE instance's hash whose fields are that instance's features — so every featureView of
// an entity writes into the same hash, and two entities sharing a prefix would mix theirs.
// That is why it is UNIQUE and why it is create-only.
//
// The key-source triple (cluster / hive table / key column) is the roster a store-profiling
// run reads its keys FROM. All-or-none: a half-filled entity fails at trigger time instead
// of at write time, so the server refuses the half.
//
// entity_name on every OTHER resource names one of these rows. It is not an enum on the wire
// (the vocabulary is this table's contents), so a console never has to be redeployed to add
// an entity — which is only true as long as this screen is where they are added.
export type EntityName = components["schemas"]["EntityName"]
export type Entity = components["schemas"]["Entity"]
export type EntityList = components["schemas"]["EntityList"]
export type EntityCreate = components["schemas"]["EntityCreate"]
export type EntityPatch = components["schemas"]["EntityPatch"]

export async function listEntities(query?: Query<"listEntities">) {
  return unwrap(await client.GET("/v1/admin/entities", { params: { query } }))
}

export async function getEntity(entityName: EntityName) {
  return unwrap(
    await client.GET("/v1/admin/entities/{entity_name}", {
      params: { path: { entity_name: entityName } },
    }),
  )
}

export async function createEntity(body: EntityCreate) {
  return unwrap(await client.POST("/v1/admin/entities", { body }))
}

export async function patchEntity(entityName: EntityName, body: EntityPatch) {
  return unwrap(
    await client.PATCH("/v1/admin/entities/{entity_name}", {
      params: { path: { entity_name: entityName } },
      body,
    }),
  )
}

export async function deleteEntity(entityName: EntityName): Promise<void> {
  unwrap(
    await client.DELETE("/v1/admin/entities/{entity_name}", {
      params: { path: { entity_name: entityName } },
    }),
  )
}
