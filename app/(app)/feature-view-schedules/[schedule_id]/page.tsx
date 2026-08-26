import { notFound } from "next/navigation"
import { getFeatureViewSchedule, isNotFound } from "@/lib/meta-client"
import { canEdit } from "@/lib/auth"
import { FeatureViewScheduleDetail } from "@/components/feature-view-schedules/feature-view-schedule-detail"
import { toFeatureViewScheduleDetail } from "@/components/feature-view-schedules/feature-view-schedule-mappers"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"
import { sourceScheduleLabelOf } from "@/lib/schedule-addr"
import { sourceScheduleParams } from "@/lib/fixtures/static-params"

interface Props {
  params: Promise<{ schedule_id: string }>
}

export default async function FeatureViewScheduleDetailPage({ params }: Props) {
  const { schedule_id } = await params
  // Digits only: Number() would take "1e3" and " 5 " and render a real schedule under an
  // address that is not its own.
  const scheduleId = /^[0-9]+$/.test(schedule_id) ? Number(schedule_id) : NaN
  if (!Number.isInteger(scheduleId) || scheduleId < 1) notFound()

  // Only a 404 means the schedule is absent. Every other failure is the server's, and
  // rendering it as "no schedule" would make the screen assert something it does not know.
  const schedule = await getFeatureViewSchedule(scheduleId).catch((e) => {
    if (isNotFound(e)) return null
    throw e
  })
  const editable = await canEdit()

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Feature View Schedules", href: "/feature-view-schedules" },
          { label: schedule ? sourceScheduleLabelOf(schedule) : String(scheduleId) },
        ]}
      />
      <PageMain variant="detail">
        <FeatureViewScheduleDetail
          scheduleId={scheduleId}
          canEdit={editable}
          data={schedule ? toFeatureViewScheduleDetail(schedule) : undefined}
        />
      </PageMain>
    </>
  )
}

// 정적 export: 미리 렌더할 상세 좌표를 픽스처에서 파생시킨다.
export async function generateStaticParams() {
  return sourceScheduleParams()
}
