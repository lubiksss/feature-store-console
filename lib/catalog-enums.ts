import {
  WavesIcon,
  GlobeIcon,
  FileIcon,
  FileTextIcon,
  DatabaseIcon,
  HardDriveIcon,
  ServerIcon,
  FileStackIcon,
  BracesIcon,
  DatabaseBackupIcon,
  HardDriveDownloadIcon,
  BracketsIcon,
  HashIcon,
  FilterIcon,
  CircleDashedIcon,
  CheckCircle2Icon,
  XCircleIcon,
  ArchiveIcon,
  PauseCircleIcon,
  CircleIcon,
  ArrowUpCircleIcon,
  GitCompareIcon,
  ShieldIcon,
  ShieldCheckIcon,
  ShieldXIcon,
  ChartColumnIcon,
  BadgeCheckIcon,
  HardDriveUploadIcon,
  TypeIcon,
  LayersIcon,
  ToggleLeftIcon,
  CalendarIcon,
  type LucideIcon,
} from "lucide-react"
// 타입만 가져온다 — schema.ts 는 생성된 타입 파일이고 런타임 코드가 없으므로 client 번들에
// 아무것도 싣지 않는다(meta-client 배럴은 server-only 다).
import type { components } from "@/lib/meta-client/schema"

// enum option SSOT. 값 공간은 서버 계약에서 온다 — 아래 어휘들은
// OpenAPI 스펙의 enum 을 타입 인자로 받으므로, 서버가 값을 더하거나
// 이름을 바꾸면 화면 문구가 조용히 낡는 대신 여기서 컴파일이 깨진다.
// tone: status-token color classes for stateful enums; omitted for neutral segment enums.
export interface EnumOption<V extends string = string> {
  value: V
  icon: LucideIcon
  tone?: string
  // 콜백이 오기 전까지 "실행 중"인 상태 (submitted 계열). 뱃지에 진행 중 신호(LiveDot)를
  // 덧붙인다 — 정적 뱃지로는 멈춘 상태와 구분되지 않는다.
  running?: boolean
}

type Schemas = components["schemas"]
type Presentation<V extends string> = Omit<EnumOption<V>, "value">

// 계약 enum 의 모든 값을 정확히 한 번 요구한다: 키가 곧 값이고 mapped type 이라 빠뜨리면
// "missing property", 없는 값을 적으면 "unknown property" 다. 표시 순서는 이 객체의 키 순서다.
function vocabulary<V extends string>(entries: { [K in V]: Presentation<K> }): EnumOption<V>[] {
  return (Object.keys(entries) as V[]).map((value) => ({
    value,
    ...entries[value],
  }))
}

// 계약 enum 의 일부만 화면에 내놓는 어휘. 값이 계약 안에 있는지는 검사하지만 전수는 요구하지
// 않는다 — 의도적인 부분집합에만 쓰고, 왜 일부인지 그 자리에 적는다.
function partialVocabulary<V extends string>(entries: Partial<{ [K in V]: Presentation<K> }>) {
  return (Object.keys(entries) as V[]).map((value) => ({
    value,
    ...(entries[value] as Presentation<V>),
  }))
}

// StoreEventKindEnum — a store work-event kind. Only store_profiling today.
export const STORE_EVENT_KIND_OPTIONS = vocabulary<Schemas["StoreEventKindEnum"]>({
  store_profiling: { icon: ChartColumnIcon },
})

// StoreKindEnum — which serving store a run probed. Both are declared because the sinker
// writes both, so a run against each is what makes their disagreement readable; two icons
// so a table of runs shows at a glance which store a row is about.
// store_kind 도 닫힌 enum 이 아니다 — 어휘는 fs_store 의 행이다. 여기 있는 것은 우리가
// 아이콘을 그려둔 종류들의 사전이고, 없는 종류도 뱃지는 값 그대로 렌더된다.
export const STORE_KIND_OPTIONS = partialVocabulary<string>({
  cluster: { icon: DatabaseIcon },
  kvcache: { icon: HardDriveIcon },
})

export const PRODUCER_OPTIONS = vocabulary<Schemas["ProducerEnum"]>({
  batch: { icon: FileStackIcon },
  stream: { icon: WavesIcon },
  external: { icon: GlobeIcon },
})

