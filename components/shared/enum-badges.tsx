"use client"

import { Badge } from "@/components/ui/badge"
import { BadgeLink } from "@/components/shared/badge-link"
import { LiveDot } from "@/components/shared/live-dot"
import { cn } from "@/lib/utils"
import { BadgeSelect } from "@/components/shared/badge-select"
import {
  STORE_KIND_OPTIONS,
  STORE_EVENT_KIND_OPTIONS,
  PRODUCER_OPTIONS,
  SOURCE_FORMAT_OPTIONS,
  HDFS_FORMAT_OPTIONS,
  HADOOP_CLUSTER_OPTIONS,
  AGGREGATION_OPTIONS,
  IDENTITY_FILTER_OPTIONS,
  SOURCE_LIFECYCLE_OPTIONS,
  BOOL_OPTIONS,
  BOOL_NEUTRAL_OPTIONS,
  PARTITION_STATUS_OPTIONS,
  MODE_OPTIONS,
  EVENT_KIND_OPTIONS,
  SOURCE_EVENT_KIND_OPTIONS,
  EVENT_STATUS_OPTIONS,
  KEY_DATA_TYPE_OPTIONS,
  VALUE_DATA_TYPE_OPTIONS,
  SCHEDULABLE_EVENT_KIND_OPTIONS,
  SCHEDULABLE_SOURCE_EVENT_KIND_OPTIONS,
  SCHEDULABLE_STORE_EVENT_KIND_OPTIONS,
  SOURCE_OFFERABLE_EVENT_KIND_OPTIONS,
  fieldTypeOption,
  hadoopClusterHref,
  type EnumOption,
} from "@/lib/catalog-enums"

// detail views are server components, so passing options (icon = a function component) across
// the server→client boundary throws a serialization error. These wrappers are "use client" and
// resolve the options in the client bundle; the server only passes a `set` key + string value.
const SETS = {
  storeEventKind: STORE_EVENT_KIND_OPTIONS,
  storeKind: STORE_KIND_OPTIONS,
  producer: PRODUCER_OPTIONS,
  sourceFormat: SOURCE_FORMAT_OPTIONS,
  hdfsFormat: HDFS_FORMAT_OPTIONS,
  hadoopCluster: HADOOP_CLUSTER_OPTIONS,
  aggregation: AGGREGATION_OPTIONS,
  identityFilter: IDENTITY_FILTER_OPTIONS,
  featureViewLifecycle: SOURCE_LIFECYCLE_OPTIONS,
  bool: BOOL_OPTIONS,
  boolNeutral: BOOL_NEUTRAL_OPTIONS,
  partitionStatus: PARTITION_STATUS_OPTIONS,
  mode: MODE_OPTIONS,
  eventKind: EVENT_KIND_OPTIONS,
  featureViewEventKind: SOURCE_EVENT_KIND_OPTIONS,
  eventStatus: EVENT_STATUS_OPTIONS,
  keyDataType: KEY_DATA_TYPE_OPTIONS,
  valueDataType: VALUE_DATA_TYPE_OPTIONS,
  schedulableEventKind: SCHEDULABLE_EVENT_KIND_OPTIONS,
  schedulableFeatureViewEventKind: SCHEDULABLE_SOURCE_EVENT_KIND_OPTIONS,
  schedulableStoreEventKind: SCHEDULABLE_STORE_EVENT_KIND_OPTIONS,
  sourceOfferableEventKind: SOURCE_OFFERABLE_EVENT_KIND_OPTIONS,
} as const

export type EnumSet = keyof typeof SETS

// Enum sets whose values address an external console. Registering a set here makes every badge
// of that set a link to its value's console — one place to configure, so the list view and the
// detail view can't drift. Resolved in the client bundle for the same reason as SETS: a server
// component can only hand over the `set` key, never a function.
const HREFS: Partial<Record<EnumSet, (value: string) => string>> = {
  hadoopCluster: hadoopClusterHref,
}

