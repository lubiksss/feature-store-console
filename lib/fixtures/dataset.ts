// 정적 데모용 샘플 카탈로그.
//
// 실제 서비스 데이터가 아니다 — 피처 스토어 도메인 모델(엔티티·피처 뷰·스토어·스펙·이벤트·
// 파티션)이 화면에서 어떻게 읽히는지 보이기 위한 합성 데이터다. 값은 결정적으로 생성되므로
// 빌드마다 같은 페이지가 나온다(정적 export 전제).
import type { components } from "@/lib/meta-client/schema"

type S = components["schemas"]

// ─── 시간 축 ──────────────────────────────────────────────────────────────────
// 빌드 시각을 기준으로 삼는다. 고정 날짜로 못 박으면 배포가 지날수록 데이터가 과거로
// 밀려, 최근 N일 창으로 조회하는 화면(대시보드)이 전부 0을 보여준다. 산출물이 빌드마다
// 달라지는 대신, 데모가 언제 열려도 최근 데이터를 보여주는 쪽을 택했다.
const T0 = Date.now()
const HOUR = 3_600_000
const DAY = 24 * HOUR

const at = (offsetMs: number): string => new Date(T0 + offsetMs).toISOString()
const dt = (offsetDays: number): string => at(offsetDays * DAY).slice(0, 10)

// 결정적 의사난수 — 같은 seed면 같은 수열. Math.random을 쓰면 빌드마다 흔들린다.
function rng(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0x100000000
  }
}
const pick = <T,>(r: () => number, xs: readonly T[]): T => xs[Math.floor(r() * xs.length)]

// ─── Entity ───────────────────────────────────────────────────────────────────
export const entities: S["Entity"][] = [
  {
    entity_name: "user",
    entity_prefix: "u",
    owner: "feature-platform",
    description: "서비스 이용자. 추론 요청의 기본 키.",
    key_source_hadoop_cluster: "hadoop-primary",
    key_source_hive_table: "fs_catalog.dim_user",
    key_source_key_column: "user_id",
    created_at: at(-180 * DAY),
    updated_at: at(-12 * DAY),
  },
  {
    entity_name: "item",
    entity_prefix: "i",
    owner: "feature-platform",
    description: "노출·추천 대상 아이템.",
    key_source_hadoop_cluster: "hadoop-primary",
    key_source_hive_table: "fs_catalog.dim_item",
    key_source_key_column: "item_id",
    created_at: at(-176 * DAY),
    updated_at: at(-30 * DAY),
  },
  {
    entity_name: "merchant",
    entity_prefix: "m",
    owner: "merchant-insight",
    description: "판매자. 아이템의 상위 집계 축.",
    key_source_hadoop_cluster: "hadoop-secondary",
    key_source_hive_table: "fs_catalog.dim_merchant",
    key_source_key_column: "merchant_id",
    created_at: at(-120 * DAY),
    updated_at: at(-9 * DAY),
  },
  {
    entity_name: "keyword",
    entity_prefix: "k",
    owner: "search-relevance",
    description: "검색 질의어의 정규화 형태.",
    key_source_hadoop_cluster: "hadoop-primary",
    key_source_hive_table: "fs_catalog.dim_keyword",
    key_source_key_column: "keyword_norm",
    created_at: at(-95 * DAY),
    updated_at: at(-21 * DAY),
  },
]

// ─── Store ────────────────────────────────────────────────────────────────────
export const stores: S["Store"][] = [
  {
    store_name: "serving-cluster",
    store_kind: "cluster",
    owner: "feature-platform",
    description: "추론 서버가 직접 읽는 1차 온라인 스토어.",
    store_endpoint: "serving-cluster.store.example.net:6379",
    kafka_broker: "broker-a.example.net:9092",
    kafka_topic: "fs-diff",
    created_at: at(-180 * DAY),
    updated_at: at(-40 * DAY),
  },
  {
    store_name: "serving-cluster-express",
    store_kind: "cluster",
    owner: "feature-platform",
    description: "갱신 주기가 10분 이하인 고빈도 피처 뷰 전용 경로.",
    store_endpoint: "serving-cluster.store.example.net:6379",
    kafka_broker: "broker-a.example.net:9092",
    kafka_topic: "fs-diff-express",
    created_at: at(-88 * DAY),
    updated_at: at(-11 * DAY),
  },
  {
    store_name: "serving-cache",
    store_kind: "kvcache",
    owner: "feature-platform",
    description: "읽기 부하를 흡수하는 2차 캐시. 단일키 연산만 지원.",
    store_endpoint: "serving-cache.store.example.net:6380",
    kafka_broker: "broker-b.example.net:9092",
    kafka_topic: "fs-diff",
    created_at: at(-150 * DAY),
    updated_at: at(-19 * DAY),
  },
]