export const SOURCE_FORMAT_OPTIONS = vocabulary<Schemas["SourceFormatEnum"]>({
  parquet: { icon: FileIcon },
  text: { icon: FileTextIcon },
  json: { icon: BracesIcon },
})

export const HDFS_FORMAT_OPTIONS = vocabulary<Schemas["HDFSFormatEnum"]>({
  parquet: { icon: FileIcon },
  json: { icon: BracesIcon },
})

// physical hadoop clusters feature data can live on. Catalog/informational (no job
// consumes it), nullable, admin editable at create and via patch.
export const HADOOP_CLUSTER_OPTIONS = vocabulary<Schemas["HadoopClusterEnum"]>({
  "hadoop-secondary": { icon: ServerIcon },
  "hadoop-primary": { icon: ServerIcon },
})

// URL SSOT for the hadoop cluster console. It lives here — beside the enum it derives from and
// outside any "use client" module — because server components (detail field tables) call it to
// hand EnumBadges a plain href string; a function exported from a client module can't be
// invoked from the server.
export function hadoopClusterHref(cluster: string) {
  return `https://bigdata.example.net/usages/${encodeURIComponent(cluster)}?tab=info`
}

// Feature data lives on whichever cluster its location names, so every console link derived
// from a path/table/appId has to follow it. The column is nullable and every pre-secondary featureView
// leaves it unset, so `undefined` resolves to hadoop-primary — the same normalization
// 서버 applies when launching a job, which keeps existing links byte-identical.
export const DEFAULT_HADOOP_CLUSTER = "hadoop-primary"

// Hue base per cluster. The Hue host IS the cluster name, so this derives instead of mapping
// (the backend leans on the same property for `<cluster>-env-start`) — there is no table to
// drift out of sync when a cluster is added.
export function hueHref(cluster: string | undefined) {
  return `https://${cluster ?? DEFAULT_HADOOP_CLUSTER}.example.net/hue`
}

// YARN RM web endpoint per cluster. Unlike Hue this can NOT be derived: primary exposes an HA
// exposes a single load-balanced router on :8088. Values are the client conf's
// yarn.resourcemanager.webapp.address.*, not a host observed in one job's tracking URL.
const YARN_RM_WEB: Record<string, string> = {
  "hadoop-primary": "http://hadoop-primary-rm.example.net:8088",
  "hadoop-secondary": "http://hadoop-secondary-yarn-gateway.example.net:8088",
}

// The RM proxy serves the live Spark UI while RUNNING and 302s to the history server's real
// attempt once FINISHED. Returns null for a cluster we have no RM for, so the caller renders
// plain text rather than a link that 404s.
export function yarnProxyHref(cluster: string | undefined, applicationId: string) {
  const rm = YARN_RM_WEB[cluster ?? DEFAULT_HADOOP_CLUSTER]
  return rm ? `${rm}/proxy/${applicationId}/` : null
}

// profiled field type (fs_feature_view_profile.field_type): 재귀 프로파일러가 관측한
// Spark simpleString이라 값 공간이 무한하다 (array<T>, map<K,V>, decimal(p,s), struct<…>).
// exact 목록 대신 구조로 아이콘을 고르고, 모르는 타입은 undefined → 아이콘 없는 뱃지로 폴백.
const NUMERIC_FIELD_TYPES = new Set(["tinyint", "smallint", "int", "bigint", "float", "double"])

function fieldTypeIcon(v: string): LucideIcon | undefined {
  if (v.startsWith("array<")) return BracketsIcon
  if (v.startsWith("map<")) return BracesIcon
  if (v.startsWith("struct<")) return LayersIcon
  if (v === "string") return TypeIcon
  if (NUMERIC_FIELD_TYPES.has(v) || v.startsWith("decimal")) return HashIcon
  if (v === "boolean") return ToggleLeftIcon
  if (v === "date" || v.startsWith("timestamp")) return CalendarIcon
  return undefined
}

export function fieldTypeOption(value: string): EnumOption | undefined {
  const icon = fieldTypeIcon(value.trim().toLowerCase())
  return icon ? { value, icon } : undefined
}

