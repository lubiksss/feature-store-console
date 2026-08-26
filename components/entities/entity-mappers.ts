import type { Entity } from "@/lib/meta-client"
import type { EntityRowData } from "@/components/entities/entity-row"
import type { EntityDetailData } from "@/components/entities/entity-detail"

// ─── Entity (server → view) ───────────────────────────────────────────────────
export function toEntityRow(e: Entity): EntityRowData {
  return {
    entityName: e.entity_name,
    description: e.description ?? undefined,
    owner: e.owner,
    updatedAt: e.updated_at,
  }
}

export function toEntityDetail(e: Entity): EntityDetailData {
  return {
    entityName: e.entity_name,
    entityPrefix: e.entity_prefix,
    owner: e.owner,
    description: e.description ?? undefined,
    keySourceHadoopCluster: e.key_source_hadoop_cluster ?? undefined,
    keySourceHiveTable: e.key_source_hive_table ?? undefined,
    keySourceKeyColumn: e.key_source_key_column ?? undefined,
    createdAt: e.created_at,
    updatedAt: e.updated_at,
  }
}

