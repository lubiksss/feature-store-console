import { PARTITION_STATUS_OPTIONS } from "@/lib/catalog-enums"
import { ActivityIcon, BoxesIcon, ListIcon } from "lucide-react"
import { buildGrafanaPanelUrl, GRAFANA_PANELS } from "@/lib/grafana"
import {
  DistributionBars,
  OutcomeBars,
  ScoreGauge,
  TrendChart,
  VizRoot,
} from "@/components/dashboard/panel-charts"
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

// 외부 대시보드가 설정돼 있으면 그 패널을, 없으면 같은 성격의 인라인 차트를 끼운다.
// 자리를 비워 두면 카드가 사라져 대시보드가 링크 목록만 남는다.
function panel(
  title: string,
  src: string | undefined,
  chart: React.ReactNode,
): DashboardMetricPanel[] {
  return src ? [{ title, src }] : [{ title, chart }]
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
    <VizRoot className="contents">
      {/* Row 1 — FeatureView lifecycle (등록 추이 + 라이프사이클 링크). 컨텐츠 높이만큼. */}
      <DashboardMetricCard
        className="shrink-0"
        panels={panel(
          "Active feature views",
          activeSourcesSrc,
          <TrendChart seed={11} base={9} amp={7} points={36} label="최근 3개월 활성 피처 뷰 수 추이" />,
        )}
        linkGroups={lifecycleLinkGroups}
      />
      {/* Row 2 — Partition events (성공/실패 추이 + 6개 링크). 컨텐츠 높이만큼. */}
      <DashboardMetricCard
        className="shrink-0"
        panels={panel(
          "Partition events",
          partitionEventsSrc,
          <OutcomeBars seed={23} label="최근 14일 파티션 이벤트 성공·실패 건수" />,
        )}
        linkGroups={[partitionLinkGroup]}
      />
      {/* Row 3 — 최근 7일 실행 상태 */}
      <div className="grid shrink-0 gap-4 lg:grid-cols-3">
        <DashboardMetricCard
          panels={panel(
            "Running events",
            runningEventsSrc,
            <TrendChart seed={41} base={4} amp={6} points={28} label="최근 7일 진행 중 이벤트 수" />,
          )}
        />
        <DashboardMetricCard
          panels={panel(
            "Running executions",
            runningExecutionsSrc,
            <TrendChart seed={57} base={6} amp={9} points={28} label="최근 7일 진행 중 실행 수" />,
          )}
        />
        <DashboardMetricCard
          panels={panel(
            "Consistency score",
            consistencyScoreSrc,
            <ScoreGauge value={0.988} label="정합성 점수" />,
          )}
        />
      </div>
      {/* Row 4 — 갱신 주기별 분포 */}
      <div className="grid shrink-0 gap-4 lg:grid-cols-3">
        <DashboardMetricCard
          panels={panel(
            "Update interval (daily)",
            updateIntervalDailySrc,
            <DistributionBars
              label="일 단위 갱신 피처 뷰 분포"
              items={[
                { name: "purchase_count_7d", value: 24 },
                { name: "category_affinity", value: 18 },
                { name: "ctr_7d", value: 12 },
                { name: "ltv_score", value: 7 },
              ]}
            />,
          )}
        />
        <DashboardMetricCard
          panels={panel(
            "Update interval (hourly)",
            updateIntervalHourlySrc,
            <DistributionBars
              label="시간 단위 갱신 피처 뷰 분포"
              items={[
                { name: "click_count_1d", value: 31 },
                { name: "fraud_score", value: 19 },
                { name: "popularity_1h", value: 9 },
              ]}
            />,
          )}
        />
        <DashboardMetricCard
          panels={panel(
            "Update interval (other)",
            updateIntervalOtherSrc,
            <DistributionBars
              label="그 외 주기 피처 뷰 분포"
              items={[
                { name: "recent_click_items", value: 22 },
                { name: "session_view_items", value: 14 },
                { name: "recent_query_keywords", value: 6 },
              ]}
            />,
          )}
        />
      </div>
    </VizRoot>
  )
}