// FeatureView location key/value data_type (설계 결정): declared Spark SQL simpleString
// the validation gate compares against the real Hive schema. key is a single scalar
// (string); value is an allowlist of 20 simpleString shapes. Icons reuse fieldTypeIcon.
export const KEY_DATA_TYPE_OPTIONS = vocabulary<Schemas["KeyDataTypeEnum"]>({
  string: { icon: TypeIcon },
})

// shape 계열(primitive / array / map / 중첩)별로 나눠 선언한다. 20개를 한 줄로 흘리면 어휘가
// 벽으로 보이므로 뷰는 계열 사이에서만 줄을 끊는데, 그 경계가 데이터에 있어야 화면이 값 문자열을
// 파싱해 계열을 추측하지 않는다. 평면 목록은 이 그룹에서 파생하므로 순서와 그룹이 어긋날 수 없다.
// 값은 계약의 ValueDataTypeEnum 이라 이름이 바뀌면 여기가 깨진다. 다만 다른 어휘들과 달리
// 전수 게이트는 없다(그룹 구조 때문에 mapped type 을 쓸 수 없다) — 계약에 값이 새로 생기면
// 서버는 받아주지만 이 목록에 넣기 전까지 화면 선택지에 뜨지 않는다.
const VALUE_DATA_TYPE_GROUP_VALUES: Schemas["ValueDataTypeEnum"][][] = [
  ["string", "boolean", "int", "bigint", "float", "double"],
  [
    "array<string>",
    "array<boolean>",
    "array<int>",
    "array<bigint>",
    "array<float>",
    "array<double>",
  ],
  [
    "map<string,string>",
    "map<string,boolean>",
    "map<string,int>",
    "map<string,bigint>",
    "map<string,float>",
    "map<string,double>",
  ],
  [
    "array<map<string,string>>",
    "array<struct<backGroundColor:string,creativeId:bigint,imageUrl:string>>",
  ],
]

type ValueDataType = Schemas["ValueDataTypeEnum"]

const toDataTypeOption = (v: ValueDataType): EnumOption<ValueDataType> => ({
  value: v,
  icon: fieldTypeOption(v)?.icon ?? BracesIcon,
})

const VALUE_DATA_TYPE_GROUPS: EnumOption<ValueDataType>[][] = VALUE_DATA_TYPE_GROUP_VALUES.map(
  (g) => g.map(toDataTypeOption),
)

export const VALUE_DATA_TYPE_OPTIONS: EnumOption<ValueDataType>[] = VALUE_DATA_TYPE_GROUPS.flat()

// 배지 스트립의 줄바꿈 자리를 어휘에 붙여 등록한다. 호출부(상세 카드 / 폼)가 각자 그룹을 넘기면
// 한쪽만 고쳐져 뷰와 폼이 갈라지므로, 목록 자체를 키로 조회하게 둔다. 등록되지 않은 어휘는
// undefined → 한 줄로 흐르는 기존 동작 그대로.
const OPTION_GROUPS = new Map<readonly EnumOption[], readonly EnumOption[][]>([
  [VALUE_DATA_TYPE_OPTIONS, VALUE_DATA_TYPE_GROUPS],
])

export function optionGroups<V extends string>(
  options: readonly EnumOption<V>[],
): readonly EnumOption<V>[][] | undefined {
  return OPTION_GROUPS.get(options) as readonly EnumOption<V>[][] | undefined
}

// ── info tooltip 문구 규약 ─────────────────────────────────────────────────────
// 라벨 옆 ⓘ 로 노출되는 문구는 톤을 맞춘다. 규칙:
//   1. 최대 2문장. 첫 문장 = 이 필드가 무엇인지, 둘째 = 시스템이 그것을 어떻게 쓰는지 또는
//      제약. 둘째에 더할 사실이 없으면 한 문장에서 끝낸다 — 채우려고 같은 말을 되풀이하면
//      읽는 비용만 늘고 아무것도 알려주지 않는다.
//   2. 문장당 40자 안팎. tooltip은 읽는 데 드는 비용이 낮아야 한다.
//   3. 주체는 실제 구성요소 이름으로 (검증 게이트 / 파이프라인 / 서버). "시스템 로직" 같은
//      막연한 주어를 쓰지 않는다.
//   4. 마크업 기호(백틱, ↔) 금지 — plain text로 렌더되므로 기호가 그대로 노출된다.
//   5. 영어는 식별자(simpleString, entity_name, external)에만. 설명어는 한국어로.
export const KEY_DATA_TYPE_INFO =
  "Redis key의 선언 타입입니다. 검증 게이트가 실제 Hive 스키마와 대조합니다."
