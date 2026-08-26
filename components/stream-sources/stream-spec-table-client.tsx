"use client"

import { StreamSpecTable } from "@/components/stream-sources/stream-spec-table"
import { createRowNavTableClient } from "@/components/shared/row-nav-table-client"

export const StreamSpecTableClient = createRowNavTableClient(
  StreamSpecTable,
  (featureViewName: string) => `/stream-sources/${encodeURIComponent(featureViewName)}`,
)
