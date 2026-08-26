import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { EnumBadge, type EnumSet } from "@/components/shared/enum-badges"
import { GrafanaPanel } from "@/components/shared/grafana-panel"
import { IconBadge } from "@/components/shared/icon-badge"

type DashboardMetricLinkBadge =
  | {
      kind: "enum"
      set: EnumSet
      value: string
      postfix?: boolean
      title?: string
    }
  | {
      kind: "icon"
      icon: LucideIcon
      label: string
    }

export interface DashboardMetricLinkItem {
  key: string
  href: string
  value: number
  ariaLabel?: string
  badge: DashboardMetricLinkBadge
}

export interface DashboardMetricLinkGroup {
  key: string
  title: string
  icon?: LucideIcon
  ariaLabel?: string
  items: DashboardMetricLinkItem[]
}

export interface DashboardMetricPanel {
  title: string
  src: string
}

interface Props {
  panels?: DashboardMetricPanel[]
  linkGroups?: DashboardMetricLinkGroup[]
  className?: string
}

function LinkBadge({ badge }: { badge: DashboardMetricLinkBadge }) {
  if (badge.kind === "icon") {
    return <IconBadge icon={badge.icon}>{badge.label}</IconBadge>
  }

  // 행 전체가 같은 목적지의 링크라, 뱃지가 자기 링크를 또 만들면 <a> 안의 <a>가 된다.
  return (
    <EnumBadge
      set={badge.set}
      value={badge.value}
      postfix={badge.postfix}
      title={badge.title}
      link={false}
    />
  )
}

export function DashboardMetricCard({ panels, linkGroups, className }: Props) {
  const visiblePanels = panels ?? []
  const hasPanels = visiblePanels.length > 0
  const visibleLinkGroups = linkGroups?.filter((group) => group.items.length) ?? []
  const hasLinkGroups = visibleLinkGroups.length > 0
  const hasMultipleLinkGroups = visibleLinkGroups.length > 1
  if (!hasPanels && !hasLinkGroups) return null

  return (
    <Card className={className}>
      <CardContent
        className={cn(
          hasPanels && hasLinkGroups && "grid gap-4 xl:grid-cols-[auto_minmax(20rem,1fr)]",
        )}
      >
        {hasLinkGroups && (
          <div className={cn(hasMultipleLinkGroups && "grid gap-2 sm:grid-cols-2")}>
            {visibleLinkGroups.map((group) => (
              <nav
                key={group.key}
                aria-label={group.ariaLabel ?? group.title}
                className="space-y-2 rounded-lg border p-2"
              >
                <p className="flex items-center gap-1.5 px-1 text-sm font-semibold">
                  {group.icon && <group.icon className="size-4" aria-hidden="true" />}
                  {group.title}
                </p>
                <ul
                  className={cn(
                    "gap-2",
                    hasPanels || hasMultipleLinkGroups
                      ? "flex flex-col"
                      : "grid sm:grid-cols-2 xl:grid-cols-5",
                  )}
                >
                  {group.items.map((item) => (
                    <li key={item.key} className="min-w-0 flex-1">
                      <Link
                        href={item.href}
                        aria-label={item.ariaLabel}
                        className="flex min-h-11 items-center justify-between gap-2 rounded-md border px-2 py-1.5 outline-none transition-colors hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        <LinkBadge badge={item.badge} />
                        <span className="shrink-0 text-sm font-bold tabular-nums">
                          {item.value.toLocaleString()}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        )}
        {hasPanels && (
          <div className={cn("grid min-w-0 gap-4", visiblePanels.length > 1 && "lg:grid-cols-2")}>
            {visiblePanels.map((visiblePanel) => (
              <GrafanaPanel
                key={visiblePanel.title}
                title={visiblePanel.title}
                src={visiblePanel.src}
                className={cn(
                  visiblePanels.length > 1 && "lg:h-full",
                  hasLinkGroups && "h-full min-h-0 lg:h-full lg:min-h-0",
                )}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
