"use client"

import { FeatureViewTable } from "@/components/feature-views/feature-view-table"
import { createRowNavTableClient } from "@/components/shared/row-nav-table-client"

export const FeatureViewTableClient = createRowNavTableClient(
  FeatureViewTable,
  (featureViewName: string) => `/feature-views/${encodeURIComponent(featureViewName)}`,
)
