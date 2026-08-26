import { readList } from "@/lib/read-failure"
import { windowStart } from "@/lib/time-window"
import { listPartitionEvents, getPartitionConsistencyResult, PAGE_SIZE } from "@/lib/meta-client"
import { eligibleSourceOptions } from "@/lib/feature-view-list"
import { toPartitionEventRow } from "@/components/partition-events/partition-event-mappers"
import { PartitionEventTableClient } from "@/components/partition-events/partition-event-table-client"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"

// fs_partition_event journal — partition milestones.
export default async function PartitionEventsPage() {
  const offset = 0

  const [listed, sourceOptions] = await Promise.all([
    readList(
      listPartitionEvents({
        limit: PAGE_SIZE,
        offset,
        feature_view_name: undefined,
        status: undefined,
        dt: undefined,
        hr: undefined,
        min: undefined,
        segment: undefined,
        updated_from: windowStart(undefined),
      }),
    ),
    eligibleSourceOptions(),
  ])

  const events = listed.data?.items ?? []
  // score lives on the consistency result — join it per event by partition_event_id
  // (the list endpoint has no event-id filter). 404 = no result yet → null.
  const scores = await Promise.all(
    events.map((e) =>
      getPartitionConsistencyResult(e.partition_event_id)
        .then((r) => r.score ?? null)
        .catch(() => null),
    ),
  )
  const items = events.map((e, i) => ({ ...toPartitionEventRow(e), score: scores[i] }))

  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Partition Events" }]} />
      <PageMain variant="list">
        <PartitionEventTableClient
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
