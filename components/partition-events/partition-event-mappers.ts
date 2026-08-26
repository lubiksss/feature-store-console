import type { PartitionEvent } from "@/lib/meta-client"
import type { PartitionEventRowData } from "@/components/partition-events/partition-event-row"

// ─── Partition work-events (server → list rows) ───────────────────────────────
export function toPartitionEventRow(e: PartitionEvent): PartitionEventRowData {
  return {
    partitionEventId: e.partition_event_id,
    featureViewName: e.feature_view_name,
    dt: e.partition.dt,
    hr: e.partition.hr,
    min: e.partition.min,
    segment: e.partition.segment,
    status: e.status,
    updatedAt: e.updated_at,
  }
}
