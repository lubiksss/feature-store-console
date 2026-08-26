import { PARTITION_STATUS_OPTIONS } from "@/lib/catalog-enums"
import { ActivityIcon, BoxesIcon, ListIcon } from "lucide-react"
import { buildGrafanaPanelUrl, GRAFANA_PANELS } from "@/lib/grafana"
import {
  DashboardMetricCard,
  type DashboardMetricLinkGroup,
  type DashboardMetricLinkItem,
  type DashboardMetricPanel,
} from "@/components/dashboard/dashboard-metric-card"
import type { EnumSet } from "@/components/shared/enum-badges"
import type { PartitionStatus, FeatureViewLifecycleStatus } from "@/lib/meta-client"

// statuses 는 계약의 status 어휘다 — lifecycle 카드와 partition 카드가 각자 자기 enum 으로
// 인스턴스화하므로, 한쪽 어휘를 다른 쪽 목록에 적는 것이 컴파일 오류가 된다.
interface StatusItemDef<S extends string = string> {
  statuses: S[]
  badge: {
    set: EnumSet
    value: string
    postfix?: boolean
    title?: string
  }
}

// 대시보드에서는 전체 합계 링크 뒤에 lifecycle 상태별 링크를 이어 붙인다.
export const LIFECYCLE_ITEMS: StatusItemDef<FeatureViewLifecycleStatus>[] = [
  { statuses: ["draft"], badge: { set: "featureViewLifecycle", value: "draft" } },
  { statuses: ["active"], badge: { set: "featureViewLifecycle", value: "active" } },
  { statuses: ["suspended"], badge: { set: "featureViewLifecycle", value: "suspended" } },
  { statuses: ["retired"], badge: { set: "featureViewLifecycle", value: "retired" } },
  {
    statuses: ["validation_failed", "retirement_failed"],
    badge: {
      set: "featureViewLifecycle",
      value: "validation_failed",
      postfix: true,
      title: "validation_failed, retirement_failed",
    },
  },
]

// partition 이벤트 status 6종 — 카운트 fetch용 SSOT. 링크그룹은 별도 구성한다.
export const PARTITION_STATUS_CARDS: StatusItemDef<PartitionStatus>[] =
  PARTITION_STATUS_OPTIONS.map((o) => ({
    statuses: [o.value],
    badge: { set: "partitionStatus", value: o.value, postfix: true },
  }))

export interface SectionCounts {
  counts: number[]
}

interface Props {
  statusCounts: number[]
  partitionEvents: SectionCounts
  partitionEventsTotal: number
  grafanaDashboardUrl?: string
}

// partition events 링크그룹: all(필터 없음) → mat_submitted → mat_succeeded →
// con_submitted → con_succeeded → failed(mat_failed + con_failed). 카운트 창은
// 2d(updated_within=2d)로 링크와 일치시킨다. counts 순서는 PARTITION_STATUS_OPTIONS.
function partitionEventsLinkGroup(total: number, counts: number[]): DashboardMetricLinkGroup {
  const at = (i: number) => counts[i] ?? 0
  const failedCount = at(2) + at(5)
  const items: DashboardMetricLinkItem[] = [
    {
      key: "all",
      href: "/partition-events?updated_within=2d",
      value: total,
      badge: { kind: "icon", icon: ListIcon, label: "all" },
      ariaLabel: `View all partition events from the last 2 days: ${total}`,
    },
    {
      key: "materialization_submitted",
      href: "/partition-events?status=materialization_submitted&updated_within=2d",
      value: at(0),
      badge: {
        kind: "enum",
        set: "partitionStatus",
        value: "materialization_submitted",
        postfix: true,
      },
      ariaLabel: `View materialization submitted events from the last 2 days: ${at(0)}`,
    },
    {
      key: "materialization_succeeded",
      href: "/partition-events?status=materialization_succeeded&updated_within=2d",
      value: at(1),
      badge: {
        kind: "enum",
        set: "partitionStatus",
        value: "materialization_succeeded",
        postfix: true,
      },
      ariaLabel: `View materialization succeeded events from the last 2 days: ${at(1)}`,
    },
    {
      key: "consistency_submitted",
      href: "/partition-events?status=consistency_submitted&updated_within=2d",
      value: at(3),
      badge: {
        kind: "enum",
        set: "partitionStatus",
        value: "consistency_submitted",
        postfix: true,
      },
      ariaLabel: `View consistency submitted events from the last 2 days: ${at(3)}`,
    },
    {
      key: "consistency_succeeded",
      href: "/partition-events?status=consistency_succeeded&updated_within=2d",
      value: at(4),
      badge: {
        kind: "enum",
        set: "partitionStatus",
        value: "consistency_succeeded",
        postfix: true,
      },
      ariaLabel: `View consistency succeeded events from the last 2 days: ${at(4)}`,
    },
    {
      key: "failed",
      href: "/partition-events?status=materialization_failed&status=consistency_failed&updated_within=2d",
      value: failedCount,
      badge: {
        kind: "enum",
        set: "partitionStatus",
        value: "materialization_failed",
        postfix: true,
        title: "materialization_failed, consistency_failed",
      },
      ariaLabel: `View failed partition events from the last 2 days: ${failedCount}`,
    },
  ]
  return {
    key: "partition-event",
    title: "Partition events",
    icon: ActivityIcon,
    ariaLabel: "Partition event status",
    items,
  }
}