// ─── FeatureView ───────────────────────────────────────────────────────────────────
// feature_view_name = feature_name + "_" + entity_name (서버가 파생한다)
interface SourceSeed {
  feature: string
  entity: string
  producer: S["ProducerEnum"]
  status: S["FeatureViewLifecycleStatusEnum"]
  owner: string
  desc: string
  ttl?: number
  periodSec?: number
}

const sourceSeeds: SourceSeed[] = [
  // batch
  { feature: "purchase_count_7d", entity: "user", producer: "batch", status: "active", owner: "feature-platform", desc: "최근 7일 구매 건수", ttl: 14 * 86400, periodSec: 86400 },
  { feature: "click_count_1d", entity: "user", producer: "batch", status: "active", owner: "feature-platform", desc: "최근 1일 클릭 건수", ttl: 7 * 86400, periodSec: 3600 },
  { feature: "category_affinity", entity: "user", producer: "batch", status: "active", owner: "ranking-model", desc: "카테고리별 선호도 벡터", ttl: 30 * 86400, periodSec: 86400 },
  { feature: "popularity_1h", entity: "item", producer: "batch", status: "active", owner: "ranking-model", desc: "1시간 단위 인기도 점수", ttl: 3 * 86400, periodSec: 600 },
  { feature: "ctr_7d", entity: "merchant", producer: "batch", status: "active", owner: "merchant-insight", desc: "최근 7일 반응률", ttl: 14 * 86400, periodSec: 86400 },
  { feature: "query_volume_1d", entity: "keyword", producer: "batch", status: "suspended", owner: "search-relevance", desc: "질의량 일간 집계", ttl: 7 * 86400, periodSec: 86400 },
  { feature: "price_band", entity: "item", producer: "batch", status: "draft", owner: "ranking-model", desc: "가격대 버킷", periodSec: 86400 },
  { feature: "return_rate_30d", entity: "merchant", producer: "batch", status: "validation_failed", owner: "merchant-insight", desc: "반품률 30일 집계", periodSec: 86400 },
  // stream
  { feature: "recent_click_items", entity: "user", producer: "stream", status: "active", owner: "feature-platform", desc: "최근 클릭 아이템 윈도우", ttl: 86400, periodSec: 60 },
  { feature: "recent_query_keywords", entity: "user", producer: "stream", status: "active", owner: "search-relevance", desc: "최근 질의어 윈도우", ttl: 86400, periodSec: 60 },
  { feature: "session_view_items", entity: "user", producer: "stream", status: "active", owner: "ranking-model", desc: "세션 내 조회 아이템 윈도우", ttl: 3600, periodSec: 60 },
  { feature: "recent_conversion_items", entity: "user", producer: "stream", status: "retired", owner: "feature-platform", desc: "최근 전환 아이템 윈도우", periodSec: 60 },
  // external
  { feature: "ltv_score", entity: "user", producer: "external", status: "active", owner: "growth-analytics", desc: "생애가치 예측 점수(상류 팀 적재)", ttl: 30 * 86400, periodSec: 86400 },
  { feature: "fraud_score", entity: "user", producer: "external", status: "active", owner: "trust-safety", desc: "부정 이용 위험 점수(상류 팀 적재)", ttl: 7 * 86400, periodSec: 3600 },
]

export const featureViews: S["FeatureView"][] = sourceSeeds.map((s, i) => ({
  feature_view_name: `${s.feature}_${s.entity}`,
  feature_name: s.feature,
  entity_name: s.entity,
  producer: s.producer,
  owner: s.owner,
  description: s.desc,
  ttl_seconds: s.ttl ?? null,
  lifecycle_status: s.status,
  baseline_epoch_at: at(-(30 + i) * DAY),
  created_at: at(-(90 + i * 3) * DAY),
  updated_at: at(-(i % 11) * DAY - HOUR),
}))

