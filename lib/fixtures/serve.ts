// 정적 데모의 데이터 평면.
//
// 설계 판단: 도메인 모듈(lib/meta-client/*.ts)과 페이지를 하나도 고치지 않는다.
// openapi-fetch의 `fetch` 옵션에 이 핸들러를 꽂으면 경로·쿼리·응답 타입은 생성된 계약
// 타입이 그대로 강제하고, 바뀌는 것은 "누가 응답하는가" 하나다. 픽스처를 도메인 모듈
// 안으로 끌어들이면 계약이 사라지고 화면이 임의 객체를 믿게 된다.
import type { components } from "@/lib/meta-client/schema"
import * as fx from "./dataset"

type S = components["schemas"]

// ─── 응답 헬퍼 ────────────────────────────────────────────────────────────────
const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  })

const notFound = (path: string): Response =>
  json({ code: "not-found", message: `no such resource: ${path}`, request_id: "demo" }, 404)

// ─── 목록 필터·페이지네이션 ───────────────────────────────────────────────────
// 계약의 목록 필터는 대부분 배열 파라미터(`?producer=batch&producer=stream`)이고, 나머지는
// 부분 문자열 검색과 날짜 구간이다. 키가 행의 필드와 같으면 그대로 대조하므로 필터가
// 늘어나도 여기를 고칠 일이 없다.
const NON_FILTER = new Set(["limit", "offset", "sort", "order"])

function matches(row: Record<string, unknown>, sp: URLSearchParams): boolean {
  for (const key of new Set(sp.keys())) {
    if (NON_FILTER.has(key)) continue
    const values = sp.getAll(key)

    // created_from / updated_to → 대응 타임스탬프의 구간.
    // 문자열 비교는 쓰지 않는다 — 경계값은 KST 오프셋(+09:00)으로 오고 행은 UTC(Z)라
    // 사전순으로 비교하면 같은 시각도 다르게 갈린다. 파싱해서 시각으로 견준다.
    const range = /^(.*)_(from|to)$/.exec(key)
    if (range) {
      const ts = row[`${range[1]}_at`]
      if (typeof ts !== "string") continue
      const rowMs = Date.parse(ts)
      const boundMs = Date.parse(values[0])
      if (Number.isNaN(rowMs) || Number.isNaN(boundMs)) continue
      if (range[2] === "from" && rowMs < boundMs) return false
      if (range[2] === "to" && rowMs > boundMs) return false
      continue
    }

    if (!(key in row)) continue
    const cell = row[key]

    // 이름 검색은 부분 일치다 — 목록 화면의 검색창이 그렇게 동작한다.
    if ((key === "feature_view_name" || key === "store_name" || key === "entity_name") && values.length === 1) {
      if (typeof cell === "string" && !cell.includes(values[0])) return false
      continue
    }
    if (typeof cell === "boolean") {
      if (values[0] !== String(cell)) return false
      continue
    }
    if (!values.includes(String(cell))) return false
  }
  return true
}

function page<T extends Record<string, unknown>>(rows: readonly T[], sp: URLSearchParams) {
  const filtered = rows.filter((r) => matches(r, sp))
  const limit = Number(sp.get("limit") ?? 20)
  const offset = Number(sp.get("offset") ?? 0)
  return {
    items: filtered.slice(offset, offset + limit),
    pagination: { limit, offset, total: filtered.length },
  }
}

// ─── 파생 데이터 ──────────────────────────────────────────────────────────────
// 프로파일과 실행 결과는 카탈로그 행이 아니라 런이 관측한 통계다. 데이터셋에 손으로
// 적어두면 파티션이 늘 때마다 어긋나므로, 대상 행에서 결정적으로 파생시킨다.
const stat = (seed: number, n: number) => ((seed * 2654435761) % n + n) % n

const FIELD_PATHS = ["$", "$.score", "$.items", "$.updated_at"]