function panel(title: string, src: string | undefined): DashboardMetricPanel[] | undefined {
  if (!src) return undefined
  return [{ title, src }]
}

export function DashboardSummaryCards({
  statusCounts,
  partitionEvents,
  partitionEventsTotal,
  grafanaDashboardUrl,
}: Props) {
  const activeSourcesSrc = buildGrafanaPanelUrl(grafanaDashboardUrl, GRAFANA_PANELS.activeSources)
  const partitionEventsSrc = buildGrafanaPanelUrl(
    grafanaDashboardUrl,
    GRAFANA_PANELS.partitionEvents,
  )
  const runningEventsSrc = buildGrafanaPanelUrl(grafanaDashboardUrl, GRAFANA_PANELS.runningEvents)
  const runningExecutionsSrc = buildGrafanaPanelUrl(
    grafanaDashboardUrl,
    GRAFANA_PANELS.runningExecutions,
  )
  const consistencyScoreSrc = buildGrafanaPanelUrl(
    grafanaDashboardUrl,
    GRAFANA_PANELS.consistencyScore,
  )
  const updateIntervalDailySrc = buildGrafanaPanelUrl(
    grafanaDashboardUrl,
    GRAFANA_PANELS.updateIntervalDaily,
  )
  const updateIntervalHourlySrc = buildGrafanaPanelUrl(
    grafanaDashboardUrl,
    GRAFANA_PANELS.updateIntervalHourly,
  )
  const updateIntervalOtherSrc = buildGrafanaPanelUrl(
    grafanaDashboardUrl,
    GRAFANA_PANELS.updateIntervalOther,
  )

  const allSourceCount = statusCounts.reduce((sum, count) => sum + count, 0)

  const lifecycleLinkGroups: DashboardMetricLinkGroup[] = [
    {
      key: "feature-view-lifecycle",
      title: "FeatureView lifecycle",
      icon: BoxesIcon,
      ariaLabel: "FeatureView lifecycle status",
      items: [
        {
          key: "all",
          href: "/feature-views",
          value: allSourceCount,
          badge: { kind: "icon", icon: ListIcon, label: "all" },
          ariaLabel: `View all featureViews: ${allSourceCount}`,
        },
        ...LIFECYCLE_ITEMS.map((item, index) => ({
          key: item.statuses.join(","),
          href: `/feature-views?${item.statuses.map((status) => `lifecycle_status=${status}`).join("&")}`,
          value: statusCounts[index] ?? 0,
          badge: { kind: "enum" as const, ...item.badge },
          ariaLabel: `View ${item.statuses.join(" or ")} featureViews: ${statusCounts[index] ?? 0}`,
        })),
      ],
    },
  ]

  const partitionLinkGroup = partitionEventsLinkGroup(partitionEventsTotal, partitionEvents.counts)

  return (
    <>
      {/* Row 1 — FeatureView lifecycle (active featureViews panel + lifecycle links). 컨텐츠 높이만큼. */}
      <DashboardMetricCard
        className="shrink-0"
        panels={panel("Active feature-views", activeSourcesSrc)}
        linkGroups={lifecycleLinkGroups}
      />
      {/* Row 2 — Partition events (panel 17 + 6-item links). 컨텐츠 높이만큼. */}
      <DashboardMetricCard
        className="shrink-0"
        panels={panel("Partition events", partitionEventsSrc)}
        linkGroups={[partitionLinkGroup]}
      />
      {/* Row 3 — 2일뷰 패널 3개: running events, running executions, consistency score */}
      <div className="grid shrink-0 gap-4 lg:grid-cols-3">
        <DashboardMetricCard panels={panel("Running events", runningEventsSrc)} />
        <DashboardMetricCard panels={panel("Running executions", runningExecutionsSrc)} />
        <DashboardMetricCard panels={panel("Consistency score", consistencyScoreSrc)} />
      </div>
      {/* Row 4 — update interval 분포 */}
      <div className="grid shrink-0 gap-4 lg:grid-cols-3">
        <DashboardMetricCard panels={panel("Update interval (daily)", updateIntervalDailySrc)} />
        <DashboardMetricCard panels={panel("Update interval (hourly)", updateIntervalHourlySrc)} />
        <DashboardMetricCard panels={panel("Update interval (other)", updateIntervalOtherSrc)} />
      </div>
    </>
  )
}