const seedOf = (name: string) => sourceSeeds[featureViews.findIndex((s) => s.feature_view_name === name)]

// ─── BatchSource ───────────────────────────────────────────────────────────
export const batchSources: S["BatchSource"][] = featureViews.map((s, i) => {
  const seed = sourceSeeds[i]
  const hourly = (seed.periodSec ?? 86400) <= 3600
  return {
    feature_view_name: s.feature_view_name,
    update_period: seed.periodSec ?? 86400,
    partition_columns: hourly ? "dt,hr" : "dt",
    hadoop_cluster: i % 3 === 2 ? "hadoop-secondary" : "hadoop-primary",
    hadoop_hive_table: `fs_catalog.${s.feature_view_name}`,
    hadoop_storage_path: `hdfs://hadoop-primary/fs_catalog/${s.feature_name}/${s.entity_name}`,
    hadoop_key_column_name: "key",
    hadoop_value_column_name: "value",
    key_data_type: "string",
    value_data_type: pick(rng(100 + i), ["string", "int", "double", "array<string>", "map<string,double>"] as S["ValueDataTypeEnum"][]),
    created_at: s.created_at,
    updated_at: s.updated_at,
  }
})

// ─── FeatureViewStore ──────────────────────────────────────────────────────────────
export const featureViewStores: S["FeatureViewStore"][] = featureViews.flatMap((s, i) => {
  const seed = sourceSeeds[i]
  const express = (seed.periodSec ?? 86400) <= 600
  const rows: S["FeatureViewStore"][] = [
    {
      feature_view_name: s.feature_view_name,
      store_kind: "cluster",
      store_name: express ? "serving-cluster-express" : "serving-cluster",
      created_at: s.created_at,
    },
  ]
  if (i % 3 === 0) {
    rows.push({
      feature_view_name: s.feature_view_name,
      store_kind: "kvcache",
      store_name: "serving-cache",
      created_at: s.created_at,
    })
  }
  return rows
})

// ─── IngestionSpec (batch 피처 뷰만) ───────────────────────────────────────
export const ingestionSpecs: S["IngestionSpec"][] = featureViews
  .filter((s) => s.producer === "batch")
  .map((s, i) => {
    const seed = seedOf(s.feature_view_name)
    const hourly = (seed.periodSec ?? 86400) <= 3600
    return {
      feature_view_name: s.feature_view_name,
      partition_keys: hourly ? "dt,hr" : "dt",
      partition_fallback: hourly ? "" : "dt=${yesterday}",
      source_path_pattern: `hdfs://hadoop-primary/upstream/${s.feature_name}/dt=\${dt}${hourly ? "/hr=${hr}" : ""}`,
      source_format: pick(rng(200 + i), ["parquet", "json", "text"] as S["SourceFormatEnum"][]),
      sample_row_limit: 100_000,
      transform_sql: `SELECT ${s.entity_name}_id AS key, CAST(metric AS STRING) AS value\nFROM upstream_${s.feature_name}\nWHERE metric IS NOT NULL`,
      output_hdfs_path_pattern: `hdfs://hadoop-primary/fs_catalog/${s.feature_name}/${s.entity_name}/dt=\${dt}`,
      output_hdfs_format: "parquet",
      output_hive_full_table_name: `fs_catalog.${s.feature_view_name}`,
      output_hive_value_type: "string",
      created_at: s.created_at,
      updated_at: s.updated_at,
    }
  })

// ─── StreamSource (stream 피처 뷰만) ─────────────────────────────────────────
export const streamSpecs: S["StreamSource"][] = featureViews
  .filter((s) => s.producer === "stream")
  .map((s, i) => ({
    feature_view_name: s.feature_view_name,
    feature_name: s.feature_name,
    entity_name: s.entity_name,
    input_broker: "broker-a.example.net:9092",
    input_topic: `raw-${s.feature_name.replace(/_/g, "-")}`,
    consumer_group: `fs-stream-${s.feature_view_name}`,
    input_schema: "json",
    sample_partition: 0,
    key_path: "$.user.id",
    value_path: "$.payload.item_id",
    event_ts_path: "$.event_ts",
    event_ts_format: "epoch_millis",
    aggregation_type: pick(rng(300 + i), ["list", "map", "count"] as S["AggregationEnum"][]),
    dedup_on_output: i % 2 === 0,
    max_window_seconds: [300, 900, 3600, 86400][i % 4],
    max_window_items: [20, 50, 100, 200][i % 4],
    output_broker: "broker-a.example.net:9092",
    output_topic: "fs-diff",
    identity_filter_type: (i % 2 === 0 ? "reaction" : "conversion") as S["IdentityFilterEnum"],
    identity_fallback_path: "$.user.is_fallback",
    filter_flags_path: "$.user.flags",
    created_at: s.created_at,
    updated_at: s.updated_at,
  }))