export const featureViewProfiles: S["FeatureViewProfile"][] = fx.partitionEvents
  .filter((pe) => pe.status === "consistency_succeeded")
  .flatMap((pe, i) =>
    FIELD_PATHS.slice(0, 1 + (i % 3)).map((fp, k) => {
      const rows = 1_000_000 + stat(pe.partition_event_id + k, 40_000_000)
      return {
        field_path: fp,
        feature_view_name: pe.feature_view_name,
        partition: pe.partition,
        field_type: k === 0 ? "string" : "double",
        row_count: rows,
        null_count: stat(pe.partition_event_id + k + 1, Math.floor(rows / 50)),
        distinct_count: Math.floor(rows * 0.87),
        empty_count: stat(pe.partition_event_id + k + 2, 400),
        length_min: 1,
        length_p50: 12,
        length_p95: 48,
        length_max: 256,
        length_mean: 14.62,
        length_stddev: 9.31,
      } as S["FeatureViewProfile"]
    }),
  )

export const storeProfiles: S["StoreProfile"][] = fx.storeEvents
  .filter((se) => se.status === "succeeded")
  .flatMap((se, i) =>
    fx.featureViews.slice(0, 3 + (i % 3)).map((src, k) => {
      const requested = 200_000 + stat(se.store_event_id + k, 300_000)
      return {
        store_event_id: se.store_event_id,
        store_name: se.store_name,
        store_kind: se.store_kind,
        entity_name: se.entity_name,
        field_name: src.feature_name,
        field_path: "$",
        keys_requested: requested,
        keys_with_field: Math.floor(requested * (0.55 + (k % 5) * 0.08)),
        field_type: "string",
        row_count: requested,
        null_count: stat(se.store_event_id + k + 3, 2_000),
        distinct_count: Math.floor(requested * 0.72),
        empty_count: stat(se.store_event_id + k + 5, 300),
        length_min: 1,
        length_p50: 9,
        length_p95: 41,
        length_max: 512,
        length_mean: 11.08,
        length_stddev: 7.44,
      } as S["StoreProfile"]
    }),
  )

function materializationResult(pe: S["PartitionEvent"]): S["PartitionMaterializationResult"] {
  const submitted = 2_000_000 + stat(pe.partition_event_id, 30_000_000)
  const isDiff = pe.partition_event_id % 3 !== 0
  return {
    partition_event_id: pe.partition_event_id,
    feature_view_name: pe.feature_view_name,
    partition: pe.partition,
    baseline_partition_event_id: isDiff ? pe.partition_event_id - 100 : null,
    mode: isDiff ? "diff" : "dump",
    baseline_row_count: isDiff ? submitted - stat(pe.partition_event_id, 90_000) : null,
    submitted_row_count: submitted,
    updated_count: isDiff ? stat(pe.partition_event_id, 90_000) : submitted,
    submitted_partition_location: `hdfs://hadoop-primary/fs_catalog/${pe.feature_view_name}/dt=${pe.partition.dt}`,
    submitted_directory_mtime: pe.materialization_submitted_at,
    submitted_data_file_count: 24 + stat(pe.partition_event_id, 200),
    submitted_total_file_bytes: 400_000_000 + stat(pe.partition_event_id, 900_000_000),
    submitted_latest_file_mtime: pe.materialization_submitted_at,
  } as S["PartitionMaterializationResult"]
}

function consistencyResult(pe: S["PartitionEvent"]): S["PartitionConsistencyResult"] {
  const checked = 20_000 + stat(pe.partition_event_id, 40_000)
  const matched = Math.floor(checked * (0.981 + (pe.partition_event_id % 17) / 1000))
  return {
    partition_event_id: pe.partition_event_id,
    feature_view_name: pe.feature_view_name,
    partition: pe.partition,
    score: Number((matched / checked).toFixed(4)),
    checked_count: checked,
    matched_count: matched,
    observed_partition_location: `hdfs://hadoop-primary/fs_catalog/${pe.feature_view_name}/dt=${pe.partition.dt}`,
    observed_directory_mtime: pe.consistency_submitted_at,
    observed_data_file_count: 24 + stat(pe.partition_event_id, 200),
    observed_total_file_bytes: 400_000_000 + stat(pe.partition_event_id, 900_000_000),
    observed_latest_file_mtime: pe.consistency_submitted_at,
    created_at: pe.updated_at,
  } as S["PartitionConsistencyResult"]
}

