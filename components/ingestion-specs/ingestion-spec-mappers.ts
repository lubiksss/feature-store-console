import type { IngestionSpec } from "@/lib/meta-client"
import type { IngestionSpecRowData } from "@/components/ingestion-specs/ingestion-spec-row"
import type { IngestionSpecDetailData } from "@/components/ingestion-specs/ingestion-spec-detail"

// ─── FeatureView Ingestion Spec (server → view) ────────────────────────────────────────
export function toIngestionSpecRow(b: IngestionSpec): IngestionSpecRowData {
  return {
    featureViewName: b.feature_view_name,
    sourcePathPattern: b.source_path_pattern,
    outputHdfsPathPattern: b.output_hdfs_path_pattern,
    updatedAt: b.updated_at,
  }
}

export function toIngestionSpecDetail(b: IngestionSpec): IngestionSpecDetailData {
  return {
    partitionKeys: b.partition_keys,
    partitionFallback: b.partition_fallback,
    sourcePathPattern: b.source_path_pattern,
    sourceFormat: b.source_format,
    // 계약은 nullable(null = 미설정)이고 뷰는 부재를 undefined 하나로만 다룬다 — numStr 과
    // 같은 규약이다. 손으로 쓴 타입이 nullable 을 빠뜨렸던 것을 생성 타입이 드러냈다.
    sampleRowLimit: b.sample_row_limit ?? undefined,
    transformSql: b.transform_sql,
    outputHdfsPathPattern: b.output_hdfs_path_pattern,
    outputHdfsFormat: b.output_hdfs_format,
    outputHiveFullTableName: b.output_hive_full_table_name,
    outputHiveValueType: b.output_hive_value_type,
    createdAt: b.created_at,
    updatedAt: b.updated_at,
  }
}