// Enum sets whose value addresses a list view filtered by that value. Registering a set here makes
// every badge of that set a link into the admin — "show me the rest that look like this" — from one
// place, so a list row and a detail card can't point at different destinations.
//
// Rules for this map:
//   - Only register a set when the DESTINATION PAGE ACTUALLY PARSES that param. The API supporting
//     a filter is not enough: /ingestion-specs reads feature_view_name only, so sourceFormat /
//     hdfsFormat stay out until the page grows those filters (a dead link is worse than no link).
//   - A builder may return undefined for values with no exact filter (see eventKind): a set can be
//     partially linked, and guessing a near-miss destination is worse than leaving the badge inert.
//   - Sets with no filter anywhere stay unregistered: mode, aggregation, identityFilter, keyDataType,
//     valueDataType, boolNeutral.
//   - `bool` is registered for the schedule_enabled axis, its only current use. If another boolean
//     field ever renders this set, split the set instead of widening this entry.
const filtered = (path: string, param: string) => (v: string) =>
  `${path}?${new URLSearchParams({ [param]: v })}`

const LIST_FILTER_HREFS: Partial<Record<EnumSet, (value: string) => string | undefined>> = {
  featureViewLifecycle: filtered("/feature-views", "lifecycle_status"),
  producer: filtered("/feature-views", "producer"),
  partitionStatus: filtered("/partition-events", "status"),
  featureViewEventKind: filtered("/feature-view-events", "event_kind"),
  storeEventKind: filtered("/online-store-events", "event_kind"),
  storeKind: filtered("/online-store-events", "store_kind"),
  eventStatus: filtered("/feature-view-events", "status"),
  schedulableEventKind: filtered("/feature-view-schedules", "event_kind"),
  schedulableFeatureViewEventKind: filtered("/feature-view-schedules", "event_kind"),
  schedulableStoreEventKind: filtered("/online-store-schedules", "event_kind"),
  bool: filtered("/event-schedules", "schedule_enabled"),
  // Partition kinds (materialization/consistency) have no event_kind filter — partition events are
  // filtered by status, not kind — so they stay inert while the featureView kinds link.
  eventKind: (v) =>
    ["validation", "retirement", "profiling", "ingestion"].includes(v.toLowerCase())
      ? filtered("/feature-view-events", "event_kind")(v)
      : undefined,
}

// Match case-insensitively: some stored values are upper-cased (e.g. LIST, REACTION)
// while the enum contract is lowercase. Compare/display normalized to the canonical option value.
function optionFor(set: EnumSet, value: string): EnumOption | undefined {
  const v = value.toLowerCase()
  return SETS[set].find((o) => o.value.toLowerCase() === v)
}

// 앱 안 목적지(필터 목록 등)로 가는 링크. 링크 스타일과 stopPropagation은 BadgeLink가 갖는다.
function wrapInApp(badge: React.ReactNode, href?: string) {
  if (!href) return badge
  return <BadgeLink href={href}>{badge}</BadgeLink>
}

// postfix: 라벨이 긴 status 등을 리스트뷰에서 아이콘 + 마지막 세그먼트만 표시
// (예: materialization_submitted → 아이콘 + "submitted"). 아이콘이 phase를 구분하고
// postfix가 상태를 보여준다. 호버 title로 전체 값 노출.
// href: an in-app destination for this value (e.g. lifecycle_status → the featureView's event
// history). Takes precedence over the HREFS console link and navigates in the same tab, since
// it stays inside the admin.
//
// link={false}: render the badge with NO link of its own. Required when the caller already wraps
// the badge in an anchor (the dashboard cards make the whole row a link) — an <a> inside an <a> is
// invalid HTML and breaks hydration. Nothing is lost there: the outer link is the same destination.
export function EnumBadge({
  set,
  value,
  className,
  postfix,
  title,
  href: inAppHref,
  link = true,
}: {
  set: EnumSet
  value: string
  className?: string
  postfix?: boolean
  title?: string
  href?: string
  link?: boolean
}) {
  const opt = optionFor(set, value)
  if (!opt)
    return wrapInApp(
      <Badge variant="outline" className={className} title={title}>
        {value}
      </Badge>,
      link ? (inAppHref ?? LIST_FILTER_HREFS[set]?.(value)) : undefined,
    )
  const Icon = opt.icon
  const label = postfix ? opt.value.split("_").pop() : opt.value
  const badge = (
    <Badge
      variant={opt.tone ? "default" : "outline"}
      className={cn(opt.tone, className)}
      title={title ?? (postfix ? opt.value : undefined)}
    >
      <Icon className="size-3" />
      {label}
      {opt.running ? <LiveDot /> : null}
    </Badge>
  )
  // 우선순위: 호출부가 준 목적지 > 값으로 필터한 목록 > 값의 외부 콘솔. 앞의 둘은 앱 안이므로
  // 같은 탭에서 열고, 콘솔만 새 탭이다. link=false면 어느 것도 걸지 않는다.
  if (!link) return badge
  if (inAppHref) return wrapInApp(badge, inAppHref)
  const filterHref = LIST_FILTER_HREFS[set]?.(opt.value)
  if (filterHref) return wrapInApp(badge, filterHref)
  const href = HREFS[set]?.(opt.value)
  if (!href) return badge
  return (
    <BadgeLink href={href} external>
      {badge}
    </BadgeLink>
  )
}