export const VALUE_DATA_TYPE_INFO =
  "Redis value의 선언 타입입니다. 검증 게이트가 Hive 스키마와 대조해 다르면 거절합니다."
// 서버가 준 이름들로 칩 선택지를 만든다. 남은 사용처는 온라인 스토어 종류 하나다 — 종류는 계약의
// 닫힌 집합이라 칩이 정직하고, 아이콘 사전에 있으면 쓰고 없으면 중립 아이콘을 준다.
//
// entity_name 은 이 헬퍼를 쓰지 않는다. 대상은 fs_entity 의 행이고 언제든 늘어나므로
// 고르는 자리는 selectField 드롭다운이고 읽는 자리는 일반 텍스트다 — 칩으로 보이면 어휘가
// 고정이라는 뜻이 되고, 그것이 이 개편이 없앤 것이다.
export function vocabularyOptions(names: readonly string[]): EnumOption[] {
  return names.map((value) => ({
    value,
    // 폴백은 온라인 스토어 아이콘이다 — 이 헬퍼가 만드는 것은 온라인 스토어 종류의 선택지뿐이므로,
    // 사전에 없는 종류도 "온라인 스토어의 무엇"으로 읽히는 것이 맞다.
    icon: STORE_KIND_OPTIONS.find((o) => o.value === value)?.icon ?? DatabaseIcon,
  }))
}

export const STORE_KIND_INFO =
  "이 스토어를 무엇으로 다룰지 말하는 이름입니다. 이름과 함께 온라인 스토어의 정체성을 이루므로 만든 뒤에는 바꿀 수 없습니다."
export const STORE_ENDPOINT_INFO =
  "meta 가 이 온라인 스토어의 주소를 알아내는 출발점입니다. 스킴은 붙이지 않습니다 — 주소 레지스트리를 쓰는 종류는 host[:port]/경로, 그 외는 온라인 스토어 자신의 host:port 입니다."
export const STORE_PASSWORD_INFO =
  "런이 인증에 쓰는 자격증명입니다. 저장만 되고 어떤 읽기에도 실리지 않으므로, 이 칸은 비어 있는 것이 정상입니다."
export const STORE_WRITE_PATH_INFO =
  "값이 이 스토어로 들어가는 경로입니다. meta 는 스토어에 직접 쓰지 않고 이 토픽에 넣고, sinker 가 그것을 읽어 적재합니다."

export const ENTITY_NAME_INFO =
  "피처가 무엇을 기술하는지를 가리키는 이름입니다. 피처 뷰의 feature_view_name 절반이 이 이름이라 만든 뒤에는 바꿀 수 없습니다."
export const ENTITY_PREFIX_INFO =
  '이 대상이 소유하는 서빙 키 접두사입니다. 키는 prefix + ":" + 키값이고 그 키 하나가 그 대상 인스턴스 하나의 해시라, 두 대상이 접두사를 공유하면 해시가 섞입니다. 그래서 유일하고, 만든 뒤에는 바꿀 수 없습니다.'
export const ENTITY_KEY_SOURCE_INFO =
  "store profiling 이 이 대상의 키 목록을 읽어올 Hive 테이블입니다. 클러스터·테이블·키 컬럼 셋은 함께 있어야 하며, 비워두면 예약이나 트리거가 키 집합을 직접 넘겨야 합니다."

