"use client"

import { StoreEventTable } from "@/components/online-store-events/online-store-event-table"
import { createRowNavTableClient } from "@/components/shared/row-nav-table-client"

export const StoreEventTableClient = createRowNavTableClient(
  StoreEventTable,
  (id: number) => `/online-store-events/${id}`,
)
