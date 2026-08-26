import { FieldTable, SectionCard, type FieldRow } from "@/components/shared/detail-section"
import { HardDriveUploadIcon, ShieldCheckIcon } from "lucide-react"
import { EventIdBadge } from "@/components/shared/event-id-badge"
import { EnumBadge } from "@/components/shared/enum-badges"
import { HdfsPathLink } from "@/components/shared/hdfs-path-link"
import { ConsistencyScoreBadge } from "@/components/shared/consistency-score-badge"
import { CountValue, BytesValue } from "@/components/shared/count-value"
import { display } from "@/lib/display"
import type { PartitionMaterializationResult, PartitionConsistencyResult } from "@/lib/meta-client"

// Materialization then Consistency, stacked full width. Both cards read the same way:
// a reference column beside the column that was actually observed —
// baseline|submitted for materialization, submitted|observed for consistency. Reading the
// pair down a row is what makes a partition rewritten after publication visible: the file
// manifest differs and the counts under it are empty.
//
// The consistency card takes its LEFT column from the materialization result, since both
// results describe the same partition_event and this component already holds them.
// Both cards show partition_event_id (the 1:1 link to the parent event) and ALWAYS render —
// empty ("-") until the result arrives.
export function PartitionResultSection({
  materialization,
  consistency,
  cluster,
}: {
  materialization?: PartitionMaterializationResult | null
  consistency?: PartitionConsistencyResult | null
  // The featureView location's hadoop_cluster — partition locations live on that cluster's storage,
  // so the filebrowser host follows it.
  cluster?: string
}) {
  const path = (p?: string | null) =>
    p ? <HdfsPathLink path={p} cluster={cluster} /> : display(undefined)
  const pair = (
    label: string,
    l: React.ReactNode,
    label2: string,
    r: React.ReactNode,
    multiline?: boolean,
  ): FieldRow => ({ label, value: l, label2, value2: r, multiline })

  return (
    <div className="grid gap-4">
      <SectionCard title="Materialization Result" icon={HardDriveUploadIcon}>
        <FieldTable
          labels="narrow"
          rows={[
            {
              label: "mode",
              value: materialization?.mode ? (
                <EnumBadge set="mode" value={materialization.mode} />
              ) : (
                display(undefined)
              ),
            },
            pair(
              "baseline_partition_event_id",
              materialization?.baseline_partition_event_id != null ? (
                <EventIdBadge
                  eventId={materialization.baseline_partition_event_id}
                  href={`/partition-events/${materialization.baseline_partition_event_id}`}
                />
              ) : (
                display(undefined)
              ),
              "partition_event_id",
              materialization?.partition_event_id != null ? (
                <EventIdBadge eventId={materialization.partition_event_id} />
              ) : (
                display(undefined)
              ),
            ),
            pair(
              "baseline_row_count",
              <CountValue value={materialization?.baseline_row_count} />,
              "submitted_row_count",
              <CountValue value={materialization?.submitted_row_count} />,
            ),
            pair(
              "baseline_partition_location",
              path(materialization?.baseline_partition_location),
              "submitted_partition_location",
              path(materialization?.submitted_partition_location),
            ),
            pair(
              "baseline_directory_mtime",
              display(materialization?.baseline_directory_mtime),
              "submitted_directory_mtime",
              display(materialization?.submitted_directory_mtime),
            ),
            pair(
              "baseline_data_file_count",
              <CountValue value={materialization?.baseline_data_file_count} />,
              "submitted_data_file_count",
              <CountValue value={materialization?.submitted_data_file_count} />,
            ),
            pair(
              "baseline_total_file_bytes",
              <BytesValue value={materialization?.baseline_total_file_bytes} />,
              "submitted_total_file_bytes",
              <BytesValue value={materialization?.submitted_total_file_bytes} />,
            ),
            pair(
              "baseline_latest_file_mtime",
              display(materialization?.baseline_latest_file_mtime),
              "submitted_latest_file_mtime",
              display(materialization?.submitted_latest_file_mtime),
            ),
            {
              label: "updated_count",
              value: <CountValue value={materialization?.updated_count} />,
            },
            { label: "created_at", value: display(materialization?.created_at) },
          ]}
        />
      </SectionCard>

      <SectionCard title="Consistency Result" icon={ShieldCheckIcon}>
        <FieldTable
          labels="narrow"
          rows={[
            { label: "score", value: <ConsistencyScoreBadge score={consistency?.score} /> },
            {
              label: "partition_event_id",
              value:
                consistency?.partition_event_id != null ? (
                  <EventIdBadge eventId={consistency.partition_event_id} />
                ) : (
                  display(undefined)
                ),
            },
            // What the publication reported beside what the check read. Equal rows mean the
            // score above describes the data that was actually published; differing rows are
            // why the score is empty — the partition was rewritten after publication.
            pair(
              "submitted_partition_location",
              path(materialization?.submitted_partition_location),
              "observed_partition_location",
              path(consistency?.observed_partition_location),
            ),
            pair(
              "submitted_directory_mtime",
              display(materialization?.submitted_directory_mtime),
              "observed_directory_mtime",
              display(consistency?.observed_directory_mtime),
            ),
            pair(
              "submitted_data_file_count",
              <CountValue value={materialization?.submitted_data_file_count} />,
              "observed_data_file_count",
              <CountValue value={consistency?.observed_data_file_count} />,
            ),
            pair(
              "submitted_total_file_bytes",
              <BytesValue value={materialization?.submitted_total_file_bytes} />,
              "observed_total_file_bytes",
              <BytesValue value={consistency?.observed_total_file_bytes} />,
            ),
            pair(
              "submitted_latest_file_mtime",
              display(materialization?.submitted_latest_file_mtime),
              "observed_latest_file_mtime",
              display(consistency?.observed_latest_file_mtime),
            ),
            // The counts sit UNDER the manifest pairs: the pairs say whether there was
            // anything valid to measure, and only then do the numbers mean anything.
            pair(
              "checked_count",
              <CountValue value={consistency?.checked_count} />,
              "matched_count",
              <CountValue value={consistency?.matched_count} />,
            ),
            { label: "created_at", value: display(consistency?.created_at) },
          ]}
        />
      </SectionCard>
    </div>
  )
}