// ── operation policy 노브 ────────────────────────────────────────────────────
// 둘째 문장 규칙: 짝이 있으면 짝의 이름을 부르고 합성 규칙을 말한다(양쪽이 거울).
// 짝이 없으면 값을 바꿨을 때의 효과를 말한다.
//
// 표본 크기는 kind 를 가리지 않고 한 규칙이다 — sample_row_limit 이 있으면 그 개수,
// 없으면 sample_fraction 비율. 둘을 곱하지 않는다.
export const POLICY_INFO = {
  store_profiling_sample_row_limit:
    "스토어를 스캔할 키 개수를 고정합니다. 비우면 대신 sample_fraction 비율로 뽑습니다.",
  store_profiling_sample_fraction:
    "키 집합에서 뽑을 비율입니다. sample_row_limit이 있으면 그 개수가 대신 쓰입니다.",
  consistency_sample_row_limit:
    "정합성 검사가 읽을 행 수를 고정합니다. 비우면 대신 sample_fraction 비율로 뽑습니다.",
  consistency_sample_fraction:
    "Hive에서 뽑을 비율입니다. sample_row_limit이 있으면 그 개수가 대신 쓰입니다.",
  materialization_sample_row_limit:
    "적재가 읽을 행 수를 고정합니다. 비우면 파티션 전량을 적재합니다.",
  validation_sample_row_limit:
    "검증 게이트가 읽을 행 수를 고정합니다. 비우면 파티션 전량을 검사합니다.",

  store_profiling_redis_probe_partitions:
    "온라인 스토어 스캔을 나눠 도는 병렬도입니다. redis_probe_chunk_size와 곱한 값이 초당 조회 상한입니다.",
  store_profiling_redis_probe_chunk_size:
    "파티션 하나가 1초에 조회할 키 수입니다. redis_probe_partitions와 곱한 값이 초당 조회 상한입니다.",
  consistency_redis_probe_partitions:
    "정합성 검사의 Redis 조회 병렬도입니다. redis_probe_chunk_size와 곱한 값이 초당 조회 상한입니다.",
  consistency_redis_probe_chunk_size:
    "정합성 검사가 1초에 조회할 키 수입니다. redis_probe_partitions와 곱한 값이 초당 조회 상한입니다.",

  materialization_kafka_produce_partitions:
    "적재가 Kafka로 내보내는 병렬도입니다. batch_size와 곱한 값이 한 번에 나가는 레코드 수입니다.",
  materialization_kafka_produce_batch_size:
    "한 번에 묶어 보낼 레코드 수입니다. produce_partitions와 곱한 값이 한 번에 나갑니다.",

  retirement_scan_rate_limit:
    "폐기 작업이 Redis를 스캔하는 초당 키 수입니다. 낮출수록 스캔이 느려지고 서빙 지연이 줄어듭니다.",
} as const

// ── 프로파일 통계 ────────────────────────────────────────────────────────────
// 두 평면(피처 뷰 파티션 / 온라인 스토어)이 같은 통계를 같은 이름으로 내므로 문구도 하나다.
// 백분위는 면마다 한 칸(*_min)만 설명한다 — 같은 문장을 아홉 번 반복하면 읽히지 않는다.
export const PROFILE_INFO = {
  field_path:
    "통계를 잰 값의 부분입니다. 값 전체는 value, 배열 원소는 value.element, 맵은 value.key와 value.value입니다.",
  field_type: "관측된 값의 타입입니다. 선언이 아니라 읽은 값에서 추론한 타입입니다.",
  field_name:
    "스토어에서 관측된 해시 필드명입니다. 키 하나가 해시이고, 그 안의 필드 하나가 피처입니다.",
  keys_requested: "스토어에 조회한 키 수입니다. 이 행의 모든 수치가 그 표본 안에서 센 값입니다.",
  keys_with_field: "이 필드를 가진 키 수입니다. keys_requested와의 비가 이 필드의 커버리지입니다.",

  row_count:
    "센 행의 수입니다. value는 값 하나가 한 행이고, value.element는 원소 하나가 한 행입니다.",
  distinct_count: "서로 다른 값의 수입니다. 스칼라는 정확한 수이고 컬렉션은 근사치입니다.",
  empty_count: "길이나 크기가 0인 값의 수입니다. 값은 있으므로 null_count와 겹치지 않습니다.",
  null_count: "값이 없는(NULL) 행의 수입니다. empty_count와 달리 값 자체가 없습니다.",
  zeros_count: "값이 0인 행의 수입니다. 숫자 타입에만 셉니다.",
  length: "문자열의 글자 수 분포입니다.",
  size: "배열이나 맵의 원소 수 분포입니다.",
  numeric: "숫자 값 자체의 분포입니다.",
  top_values: "가장 자주 나온 값과 그 횟수입니다. 스칼라 타입에만 있습니다.",
} as const

