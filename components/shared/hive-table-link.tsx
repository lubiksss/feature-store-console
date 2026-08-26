"use client"

import Link from "next/link"
import { TableIcon } from "lucide-react"
import { TruncateTip } from "@/components/shared/truncate-tip"
import { hueHref } from "@/lib/catalog-enums"
import { cn } from "@/lib/utils"

// `db.table` carries no cluster, so the metastore host comes from the location's cluster.
//   → https://hadoop-primary.example.net/hue/metastore/table/fs_catalog/user_click_count_1h?connector_id=hive&namespace=default
//   → https://hadoop-secondary.example.net/hue/metastore/table/fs_catalog/item_popularity_1h?connector_id=hive&namespace=default
function toMetastoreUrl(hiveTable: string, cluster: string | undefined): string | null {
  const dot = hiveTable.indexOf(".")
  if (dot < 1) return null
  const db = hiveTable.slice(0, dot)
  const table = hiveTable.slice(dot + 1)
  return `${hueHref(cluster)}/metastore/table/${db}/${table}?connector_id=hive&namespace=default`
}

interface Props {
  hiveTable: string
  // The featureView location's hadoop_cluster; unset resolves to hadoop-primary.
  cluster?: string
  className?: string
}

export function HiveTableLink({ hiveTable, cluster, className }: Props) {
  const url = toMetastoreUrl(hiveTable, cluster)
  if (!url) return <>{hiveTable}</>

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "inline-flex min-w-0 max-w-full items-center gap-1 hover:text-foreground hover:underline transition-colors",
        className,
      )}
    >
      <TableIcon className="size-3 shrink-0" />
      <TruncateTip>{hiveTable}</TruncateTip>
    </Link>
  )
}
