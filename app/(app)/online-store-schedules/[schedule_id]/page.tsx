import { notFound } from "next/navigation"
import { getStoreEventSchedule, isNotFound } from "@/lib/meta-client"
import { canEdit } from "@/lib/auth"
import { StoreEventScheduleDetail } from "@/components/online-store-schedules/online-store-schedule-detail"
import { toStoreEventScheduleDetail } from "@/components/online-store-schedules/online-store-schedule-mappers"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"
import { storeScheduleLabelOf } from "@/lib/schedule-addr"
import { storeScheduleParams } from "@/lib/fixtures/static-params"

interface Props {
  params: Promise<{ schedule_id: string }>
}

export default async function StoreEventScheduleDetailPage({ params }: Props) {
  const { schedule_id } = await params
  // Digits only: Number() would take "1e3" and " 5 " and render a real schedule under an
  // address that is not its own.
  const scheduleId = /^[0-9]+$/.test(schedule_id) ? Number(schedule_id) : NaN
  if (!Number.isInteger(scheduleId) || scheduleId < 1) notFound()

  // Only a 404 means the schedule is absent. Every other failure is the server's, and
  // rendering it as "no schedule" would make the screen assert something it does not know.
  const schedule = await getStoreEventSchedule(scheduleId).catch((e) => {
    if (isNotFound(e)) return null
    throw e
  })
  const editable = await canEdit()

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Online Store Schedules", href: "/online-store-schedules" },
          { label: schedule ? storeScheduleLabelOf(schedule) : String(scheduleId) },
        ]}
      />
      <PageMain variant="detail">
        <StoreEventScheduleDetail
          scheduleId={scheduleId}
          canEdit={editable}
          data={schedule ? toStoreEventScheduleDetail(schedule) : undefined}
        />
      </PageMain>
    </>
  )
}

// 정적 export: 미리 렌더할 상세 좌표를 픽스처에서 파생시킨다.
export async function generateStaticParams() {
  return storeScheduleParams()
}
