import { readList } from "@/lib/read-failure"
import { canEdit } from "@/lib/auth"
import { listFeatureViewSchedules, PAGE_SIZE } from "@/lib/meta-client"
import { eligibleSourceOptions } from "@/lib/feature-view-list"
import { toFeatureViewScheduleRow } from "@/components/feature-view-schedules/feature-view-schedule-mappers"
import { FeatureViewScheduleTableClient } from "@/components/feature-view-schedules/feature-view-schedule-table-client"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"

export default async function FeatureViewSchedulesPage() {
  const offset = 0

  // schedule_enabled is a scalar boolean filter server-side; take the first selected value.
  const scheduleEnabled = undefined?.[0]

  const [listed, sourceOptions] = await Promise.all([
    readList(
      listFeatureViewSchedules({
        limit: PAGE_SIZE,
        offset,
        feature_view_name: undefined,
        event_kind: undefined,
        schedule_enabled: scheduleEnabled === undefined ? undefined : scheduleEnabled === "true",
      }),
    ),
    eligibleSourceOptions(),
  ])

  const items = (listed.data?.items ?? []).map(toFeatureViewScheduleRow)
  const editable = await canEdit()

  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Feature View Schedules" }]} />
      <PageMain variant="list">
        <FeatureViewScheduleTableClient
          data={items}
          sourceOptions={sourceOptions}
          limit={listed.data?.pagination.limit ?? PAGE_SIZE}
          offset={listed.data?.pagination.offset ?? offset}
          total={listed.data?.pagination.total ?? 0}
          addHref="/feature-view-schedules/add"
          canEdit={editable}
          failure={listed.failure}
          filtered={false}
          className="flex-1 min-h-0"
        />
      </PageMain>
    </>
  )
}
