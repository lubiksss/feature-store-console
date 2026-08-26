import { client, unwrap } from "./transport"
import type { components } from "./schema"

// ─── Operation Policy (admin, global singleton id=1) ──────────────────────────
// Global feature-store-system knobs (consistency/materialization/validation/retirement). One row (id=1);
// the console views and edits it — no add/delete (the singleton always exists).
// *_sample_row_limit are nullable overrides (null = disabled).
export const OPERATION_POLICY_ID = 1

export type OperationPolicy = components["schemas"]["OperationPolicy"]
export type OperationPolicyPatch = components["schemas"]["OperationPolicyPatch"]

export async function getOperationPolicy(id: number = OPERATION_POLICY_ID) {
  return unwrap(await client.GET("/v1/admin/operation-policy/{id}", { params: { path: { id } } }))
}

export async function patchOperationPolicy(id: number, body: OperationPolicyPatch) {
  return unwrap(
    await client.PATCH("/v1/admin/operation-policy/{id}", { params: { path: { id } }, body }),
  )
}
