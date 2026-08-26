"use client"

import { useRouter } from "next/navigation"
import { StoreEventScheduleTable } from "@/components/online-store-schedules/online-store-schedule-table"
import { storeScheduleHref } from "@/lib/schedule-addr"

export function StoreEventScheduleTableClient(
  props: React.ComponentProps<typeof StoreEventScheduleTable>,
) {
  const router = useRouter()
  return (
    <StoreEventScheduleTable
      {...props}
      onRowClick={(scheduleId) => router.push(storeScheduleHref(scheduleId))}
    />
  )
}