// 상태머신이 답하는 것: 이 피처 뷰에게 지금 무엇을 요청할 수 있는가.
// 데모는 읽기 전용이라 버튼이 뜨지 않지만, 상태별로 가능한 것이 다르다는 사실 자체가
// 화면에 남아야 해서 그대로 파생시킨다.
function sourceActions(src: S["FeatureView"]): S["FeatureViewActions"] {
  const st = src.lifecycle_status
  const lifecycle =
    st === "draft"
      ? ["active", "retired"]
      : st === "active"
        ? ["suspended", "retired"]
        : st === "suspended"
          ? ["active", "retired"]
          : st === "retired"
            ? src.producer === "stream"
              ? ["active"]
              : ["draft"]
            : st === "validation_failed"
              ? ["draft", "retired"]
              : ["retired"]
  const runnable = st === "active"
  return {
    feature_view_name: src.feature_view_name,
    producer: src.producer,
    lifecycle_status: st,
    shape_editable: st === "draft" || st === "suspended" || st === "validation_failed",
    actions: {
      lifecycle,
      feature_view_events: runnable && src.producer === "batch" ? ["ingestion", "profiling"] : runnable ? ["profiling"] : [],
      partition: runnable && src.producer !== "stream" ? ["submit"] : [],
    },
  } as S["FeatureViewActions"]
}

// ─── 라우팅 ───────────────────────────────────────────────────────────────────
type Params = Record<string, string>
type Handler = (p: Params, sp: URLSearchParams) => unknown | undefined

const ROUTES: [string, Handler][] = [
  // Catalog
  ["/v1/admin/entities", (_p, sp) => page(fx.entities, sp)],
  ["/v1/admin/entities/{entity_name}", (p) => fx.entities.find((e) => e.entity_name === p.entity_name)],
  ["/v1/admin/online-stores", (_p, sp) => page(fx.stores, sp)],
  [
    "/v1/admin/online-stores/{store_name}/{store_kind}",
    (p) => fx.stores.find((s) => s.store_name === p.store_name && s.store_kind === p.store_kind),
  ],
  ["/v1/admin/feature-views", (_p, sp) => page(fx.featureViews, sp)],
  ["/v1/admin/feature-views/{feature_view_name}", (p) => fx.featureViews.find((s) => s.feature_view_name === p.feature_view_name)],
  [
    "/v1/admin/batch-sources/{feature_view_name}",
    (p) => fx.batchSources.find((l) => l.feature_view_name === p.feature_view_name),
  ],
  ["/v1/admin/feature-view-stores", (_p, sp) => page(fx.featureViewStores, sp)],
  [
    "/v1/admin/feature-view-stores/{feature_view_name}/{store_kind}",
    (p) => fx.featureViewStores.find((r) => r.feature_view_name === p.feature_view_name && r.store_kind === p.store_kind),
  ],

  // Specs
  ["/v1/admin/ingestion-specs", (_p, sp) => page(fx.ingestionSpecs, sp)],
  [
    "/v1/admin/ingestion-specs/{feature_view_name}",
    (p) => fx.ingestionSpecs.find((s) => s.feature_view_name === p.feature_view_name),
  ],
  ["/v1/admin/stream-sources", (_p, sp) => page(fx.streamSpecs, sp)],
  [
    "/v1/admin/stream-sources/{feature_view_name}",
    (p) => fx.streamSpecs.find((s) => s.feature_view_name === p.feature_view_name),
  ],

  // Events
  ["/v1/admin/feature-view-events", (_p, sp) => page(fx.featureViewEvents, sp)],
  [
    "/v1/admin/feature-view-events/{feature_view_event_id}",
    (p) => fx.featureViewEvents.find((e) => String(e.feature_view_event_id) === p.feature_view_event_id),
  ],
  ["/v1/admin/online-store-events", (_p, sp) => page(fx.storeEvents, sp)],
  [
    "/v1/admin/online-store-events/{store_event_id}",
    (p) => fx.storeEvents.find((e) => String(e.store_event_id) === p.store_event_id),
  ],
  ["/v1/admin/partition-events", (_p, sp) => page(fx.partitionEvents, sp)],
  [
    "/v1/admin/partition-events/{partition_event_id}",
    (p) => fx.partitionEvents.find((e) => String(e.partition_event_id) === p.partition_event_id),
  ],
  [
    "/v1/admin/partition-materialization-results/{partition_event_id}",
    (p) => {
      const pe = fx.partitionEvents.find((e) => String(e.partition_event_id) === p.partition_event_id)
      return pe && pe.materialization_succeeded_at ? materializationResult(pe) : undefined
    },
  ],
  [
    "/v1/admin/partition-consistency-results/{partition_event_id}",
    (p) => {
      const pe = fx.partitionEvents.find((e) => String(e.partition_event_id) === p.partition_event_id)
      return pe && pe.consistency_succeeded_at ? consistencyResult(pe) : undefined
    },
  ],
  ["/v1/admin/executions", (_p, sp) => page(fx.executions, sp)],

  // Statistics
  ["/v1/admin/feature-view-profiles", (_p, sp) => page(featureViewProfiles as unknown as Record<string, unknown>[], sp)],
  [
    // 좌표 쿼리(hr/min/segment)는 정적 export에서 빌드 시점에 비어 있다. 데모는
    // 자연키의 앞 세 조각으로만 찾는다 — 링크가 죽는 것보다 낫다.
    "/v1/admin/feature-view-profiles/{feature_view_name}/partitions/{dt}/fields/{field_path}",
    (p) =>
      featureViewProfiles.find(
        (sp2) =>
          sp2.feature_view_name === p.feature_view_name &&
          sp2.partition.dt === p.dt &&
          sp2.field_path === p.field_path,
      ),
  ],
  ["/v1/admin/online-store-profiles", (_p, sp) => page(storeProfiles as unknown as Record<string, unknown>[], sp)],
  [
    "/v1/admin/online-store-profiles/{store_event_id}/fields/{field_name}",
    (p) =>
      storeProfiles.find(
        (sp2) => String(sp2.store_event_id) === p.store_event_id && sp2.field_name === p.field_name,
      ),
  ],

  // Operations
  ["/v1/admin/feature-view-schedules", (_p, sp) => page(fx.featureViewSchedules, sp)],
  [
    "/v1/admin/feature-view-schedules/{schedule_id}",
    (p) => fx.featureViewSchedules.find((s) => String(s.schedule_id) === p.schedule_id),
  ],
  ["/v1/admin/online-store-schedules", (_p, sp) => page(fx.storeEventSchedules, sp)],
  [
    "/v1/admin/online-store-schedules/{schedule_id}",
    (p) => fx.storeEventSchedules.find((s) => String(s.schedule_id) === p.schedule_id),
  ],
  ["/v1/admin/operation-policy/{id}", () => fx.operationPolicy],

  // Client workflow (읽기만 — 오퍼 조회)
  [
    "/v1/client/feature-view-actions/{feature_view_name}",
    (p) => {
      const src = fx.featureViews.find((s) => s.feature_view_name === p.feature_view_name)
      return src ? sourceActions(src) : undefined
    },
  ],
]

