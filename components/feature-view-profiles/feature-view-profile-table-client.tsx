"use client"

import type { ComponentProps } from "react"
import { useRouter } from "next/navigation"
import { FeatureViewProfileTable } from "@/components/feature-view-profiles/feature-view-profile-table"
import type { FeatureViewProfileRowData } from "@/components/feature-view-profiles/feature-view-profile-row"

type Props = Omit<ComponentProps<typeof FeatureViewProfileTable>, "onRowClick">

// A field row navigates to that field's full profiling stats. The partition
// coordinate travels as query params (empty optionals omitted; the detail page
// defaults missing coords to "").
export function FeatureViewProfileTableClient(props: Props) {
  const router = useRouter()
  const onRowClick = (row: FeatureViewProfileRowData) => {
    const coord = new URLSearchParams()
    if (row.hr) coord.set("hr", row.hr)
    if (row.min) coord.set("min", row.min)
    if (row.segment) coord.set("segment", row.segment)
    const qs = coord.toString()
    const href = `/feature-view-profiles/${encodeURIComponent(row.featureViewName)}/partitions/${encodeURIComponent(row.dt)}/fields/${encodeURIComponent(row.fieldPath)}`
    router.push(qs ? `${href}?${qs}` : href)
  }
  return <FeatureViewProfileTable {...props} onRowClick={onRowClick} />
}
