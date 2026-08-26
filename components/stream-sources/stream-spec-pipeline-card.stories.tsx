import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { StreamSpecPipelineCard } from "@/components/stream-sources/stream-spec-pipeline-card"
import type { StreamSpecDetailData } from "@/components/stream-sources/stream-spec-detail"

const meta: Meta<typeof StreamSpecPipelineCard> = {
  title: "Feature Store/StreamSpecPipelineCard",
  component: StreamSpecPipelineCard,
  parameters: { layout: "padded" },
}
export default meta
type Story = StoryObj<typeof StreamSpecPipelineCard>

const base: StreamSpecDetailData = {
  featureName: "recent_click_items",
  entityName: "identity",
  inputBroker: "broker-a.example.net:9092",
  inputTopic: "raw-click-events",
  consumerGroup: "feature-store-ad-click-recent",
  inputSchema: "click_event.avsc",
  keyPath: "$.user.identity",
  valuePath: "$.ad.creative_id",
  eventTsPath: "$.ts",
  eventTsFormat: "unix_millis",
  aggregationType: "list",
  dedupOnOutput: true,
  maxWindowSeconds: 604800,
  maxWindowItems: 100,
  outputBroker: "broker-b.example.net:9092",
  outputTopic: "feature-store.feature.ad_click_recent",
  createdAt: "2026-07-01T10:00:00+09:00",
  updatedAt: "2026-07-20T10:00:00+09:00",
}

// LIST + reaction filter + all identity paths + dedup on.
export const ListWithConsent: Story = {
  name: "List + reaction filter",
  args: {
    data: {
      ...base,
      identityFilterType: "reaction",
      identityFallbackPath: "$.user.is_fallback",
      filterFlagsPath: "$.user.flags",
      publisherFilterPath: "$.ctx.publisher",
    },
  },
}

// MAP, no filter, sampling on, dedup irrelevant.
export const MapSampled: Story = {
  name: "Map + partition sampling",
  args: {
    data: {
      ...base,
      featureName: "last_seen_creative_by_slot",
      keyPath: "$.user.id",
      valuePath: "$.slot.id",
      eventTsFormat: "unix_seconds",
      aggregationType: "map",
      dedupOnOutput: false,
      samplePartition: "4",
      maxWindowSeconds: 3600,
      maxWindowItems: 50,
    },
  },
}
