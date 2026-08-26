import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { PartitionResultSection } from "@/components/partition-events/partition-result-section"
import type { PartitionConsistencyResult, PartitionMaterializationResult } from "@/lib/meta-client"

// The two result cards of one partition, stacked the way the detail page renders them. Each
// card is a reference column beside an observed one — baseline|submitted, then
// submitted|observed — so the states below are read by comparing rows down the card, not by
// knowing which fields are allowed to be empty.
const meta: Meta<typeof PartitionResultSection> = {
  title: "Feature Store/PartitionResultSection",
  component: PartitionResultSection,
  parameters: { layout: "padded" },
}
export default meta
type Story = StoryObj<typeof PartitionResultSection>

const PARTITION = { dt: "2026-08-19", hr: "13", segment: "p_keytype=identity" }
const LOCATION =
  "hdfs://hadoop-primary/warehouse/fs_catalog.db/user_click_items_1h/dt=2026-08-19/hr=13/p_keytype=identity"

const materialization: PartitionMaterializationResult = {
  partition_event_id: 8213,
  feature_view_name: "recent_click_items_user",
  partition: PARTITION,
  mode: "diff",
  baseline_partition_event_id: 8154,
  baseline_row_count: 1180,
  submitted_row_count: 1204,
  updated_count: 96,
  submitted_partition_location: LOCATION,
  submitted_directory_mtime: "2026-08-19T04:12:33+09:00",
  submitted_data_file_count: 24,
  submitted_total_file_bytes: 183472912,
  submitted_latest_file_mtime: "2026-08-19T04:12:31+09:00",
  baseline_partition_location: LOCATION.replace("dt=2026-08-19", "dt=2026-08-18"),
  baseline_directory_mtime: "2026-08-18T04:11:02+09:00",
  baseline_data_file_count: 23,
  baseline_total_file_bytes: 179004121,
  baseline_latest_file_mtime: "2026-08-18T04:11:00+09:00",
  created_at: "2026-08-19T04:20:11+09:00",
}

// The check read exactly what was published, so it scored: the manifest rows agree pair by
// pair and the counts above them are filled.
export const Measured: Story = {
  args: {
    materialization,
    consistency: {
      partition_event_id: 8213,
      feature_view_name: "recent_click_items_user",
      partition: PARTITION,
      score: 99.4,
      checked_count: 1204,
      matched_count: 1197,
      observed_partition_location: LOCATION,
      observed_directory_mtime: "2026-08-19T04:12:33+09:00",
      observed_data_file_count: 24,
      observed_total_file_bytes: 183472912,
      observed_latest_file_mtime: "2026-08-19T04:12:31+09:00",
      created_at: "2026-08-19T05:02:44+09:00",
    } satisfies PartitionConsistencyResult,
  },
}

// The featureView was rewritten after publication. score/checked/matched are empty NOT because
// the check failed but because there was nothing valid to score — and the manifest rows say
// so out loud: more files, more bytes, a later mtime than what was published.
export const SourceMovedAfterPublication: Story = {
  name: "Feature view moved after publication",
  args: {
    materialization,
    consistency: {
      partition_event_id: 8213,
      feature_view_name: "recent_click_items_user",
      partition: PARTITION,
      observed_partition_location: LOCATION,
      observed_directory_mtime: "2026-08-19T09:40:02+09:00",
      observed_data_file_count: 31,
      observed_total_file_bytes: 201338880,
      observed_latest_file_mtime: "2026-08-19T09:39:58+09:00",
      created_at: "2026-08-19T10:02:44+09:00",
    } satisfies PartitionConsistencyResult,
  },
}

// The check ran against a partition with nothing to compare. checked_count 0 is a
// measurement — it is what separates this from the drift case above, where the counts are
// absent entirely.
export const NothingToCompare: Story = {
  name: "Nothing to compare",
  args: {
    materialization,
    consistency: {
      partition_event_id: 8213,
      feature_view_name: "recent_click_items_user",
      partition: PARTITION,
      checked_count: 0,
      matched_count: 0,
      observed_partition_location: LOCATION,
      observed_directory_mtime: "2026-08-19T04:12:33+09:00",
      observed_data_file_count: 24,
      observed_total_file_bytes: 183472912,
      observed_latest_file_mtime: "2026-08-19T04:12:31+09:00",
      created_at: "2026-08-19T05:02:44+09:00",
    } satisfies PartitionConsistencyResult,
  },
}

// Before either callback lands: both cards render with every row "-", which is a state of the
// partition, not a broken page.
export const AwaitingResults: Story = {
  name: "Awaiting results",
  args: { materialization: null, consistency: null },
}
