"use client"

import type { ComponentProps } from "react"
import { useRouter } from "next/navigation"
import { StoreProfileTable } from "@/components/online-store-profiles/online-store-profile-table"
import type { StoreProfileRowData } from "@/components/online-store-profiles/online-store-profile-row"

type Props = Omit<ComponentProps<typeof StoreProfileTable>, "onRowClick">

// A field row navigates to that node's full statistics. field_path travels as a query param:
// the natural key is (store_event_id, field_name, field_path) and the path carries the first
// two — the same place the featureView profile route puts its partition sub-coords.
export function StoreProfileTableClient(props: Props) {
  const router = useRouter()
  const onRowClick = (row: StoreProfileRowData) => {
    const qs = new URLSearchParams({ field_path: row.fieldPath }).toString()
    const href = `/online-store-profiles/${row.storeEventId}/fields/${encodeURIComponent(row.fieldName)}`
    router.push(`${href}?${qs}`)
  }
  return <StoreProfileTable {...props} onRowClick={onRowClick} />
}
