"use client"

import Link from "next/link"
import { CpuIcon } from "lucide-react"
import { TruncateTip } from "@/components/shared/truncate-tip"
import { yarnProxyHref } from "@/lib/catalog-enums"
import { cn } from "@/lib/utils"

interface Props {
  applicationId: string
  // The featureView location's hadoop_cluster — the app ran on THAT cluster's RM, so the proxy
  // host follows it. Unset (every pre-secondary featureView) resolves to hadoop-primary.
  cluster?: string
  className?: string
}

export function YarnLink({ applicationId, cluster, className }: Props) {
  const href = yarnProxyHref(cluster, applicationId)
  if (!href) return <TruncateTip>{applicationId}</TruncateTip>

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "inline-flex min-w-0 max-w-full items-center gap-1 hover:text-foreground hover:underline transition-colors",
        className,
      )}
    >
      <CpuIcon className="size-3 shrink-0" />
      <TruncateTip>{applicationId}</TruncateTip>
    </Link>
  )
}
