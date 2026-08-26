import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ActivityIcon, BoxesIcon, ListIcon } from "lucide-react"
import {
  DashboardMetricCard,
  type DashboardMetricLinkGroup,
  type DashboardMetricLinkItem,
} from "@/components/dashboard/dashboard-metric-card"

// partition events 링크그룹: all → mat_sub → mat_suc → con_sub → con_suc → failed
function partitionEventsItems(total: number, counts: number[]): DashboardMetricLinkItem[] {
  const at = (i: number) => counts[i] ?? 0
  return [
    {
      key: "all",
      href: "/partition-events?updated_within=2d",
      value: total,
      badge: { kind: "icon", icon: ListIcon, label: "all" },
    },
    {
      key: "materialization_submitted",
      href: "/partition-events?status=materialization_submitted&updated_within=2d",
      value: at(0),
      badge: {
        kind: "enum",
        set: "partitionStatus",
        value: "materialization_submitted",
        postfix: true,
      },
    },
    {
      key: "materialization_succeeded",
      href: "/partition-events?status=materialization_succeeded&updated_within=2d",
      value: at(1),
      badge: {
        kind: "enum",
        set: "partitionStatus",
        value: "materialization_succeeded",
        postfix: true,
      },
    },
    {
      key: "consistency_submitted",
      href: "/partition-events?status=consistency_submitted&updated_within=2d",
      value: at(3),
      badge: {
        kind: "enum",
        set: "partitionStatus",
        value: "consistency_submitted",
        postfix: true,
      },
    },
    {
      key: "consistency_succeeded",
      href: "/partition-events?status=consistency_succeeded&updated_within=2d",
      value: at(4),
      badge: {
        kind: "enum",
        set: "partitionStatus",
        value: "consistency_succeeded",
        postfix: true,
      },
    },
    {
      key: "failed",
      href: "/partition-events?status=materialization_failed&status=consistency_failed&updated_within=2d",
      value: at(2) + at(5),
      badge: {
        kind: "enum",
        set: "partitionStatus",
        value: "materialization_failed",
        postfix: true,
        title: "materialization_failed, consistency_failed",
      },
    },
  ]
}

const partitionLinkGroup: DashboardMetricLinkGroup = {
  key: "partition-event",
  title: "Partition events",
  icon: ActivityIcon,
  ariaLabel: "Partition event status",
  items: partitionEventsItems(120, [3, 80, 1, 2, 33, 1]),
}

const lifecycleLinkGroup: DashboardMetricLinkGroup = {
  key: "feature-view-lifecycle",
  title: "FeatureView lifecycle",
  icon: BoxesIcon,
  ariaLabel: "FeatureView lifecycle status",
  items: [
    {
      key: "all",
      href: "/feature-views",
      value: 10,
      badge: { kind: "icon", icon: ListIcon, label: "all" },
    },
    {
      key: "draft",
      href: "/feature-views?lifecycle_status=draft",
      value: 0,
      badge: { kind: "enum", set: "featureViewLifecycle", value: "draft" },
    },
    {
      key: "active",
      href: "/feature-views?lifecycle_status=active",
      value: 10,
      badge: { kind: "enum", set: "featureViewLifecycle", value: "active" },
    },
    {
      key: "suspended",
      href: "/feature-views?lifecycle_status=suspended",
      value: 0,
      badge: { kind: "enum", set: "featureViewLifecycle", value: "suspended" },
    },
    {
      key: "retired",
      href: "/feature-views?lifecycle_status=retired",
      value: 0,
      badge: { kind: "enum", set: "featureViewLifecycle", value: "retired" },
    },
    {
      key: "failed",
      href: "/feature-views?lifecycle_status=validation_failed&lifecycle_status=retirement_failed",
      value: 0,
      badge: {
        kind: "enum",
        set: "featureViewLifecycle",
        value: "validation_failed",
        postfix: true,
        title: "validation_failed, retirement_failed",
      },
    },
  ],
}

const meta: Meta<typeof DashboardMetricCard> = {
  title: "Feature Store/DashboardMetricCard",
  component: DashboardMetricCard,
  parameters: { layout: "padded" },
  args: {
    panels: [{ title: "Active feature-views", src: "about:blank" }],
    linkGroups: [lifecycleLinkGroup],
  },
}
export default meta
type Story = StoryObj<typeof DashboardMetricCard>

export const FeatureViewLifecycle: Story = {
  args: {
    className: "shrink-0",
  },
}

export const PartitionEvents: Story = {
  args: {
    className: "shrink-0",
    panels: [{ title: "Partition events", src: "about:blank" }],
    linkGroups: [partitionLinkGroup],
  },
}

export const TwoDayPanels: Story = {
  args: {
    className: undefined,
    panels: [
      { title: "Running events", src: "about:blank" },
      { title: "Running executions", src: "about:blank" },
      { title: "Consistency score", src: "about:blank" },
    ],
    linkGroups: undefined,
  },
}