// selectedHref makes the current value a link into the admin (see BadgeSelect). A string rather
// than a builder for the same serialization reason as SETS — the caller is a server component.
//
// link={false}: 폼 안의 읽기 전용 스트립(수정 불가 필드를 어휘로 보여주는 자리)은 링크를 걸지
// 않는다. 입력 중에 뱃지를 잘못 눌러 목록으로 나가면 저장 안 한 값이 사라지고, 이 레포에는
// unsaved-changes 가드가 없다. "모든 뱃지는 필터 목록으로"는 읽기 화면의 규약이다.
// 외부 콘솔 링크(hrefFor)는 새 탭이라 입력을 잃지 않으므로 그대로 둔다.
export function EnumBadges({
  set,
  value,
  selectedHref,
  link = true,
}: {
  set: EnumSet
  value: string
  selectedHref?: string
  link?: boolean
}) {
  // 상세의 옵션 스트립은 현재 값만 링크한다(흐린 옵션은 이 리소스가 아닌 상태라 링크하지 않는다).
  // 호출부가 더 구체적인 목적지를 주면 그것이 이기고, 없으면 값으로 필터한 목록으로 보낸다.
  // 필터 링크는 정규화된 enum 값으로 만든다 — 저장된 값이 대문자로 들어와도(optionFor가 대소문자
  // 무시로 맞춘다) 목록 행과 상세 카드가 같은 URL을 가리켜야 한다.
  const canonical = optionFor(set, value)?.value ?? value
  return (
    <BadgeSelect
      readOnly
      options={SETS[set]}
      value={value}
      hrefFor={HREFS[set]}
      selectedHref={link ? (selectedHref ?? LIST_FILTER_HREFS[set]?.(canonical)) : undefined}
    />
  )
}

// List views only show the supported collection + primitive shape. Preserve primitive
// array elements, but collapse nested collections to a single unknown element marker.
function compactFieldType(value: string): string {
  const normalized = value.trim()
  let depth = 0
  for (const char of normalized) {
    if (char === "<") depth += 1
    if (char === ">") depth -= 1
    if (depth < 0) return value
  }
  if (depth !== 0) return value

  const match = /^array<(.+)>$/i.exec(normalized)
  if (!match) return value

  const elementType = match[1].trim()
  return /^(array|map|struct)<.*>$/i.test(elementType) ? "array<?>" : value
}

// field_type은 열거 불가(free-form Spark simpleString)라 SETS가 아닌 구조 매칭으로
// 아이콘을 고른다. 미지 타입은 아이콘 없이 값 그대로 (thin-client: 값 검증 없음).
export function FieldTypeBadge({
  value,
  className,
  compact = false,
  listPath = "/feature-view-profiles",
}: {
  value: string
  className?: string
  compact?: boolean
  // Which profile list the badge narrows. field_type is not an enum set, so it cannot use
  // LIST_FILTER_HREFS; both planes parse the same param, and a badge must narrow the list it
  // is sitting in rather than send the reader to the other plane.
  listPath?: string
}) {
  const opt = fieldTypeOption(value)
  const label = compact ? compactFieldType(value) : value
  const title = label === value ? undefined : value
  const Icon = opt?.icon
  const badge = (
    <Badge variant="outline" className={className} title={title} aria-label={title}>
      {Icon ? <Icon className="size-3" /> : null}
      {label}
    </Badge>
  )
  // field_type은 열거 불가라 SETS에 없지만 프로파일 목록이 field_type 필터를 파싱하므로,
  // enum 뱃지와 같은 규약으로 그 값으로 필터한 목록에 링크한다.
  return wrapInApp(badge, `${listPath}?${new URLSearchParams({ field_type: value })}`)
}
