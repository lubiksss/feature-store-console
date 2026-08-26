"use client"

import { IngestionSpecTable } from "@/components/ingestion-specs/ingestion-spec-table"
import { createRowNavTableClient } from "@/components/shared/row-nav-table-client"

export const IngestionSpecTableClient = createRowNavTableClient(
  IngestionSpecTable,
  (featureViewName: string) => `/ingestion-specs/${encodeURIComponent(featureViewName)}`,
)
