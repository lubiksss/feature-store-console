"use client"

import { EntityTable } from "@/components/entities/entity-table"
import { createRowNavTableClient } from "@/components/shared/row-nav-table-client"

export const EntityTableClient = createRowNavTableClient(
  EntityTable,
  (entityName: string) => `/entities/${encodeURIComponent(entityName)}`,
)
