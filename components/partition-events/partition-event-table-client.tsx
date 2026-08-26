"use client"

import { PartitionEventTable } from "@/components/partition-events/partition-event-table"
import { createRowNavTableClient } from "@/components/shared/row-nav-table-client"

export const PartitionEventTableClient = createRowNavTableClient(
  PartitionEventTable,
  (id: number) => `/partition-events/${id}`,
)
