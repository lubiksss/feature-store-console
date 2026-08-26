import { client, unwrap, type Query } from "./transport"
import type { components } from "./schema"

// Partition coordinate — shared across partition events, profiles, and materialization/
// consistency results. The API nests it under `partition`.
export type PartitionCoord = components["schemas"]["PartitionCoord"]

// ─── Feature View Event (admin; source-scoped work-event) ───────────────────────────
// One stateful work-event per source-level run (validation/retirement/profiling/ingestion).
// event_kind picks the kind; status is the outcome (submitted→succeeded|failed). Keyed by
// feature_view_event_id. 실행 중인 것이 무엇인지는 lifecycle_status 가 아니라 이 저널이 안다.
export type FeatureViewEvent = components["schemas"]["FeatureViewEvent"]
export type FeatureViewEventKind = components["schemas"]["FeatureViewEventKindEnum"]
export type FeatureViewEventList = components["schemas"]["FeatureViewEventList"]

export async function listFeatureViewEvents(query?: Query<"listFeatureViewEvents">) {
  return unwrap(await client.GET("/v1/admin/feature-view-events", { params: { query } }))
}

export async function getFeatureViewEvent(id: number) {
  return unwrap(
    await client.GET("/v1/admin/feature-view-events/{feature_view_event_id}", {
      params: { path: { feature_view_event_id: id } },
    }),
  )
}

// ─── Partition Event (admin; per-partition milestone work-event) ──────────────
// fs_partition_event: submitted→succeeded→consistency_succeeded / failed. Keyed by
// partition_event_id. The API nests the coordinate under `partition`.
export type PartitionEvent = components["schemas"]["PartitionEvent"]
export type PartitionEventList = components["schemas"]["PartitionEventList"]
export type PartitionStatus = components["schemas"]["PartitionStatusEnum"]

export async function listPartitionEvents(query?: Query<"listPartitionEvents">) {
  return unwrap(await client.GET("/v1/admin/partition-events", { params: { query } }))
}

export async function getPartitionEvent(id: number) {
  return unwrap(
    await client.GET("/v1/admin/partition-events/{partition_event_id}", {
      params: { path: { partition_event_id: id } },
    }),
  )
}

// ─── Execution (admin; Spark-run telemetry) ───────────────────────────────────
// Pure Spark-run telemetry, born when Spark first reports (NOT at k8s-Job creation — that
// failure lives on the event). event_kind determines which event FK is set
// (materialization/consistency→partition_event_id, validation/retirement/profiling/ingestion
// →feature_view_event_id). execution_id is a surrogate PK; it drives NO status. The console
// embeds an event's executions in that event's detail.
export type Execution = components["schemas"]["Execution"]
export type ExecutionList = components["schemas"]["ExecutionList"]

export async function listExecutions(query?: Query<"listExecutions">) {
  return unwrap(await client.GET("/v1/admin/executions", { params: { query } }))
}

// ─── Partition Materialization Result (admin) ───────────────────────────────────────────
// fs_partition_materialization_result: durable materialization/dump publish fact, 1:1 by
// partition_event_id. baseline_* mirrors the diff baseline's manifest, submitted_*
// this partition's output.
export type PartitionMaterializationResult = components["schemas"]["PartitionMaterializationResult"]

export async function getPartitionMaterializationResult(id: number) {
  return unwrap(
    await client.GET("/v1/admin/partition-materialization-results/{partition_event_id}", {
      params: { path: { partition_event_id: id } },
    }),
  )
}

// ─── Partition Consistency Result (admin) ─────────────────────────────────────
// fs_partition_consistency_result: Hive↔Redis check measurements, 1:1 by
// partition_event_id.
export type PartitionConsistencyResult = components["schemas"]["PartitionConsistencyResult"]

export async function getPartitionConsistencyResult(id: number) {
  return unwrap(
    await client.GET("/v1/admin/partition-consistency-results/{partition_event_id}", {
      params: { path: { partition_event_id: id } },
    }),
  )
}