// ─── PartitionEvent ───────────────────────────────────────────────────────────
const activeBatch = featureViews.filter((s) => s.producer !== "stream" && s.lifecycle_status === "active")

export const partitionEvents: S["PartitionEvent"][] = activeBatch.flatMap((s, si) => {
  const r = rng(400 + si)
  const loc = batchSources.find((l) => l.feature_view_name === s.feature_view_name)!
  const hourly = (loc.partition_columns ?? "").includes("hr")
  return Array.from({ length: 6 }, (_, k) => {
    const id = 90_000 + si * 100 + k
    const ageDays = k
    const status = pick(r, [
      "consistency_succeeded",
      "consistency_succeeded",
      "materialization_succeeded",
      "consistency_submitted",
      "materialization_failed",
    ] as S["PartitionStatusEnum"][])
    const mSub = at(-ageDays * DAY - 2 * HOUR)
    const ok = status !== "materialization_failed"
    return {
      partition_event_id: id,
      feature_view_name: s.feature_view_name,
      partition: {
        dt: dt(-ageDays),
        ...(hourly ? { hr: String((23 - k) % 24).padStart(2, "0") } : {}),
        segment: "",
      },
      status,
      materialization_submitted_at: mSub,
      materialization_succeeded_at: ok ? at(-ageDays * DAY - HOUR) : null,
      materialization_failed_at: ok ? null : at(-ageDays * DAY - HOUR),
      consistency_submitted_at: status.startsWith("consistency") ? at(-ageDays * DAY - 50 * 60_000) : null,
      consistency_succeeded_at: status === "consistency_succeeded" ? at(-ageDays * DAY - 40 * 60_000) : null,
      consistency_failed_at: status === "consistency_failed" ? at(-ageDays * DAY - 40 * 60_000) : null,
      created_at: mSub,
      updated_at: at(-ageDays * DAY - 30 * 60_000),
    }
  })
})

// ─── FeatureViewEvent ──────────────────────────────────────────────────────────────
export const featureViewEvents: S["FeatureViewEvent"][] = featureViews.flatMap((s, si) => {
  const r = rng(500 + si)
  const kinds: S["FeatureViewEventKindEnum"][] =
    s.producer === "batch" ? ["ingestion", "validation", "profiling"] : ["validation", "profiling"]
  return kinds.map((kind, k) => {
    const id = 70_000 + si * 10 + k
    const status = pick(r, ["succeeded", "succeeded", "succeeded", "failed", "submitted"] as S["EventStatusEnum"][])
    const sub = at(-(si % 7) * DAY - k * HOUR)
    return {
      feature_view_event_id: id,
      feature_view_name: s.feature_view_name,
      event_kind: kind,
      status,
      actor: k === 0 ? "scheduler" : "console-operator",
      submitted_at: sub,
      succeeded_at: status === "succeeded" ? at(-(si % 7) * DAY - k * HOUR + 11 * 60_000) : null,
      failed_at: status === "failed" ? at(-(si % 7) * DAY - k * HOUR + 4 * 60_000) : null,
      created_at: sub,
      updated_at: at(-(si % 7) * DAY - k * HOUR + 12 * 60_000),
    }
  })
})

// ─── StoreEvent ───────────────────────────────────────────────────────────────
export const storeEvents: S["StoreEvent"][] = stores.flatMap((st, si) =>
  entities.slice(0, 3).map((e, k) => {
    const id = 60_000 + si * 10 + k
    const status: S["EventStatusEnum"] = k === 2 ? "submitted" : "succeeded"
    const sub = at(-(si + k) * DAY - 3 * HOUR)
    return {
      store_event_id: id,
      event_kind: "store_profiling" as S["StoreEventKindEnum"],
      store_name: st.store_name,
      store_kind: st.store_kind,
      entity_name: e.entity_name,
      status,
      actor: "scheduler",
      submitted_at: sub,
      succeeded_at: status === "succeeded" ? at(-(si + k) * DAY - 2 * HOUR) : null,
      failed_at: null,
      created_at: sub,
      updated_at: at(-(si + k) * DAY - 2 * HOUR),
    }
  }),
)

