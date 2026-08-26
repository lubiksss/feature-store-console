"use client"

import { FeatureViewEventTable } from "@/components/feature-view-events/feature-view-event-table"
import { createRowNavTableClient } from "@/components/shared/row-nav-table-client"

export const FeatureViewEventTableClient = createRowNavTableClient(
  FeatureViewEventTable,
  (id: number) => `/feature-view-events/${id}`,
)
