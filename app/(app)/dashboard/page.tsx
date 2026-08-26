import { listFeatureViews, listPartitionEvents } from "@/lib/meta-client"
import type { PartitionStatus, FeatureViewLifecycleStatus } from "@/lib/meta-client"
import {
  DashboardSummaryCards,
  LIFECYCLE_ITEMS,
  PARTITION_STATUS_CARDS,
  type SectionCounts,
} from "@/components/dashboard/dashboard-summary-cards"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"
import { windowStart } from "@/lib/time-window"

async function countByStatus(statuses: FeatureViewLifecycleStatus[]): Promise<number> {
  const r = await listFeatureViews({ limit: 1, offset: 0, lifecycle_status: statuses }).catch(() => null)
  return r?.pagination.total ?? 0
}

// partition events "all" 카운트 — 링크그룹의 all(updated_within=2d)과 같은 2일 창.
async function countAllPartitionEvents(): Promise<number> {
  const updatedFrom = windowStart("2d")
  const r = await listPartitionEvents({ limit: 1, offset: 0, updated_from: updatedFrom }).catch(
    () => null,
  )
  return r?.pagination.total ?? 0
}

// Partition event API의 pagination.total로 status별 카운트를 뽑는다.
// 집계는 카드 링크(updated_within=2d)와 같은 최근 2일 창을 공유한다.
// 목록 함수의 타입을 손으로 다시 적지 않고 그 함수에서 가져온다(계약 → 생성 타입 → 여기).
async function sectionCounts(
  list: typeof listPartitionEvents,
  cards: { statuses: PartitionStatus[] }[],
): Promise<SectionCounts> {
  const updatedFrom = windowStart("2d")
  const count = async (statuses: PartitionStatus[]) => {
    const r = await list({
      limit: 1,
      offset: 0,
      status: statuses,
      updated_from: updatedFrom,
    }).catch(() => null)
    return r?.pagination.total ?? 0
  }
  const counts = await Promise.all(cards.map((c) => count(c.statuses)))
  return { counts }
}

export default async function DashboardPage() {
  const [byStatus, partitionEvents, partitionEventsTotal] = await Promise.all([
    Promise.all(LIFECYCLE_ITEMS.map((c) => countByStatus(c.statuses))),
    sectionCounts(listPartitionEvents, PARTITION_STATUS_CARDS),
    countAllPartitionEvents(),
  ])

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Dashboard" }]}
        grafanaUrl={process.env.GRAFANA_DASHBOARD_URL}
      />
      <PageMain variant="detail">
        <DashboardSummaryCards
          statusCounts={byStatus}
          partitionEvents={partitionEvents}
          partitionEventsTotal={partitionEventsTotal}
          grafanaDashboardUrl={process.env.GRAFANA_DASHBOARD_URL}
        />
      </PageMain>
    </>
  )
}
