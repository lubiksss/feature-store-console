import type { BatchSource } from "@/lib/meta-client"
import { numStr } from "@/components/shared/mappers-util"
import type { LocationData } from "@/components/batch-sources/location-fields"

// ─── FeatureView Location (server → view) ──────────────────────────────────────────
// The location is read on its featureView's detail page (no list of its own).
export function toLocationData(l: BatchSource): LocationData {
  return {
    updatePeriod: numStr(l.update_period),
    partitionColumns: l.partition_columns,
    hadoopCluster: l.hadoop_cluster ?? undefined,
    hadoopHiveTable: l.hadoop_hive_table ?? undefined,
    hadoopStoragePath: l.hadoop_storage_path ?? undefined,
    hadoopKeyColumnName: l.hadoop_key_column_name,
    hadoopValueColumnName: l.hadoop_value_column_name,
    keyDataType: l.key_data_type ?? undefined,
    valueDataType: l.value_data_type ?? undefined,
    createdAt: l.created_at,
    updatedAt: l.updated_at,
  }
}