// ─── Execution ────────────────────────────────────────────────────────────────
export const executions: S["Execution"][] = [
  ...partitionEvents.slice(0, 40).map((pe, i) => ({
    execution_id: 800_000 + i,
    event_kind: (pe.status.startsWith("consistency") ? "consistency" : "materialization") as S["EventKindEnum"],
    feature_view_name: pe.feature_view_name,
    partition_event_id: pe.partition_event_id,
    feature_view_event_id: null,
    store_event_id: null,
    created_at: pe.created_at,
    updated_at: pe.updated_at,
    spark_started_at: pe.materialization_submitted_at,
    spark_succeeded_at: pe.materialization_succeeded_at,
    spark_failed_at: pe.materialization_failed_at,
    yarn_application_id: `application_1755${String(100000 + i).slice(0, 6)}_${String(4000 + i)}`,
  })),
  ...featureViewEvents.slice(0, 30).map((se, i) => ({
    execution_id: 900_000 + i,
    event_kind: se.event_kind as S["EventKindEnum"],
    feature_view_name: se.feature_view_name,
    partition_event_id: null,
    feature_view_event_id: se.feature_view_event_id,
    store_event_id: null,
    created_at: se.created_at,
    updated_at: se.updated_at,
    spark_started_at: se.submitted_at,
    spark_succeeded_at: se.succeeded_at ?? null,
    spark_failed_at: se.failed_at ?? null,
    yarn_application_id: `application_1755${String(200000 + i).slice(0, 6)}_${String(5000 + i)}`,
  })),
]

// ─── Schedules ────────────────────────────────────────────────────────────────
export const featureViewSchedules: S["FeatureViewSchedule"][] = featureViews
  .filter((s) => s.producer === "batch")
  .flatMap((s, i) => {
    const seed = seedOf(s.feature_view_name)
    const hourly = (seed.periodSec ?? 86400) <= 3600
    return [
      {
        schedule_id: 10_000 + i * 2,
        feature_view_name: s.feature_view_name,
        event_kind: "ingestion" as S["SchedulableFeatureViewEventKindEnum"],
        cron_expression: hourly ? "5 * * * *" : "20 3 * * *",
        schedule_enabled: s.lifecycle_status === "active",
        created_at: s.created_at,
        updated_at: s.updated_at,
      },
      {
        schedule_id: 10_001 + i * 2,
        feature_view_name: s.feature_view_name,
        event_kind: "profiling" as S["SchedulableFeatureViewEventKindEnum"],
        cron_expression: "40 4 * * 1",
        schedule_enabled: i % 3 !== 0,
        created_at: s.created_at,
        updated_at: s.updated_at,
      },
    ]
  })

export const storeEventSchedules: S["StoreEventSchedule"][] = stores.map((st, i) => ({
  schedule_id: 20_000 + i,
  store_name: st.store_name,
  store_kind: st.store_kind,
  entity_name: entities[i % entities.length].entity_name,
  event_kind: "store_profiling" as S["SchedulableStoreEventKindEnum"],
  cron_expression: "0 5 * * *",
  schedule_enabled: i !== 2,
  created_at: st.created_at,
  updated_at: st.updated_at,
}))

// ─── OperationPolicy ──────────────────────────────────────────────────────────
export const operationPolicy: S["OperationPolicy"] = {
  id: 1,
  validation_sample_row_limit: 100_000,
  materialization_sample_row_limit: null,
  materialization_kafka_produce_partitions: 64,
  materialization_kafka_produce_batch_size: 5_000,
  consistency_sample_row_limit: 50_000,
  consistency_sample_fraction: 0.01,
  consistency_redis_probe_partitions: 32,
  consistency_redis_probe_chunk_size: 500,
  store_profiling_sample_row_limit: 200_000,
  store_profiling_sample_fraction: 0.05,
  store_profiling_redis_probe_partitions: 32,
  store_profiling_redis_probe_chunk_size: 500,
  retirement_scan_rate_limit: 2_000,
  created_at: at(-200 * DAY),
  updated_at: at(-6 * DAY),
}