export const PRODUCER_INFO =
  "피처 뷰를 채우는 파이프라인 종류입니다. batch와 stream은 시스템이 직접 채우고, 그 외에는 external입니다."

// 계약의 AggregationEnum 은 list/map/sum/count 넷인데 콘솔은 둘만 내놓는다 — stream 파이프라인이
// 실제로 구현한 것이 그 둘이다. 의도적 부분집합이라 전수 게이트를 쓰지 않는다.
export const AGGREGATION_OPTIONS = partialVocabulary<Schemas["AggregationEnum"]>({
  list: { icon: BracketsIcon },
  map: { icon: BracesIcon },
})

export const IDENTITY_FILTER_OPTIONS = vocabulary<Schemas["IdentityFilterEnum"]>({
  reaction: { icon: FilterIcon },
  conversion: { icon: FilterIcon },
})

// EventKindEnum — neutral segment: which work-event a run belongs to
// (ingestion→ingestion, materialization/consistency→partition, validation/retirement→featureView).
// fs_execution.event_kind is the DU discriminator.
export const EVENT_KIND_OPTIONS = vocabulary<Schemas["EventKindEnum"]>({
  ingestion: { icon: HardDriveDownloadIcon },
  store_profiling: { icon: DatabaseIcon },
  materialization: { icon: HardDriveUploadIcon },
  consistency: { icon: ShieldCheckIcon },
  validation: { icon: BadgeCheckIcon },
  retirement: { icon: ArchiveIcon },
  profiling: { icon: ChartColumnIcon },
})

// FeatureViewEventKindEnum — a featureView work-event kind (validation/retirement/profiling/ingestion).
// 설계 결정: ingestion folded into fs_feature_view_event.
export const SOURCE_EVENT_KIND_OPTIONS = vocabulary<Schemas["FeatureViewEventKindEnum"]>({
  validation: { icon: BadgeCheckIcon },
  retirement: { icon: ArchiveIcon },
  profiling: { icon: ChartColumnIcon },
  ingestion: { icon: HardDriveDownloadIcon },
})

// SchedulableEventKindEnum — run events a caller can ASK FOR, via event-triggers (manual) or
// event-schedules (cron). Excludes lifecycle (validation/retirement) and partition
// (materialization/consistency) kinds — those have their own surfaces.
//
// The VALUES are bound to the contract: vocabulary<>'s mapped type demands every enum member
// exactly once, so a server-side addition fails to compile until it is presented here. Only
// the presentation (icon, tone) is ours — and so is this constant's NAME, which is the part
// that drifted: it read TRIGGERABLE while being typed to the schedulable enum. That is a
// different set (AvailableActions.feature_view_events, no store_profiling — a store run is not an
// action on a featureView), and the name alone sent a screen to the wrong vocabulary.
// 피처 뷰가 지금 제안하는 작업(AvailableActions.feature_view_events). 스케줄 어휘와 값이 겹치지만 답하는
// 질문이 다르다 — 라이프사이클 표의 "이 상태에서 무엇을 띄울 수 있나"는 예약 목록으로 가는 링크가
// 아니다. 그래서 별도 어휘로 두고 링크를 붙이지 않는다.
export const SOURCE_OFFERABLE_EVENT_KIND_OPTIONS = vocabulary<
  Schemas["FeatureViewOfferableEventKindEnum"]
>({
  ingestion: { icon: HardDriveDownloadIcon },
  profiling: { icon: ChartColumnIcon },
})

// 스케줄 가능한 kind 가 평면별로 갈렸다. 합집합 하나를 두면 어느 평면의 폼에서도 상대 평면의
// kind 를 고를 수 있고, 그 거절이 서버에만 있게 된다 — 화면이 만들 수 없는 것을 제안하지 않게
// 나눈다. 트리거 표면은 엔드포인트가 하나이므로 거기서만 합집합이 필요하다.
export const SCHEDULABLE_SOURCE_EVENT_KIND_OPTIONS = vocabulary<
  Schemas["SchedulableFeatureViewEventKindEnum"]
>({
  ingestion: { icon: HardDriveDownloadIcon },
  profiling: { icon: ChartColumnIcon },
})

export const SCHEDULABLE_STORE_EVENT_KIND_OPTIONS = vocabulary<
  Schemas["SchedulableStoreEventKindEnum"]
