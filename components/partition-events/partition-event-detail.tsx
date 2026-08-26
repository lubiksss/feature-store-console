import { FieldTable, SectionCard } from "@/components/shared/detail-section"
import { ActivityIcon } from "lucide-react"
import { EventIdBadge } from "@/components/shared/event-id-badge"
import { FeatureViewNameLink } from "@/components/shared/feature-view-name-link"
import { EnumBadges } from "@/components/shared/enum-badges"
import { PartitionExecutionCards } from "@/components/shared/execution-section"
import { PartitionResultSection } from "@/components/partition-events/partition-result-section"
import { display } from "@/lib/display"
import type {
  PartitionEvent,
  Execution,
  PartitionMaterializationResult,
  PartitionConsistencyResult,
} from "@/lib/meta-client"

interface Props {
  data: PartitionEvent
  materializationResult?: PartitionMaterializationResult | null
  consistencyResult?: PartitionConsistencyResult | null
  executions?: Execution[]
  // The featureView location's hadoop_cluster, fetched by the page. Storage paths and the YARN RM
  // proxy both live on that cluster, so it is threaded to the result and execution cards.
  cluster?: string
}

export function PartitionEventDetail({
  data,
  materializationResult,
  consistencyResult,
  executions = [],
  cluster,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Partition Event" icon={ActivityIcon}>
        <FieldTable
          rows={[
            {
              label: "partition_event_id",
              value: <EventIdBadge eventId={data.partition_event_id} />,
            },
            {
              label: "feature_view_name",
              value: (
                <FeatureViewNameLink
                  featureViewName={data.feature_view_name}
                  href={`/partition-events?feature_view_name=${encodeURIComponent(data.feature_view_name)}`}
                />
              ),
            },
            {
              label: "dt",
              value: data.partition.dt,
              label2: "hr",
              value2: display(data.partition.hr),
              label3: "min",
              value3: display(data.partition.min),
            },
            { label: "segment", value: display(data.partition.segment || undefined) },
            { label: "status", value: <EnumBadges set="partitionStatus" value={data.status} /> },
            { label: "materialization_submitted_at", value: data.materialization_submitted_at },
            {
              label: "materialization_succeeded_at",
              value: display(data.materialization_succeeded_at),
              label2: "materialization_failed_at",
              value2: display(data.materialization_failed_at),
            },
            { label: "consistency_submitted_at", value: display(data.consistency_submitted_at) },
            {
              label: "consistency_succeeded_at",
              value: display(data.consistency_succeeded_at),
              label2: "consistency_failed_at",
              value2: display(data.consistency_failed_at),
            },
            {
              label: "updated_at",
              value: data.updated_at,
              label2: "created_at",
              value2: data.created_at,
            },
          ]}
        />
      </SectionCard>
      <PartitionResultSection
        materialization={materializationResult}
        consistency={consistencyResult}
        cluster={cluster}
      />
      <PartitionExecutionCards executions={executions} cluster={cluster} />
    </div>
  )
}
