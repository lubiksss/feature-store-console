"use client"

import Link from "next/link"
import { FolderIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { TruncateTip } from "@/components/shared/truncate-tip"
import { hueHref } from "@/lib/catalog-enums"

// Strips ANY scheme://authority rather than primary's alone: the two clusters address storage
// differently between clusters, and hardcoding one
// made every secondary path fall through to plain text. The filebrowser host still comes from the
// location's cluster, since the leftover path says nothing about which Hue serves it.
function toHueUrl(pattern: string, cluster: string | undefined): string | null {
  const withoutScheme = pattern.replace(/^[a-z][a-z0-9+.-]*:\/\/[^/]*/i, "")
  if (!withoutScheme.startsWith("/")) return null
  // 첫 와일드카드 세그먼트부터는 실존이 보장되지 않으므로 그 앞까지만 링크한다
  const segs = withoutScheme.split("/")
  const cut = segs.findIndex((seg) => seg.includes("*"))
  const dir = (cut === -1 ? segs : segs.slice(0, cut)).join("/")
  return `${hueHref(cluster)}/filebrowser/view=${encodeURIComponent(dir)}`
}

interface Props {
  path: string
  // The featureView location's hadoop_cluster; unset resolves to hadoop-primary.
  cluster?: string
  className?: string
}

export function HdfsPathLink({ path, cluster, className }: Props) {
  const url = toHueUrl(path, cluster)
  if (!url) return <TruncateTip>{path}</TruncateTip>

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
      <FolderIcon className="size-3 shrink-0" />
      <TruncateTip>{path}</TruncateTip>
    </Link>
  )
}