>({
  store_profiling: { icon: DatabaseIcon },
})

export const SCHEDULABLE_EVENT_KIND_OPTIONS = vocabulary<Schemas["SchedulableEventKindEnum"]>({
  ingestion: { icon: HardDriveDownloadIcon },
  profiling: { icon: ChartColumnIcon },
  store_profiling: { icon: DatabaseIcon },
})

// EventStatusEnum — common stateful outcome across featureView/ingestion work-events
// (submitted → succeeded | failed), advanced by apply(event, kind, outcome).
export const EVENT_STATUS_OPTIONS = vocabulary<Schemas["EventStatusEnum"]>({
  submitted: {
    icon: ArrowUpCircleIcon,
    tone: "bg-status-submitted text-status-submitted-fg",
    running: true,
  },
  succeeded: { icon: CheckCircle2Icon, tone: "bg-status-succeeded text-status-succeeded-fg" },
  failed: { icon: XCircleIcon, tone: "bg-status-failed text-status-failed-fg" },
})

// Stateful enum: featureView lifecycle carries semantic color. 형상 상태이고, 그 상태에서 무엇이
// 가능한지는 오퍼(/v1/client/feature-view-actions)가 답한다.
export const SOURCE_LIFECYCLE_OPTIONS = vocabulary<Schemas["FeatureViewLifecycleStatusEnum"]>({
  draft: { icon: CircleDashedIcon, tone: "bg-status-validating text-status-validating-fg" },
  active: { icon: CheckCircle2Icon, tone: "bg-status-active text-status-active-fg" },
  suspended: { icon: PauseCircleIcon, tone: "bg-status-inactive text-status-inactive-fg" },
  retired: { icon: ArchiveIcon, tone: "bg-status-inactive text-status-inactive-fg" },
  validation_failed: { icon: XCircleIcon, tone: "bg-status-failed text-status-failed-fg" },
  retirement_failed: { icon: XCircleIcon, tone: "bg-status-failed text-status-failed-fg" },
})

// stateful bool fields (submit_enabled/schedule_enabled): true=active, false=validating.
export const BOOL_OPTIONS: EnumOption[] = [
  { value: "true", icon: CheckCircle2Icon, tone: "bg-status-active text-status-active-fg" },
  { value: "false", icon: CircleIcon, tone: "bg-status-validating text-status-validating-fg" },
]

// neutral bool fields (dedup_on_output): just an option, not an on/off state — no status tone.
export const BOOL_NEUTRAL_OPTIONS: EnumOption[] = [
  { value: "true", icon: CheckCircle2Icon },
  { value: "false", icon: CircleIcon },
]

// Stateful enum: partition run status — 2-triplet 모델. materialization triplet
// (materialization_submitted → materialization_succeeded | materialization_failed) 후 consistency triplet (consistency_submitted →
// consistency_succeeded | consistency_failed). happy path: materialization_submitted → materialization_succeeded → consistency_submitted → consistency_succeeded.
export const PARTITION_STATUS_OPTIONS = vocabulary<Schemas["PartitionStatusEnum"]>({
  materialization_submitted: {
    icon: ArrowUpCircleIcon,
    tone: "bg-status-submitted text-status-submitted-fg",
    running: true,
  },
  materialization_succeeded: {
    icon: CheckCircle2Icon,
    tone: "bg-status-succeeded text-status-succeeded-fg",
  },
  materialization_failed: { icon: XCircleIcon, tone: "bg-status-failed text-status-failed-fg" },
  consistency_submitted: {
    icon: ShieldIcon,
    tone: "bg-status-submitted text-status-submitted-fg",
    running: true,
  },
  consistency_succeeded: {
    icon: ShieldCheckIcon,
    tone: "bg-status-active text-status-active-fg",
  },
  consistency_failed: { icon: ShieldXIcon, tone: "bg-status-inactive text-status-inactive-fg" },
})

// materialization mode: dump=full reload, diff=incremental.
export const MODE_OPTIONS = vocabulary<Schemas["MaterializationModeEnum"]>({
  dump: { icon: DatabaseBackupIcon, tone: "bg-status-validating text-status-validating-fg" },
  diff: { icon: GitCompareIcon, tone: "bg-status-active text-status-active-fg" },
})
