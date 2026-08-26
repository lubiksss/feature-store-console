"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

type RowId<P> = P extends { onRowClick?: (id: infer Id) => void } ? Id : never
type WithoutRowClick<P> = Omit<P, "onRowClick">

export function createRowNavTableClient<P extends { onRowClick?: (id: never) => void }>(
  Table: React.ComponentType<P>,
  buildHref: (id: RowId<P>, props: WithoutRowClick<P>) => string,
) {
  return function RowNavTableClient(props: WithoutRowClick<P>) {
    const router = useRouter()
    const tableProps = { ...props, onRowClick: (id: RowId<P>) => router.push(buildHref(id, props)) }
    return <Table {...(tableProps as unknown as P)} />
  }
}