const COMPILED = ROUTES.map(([tpl, handler]) => {
  const names: string[] = []
  const pattern = tpl.replace(/\{(\w+)\}/g, (_m, n: string) => {
    names.push(n)
    return "([^/]+)"
  })
  return { re: new RegExp(`^${pattern}$`), names, handler }
})

// ─── fetch 심 ─────────────────────────────────────────────────────────────────
export async function fixtureFetch(input: Request | URL | string, init?: RequestInit): Promise<Response> {
  const raw = input instanceof Request ? input.url : String(input)
  const method = (input instanceof Request ? input.method : init?.method) ?? "GET"
  const url = new URL(raw, "http://demo.local")

  // 쓰기 평면은 데모에 없다. 조용히 성공시키면 화면이 반영되지 않은 변경을 반영된 것으로
  // 보여주므로 명확히 거절한다.
  if (method !== "GET") {
    return json(
      { code: "read-only", message: "정적 데모입니다. 쓰기 평면은 제공되지 않습니다.", request_id: "demo" },
      405,
    )
  }

  const decoded = decodeURIComponent(url.pathname)
  for (const { re, names, handler } of COMPILED) {
    const m = re.exec(decoded)
    if (!m) continue
    const params: Params = {}
    names.forEach((n, i) => (params[n] = decodeURIComponent(m[i + 1])))
    const body = handler(params, url.searchParams)
    return body === undefined ? notFound(decoded) : json(body)
  }
  return notFound(decoded)
}
