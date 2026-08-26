"use client"

import { useRouter } from "next/navigation"
import { FeatureViewScheduleTable } from "@/components/feature-view-schedules/feature-view-schedule-table"
import { sourceScheduleHref } from "@/lib/schedule-addr"

export function FeatureViewScheduleTableClient(
  props: React.ComponentProps<typeof FeatureViewScheduleTable>,
) {
  const router = useRouter()
  return (
    <FeatureViewScheduleTable
      {...props}
      onRowClick={(scheduleId) => router.push(sourceScheduleHref(scheduleId))}
    />
  )
}
