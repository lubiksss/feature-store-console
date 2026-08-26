"use client"

import * as React from "react"
import { Table } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useScrollRestore } from "@/hooks/use-scroll-restore"

// Single shell for every data table — list summaries (via SummaryTableShell) and the
// detail event-log cards (status/gate history, featureView execution). It owns the bordered
// container AND the row-height rule so the value lives in exactly one place.
//
// Row height (header + body cells = h-11 / 44px) is fixed to match the detail
// FieldTable (detail-section.tsx: py-1.5 + inner h-8 = 44px), so navigating
// list↔detail — or comparing a list header to its data rows — causes no layout shift.
//
// Always render data tables through this, never a raw <Table>, so the height can't be
// forgotten. `scroll` makes the table body fill and scroll inside a flex parent (lists);
// omit it for content-height tables (detail cards).
//
// scroll=true인 경우 이 컨테이너가 그 페이지의 스크롤러다. 뒤로가기로 돌아왔을 때 목록 위치를
// 되찾는 것은 문서 스크롤러가 아니라 이쪽이라 브라우저가 못 해준다 — useScrollRestore가 맡는다.
// 그래서 client component지만 children(행들)은 서버 렌더 결과가 그대로 통과한다.
export function DataTable({
  scroll,
  className,
  children,
}: {
  scroll?: boolean
  className?: string
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  useScrollRestore(ref, "table", !!scroll)
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border overflow-hidden",
        scroll && "flex-1 min-h-0 overflow-y-auto",
      )}
    >
      <Table className={cn("table-fixed [&_thead_th]:h-11 [&_tbody_td]:h-11", className)}>
        {children}
      </Table>
    </div>
  )
}
