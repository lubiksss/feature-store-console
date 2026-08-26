"use client"

import { StoreTable } from "@/components/online-stores/online-store-table"
import { createRowNavTableClient } from "@/components/shared/row-nav-table-client"
import type { StoreRowData } from "@/components/online-stores/online-store-row"

// 행 이동은 쌍을 탄다: 이름 한 칸으로는 어느 인스턴스인지 정해지지 않는다.
export const StoreTableClient = createRowNavTableClient(
  StoreTable,
  (row: StoreRowData) =>
    `/stores/${encodeURIComponent(row.storeName)}/${encodeURIComponent(row.storeKind)}`,
)
