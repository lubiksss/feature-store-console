import { readList } from "@/lib/read-failure"
import { windowStart } from "@/lib/time-window"
import { listFeatureViewEvents, PAGE_SIZE } from "@/lib/meta-client"
import { eligibleSourceOptions } from "@/lib/feature-view-list"
import { toFeatureViewEventRow } from "@/components/feature-view-events/feature-view-event-mappers"
import { FeatureViewEventTableClient } from "@/components/feature-view-events/feature-view-event-table-client"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"

// fs_feature_view_event — source-level work-events (validation/retirement/ingestion/profiling).
// ingestion & profiling events are triggered via /feature-view-schedules and land here.
export default async function FeatureViewEventsPage() {
  const offset = 0

  const [listed, sourceOptions] = await Promise.all([
    readList(
      listFeatureViewEvents({
        limit: PAGE_SIZE,
        offset,
        feature_view_name: undefined,
        event_kind: undefined,
        status: undefined,
        updated_from: windowStart(undefined),
      }),
    ),
    eligibleSourceOptions(),
  ])

  const items = (listed.data?.items ?? []).map(toFeatureViewEventRow)

  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Feature View Events" }]} />
      <PageMain variant="list">
        <FeatureViewEventTableClient
          data={items}
          sourceOptions={sourceOptions}
          limit={listed.data?.pagination.limit ?? PAGE_SIZE}
          offset={listed.data?.pagination.offset ?? offset}
          total={listed.data?.pagination.total ?? 0}
          failure={listed.failure}
          filtered={false}
          className="flex-1 min-h-0"
        />
      </PageMain>
    </>
  )
}
