import { FieldTable, SectionCard } from "@/components/shared/detail-section"
import { ActivityIcon } from "lucide-react"
import { EventIdBadge } from "@/components/shared/event-id-badge"
import { FeatureViewNameLink } from "@/components/shared/feature-view-name-link"
import { EnumBadges } from "@/components/shared/enum-badges"
import { ActorBadge } from "@/components/shared/actor-badge"
import { ExecutionSection } from "@/components/shared/execution-section"
import { display } from "@/lib/display"
import type { FeatureViewEvent, Execution } from "@/lib/meta-client"

export function FeatureViewEventDetail({
  data,
  executions = [],
  cluster,
}: {
  data: FeatureViewEvent
  executions?: Execution[]
  // The featureView location's hadoop_cluster, fetched by the page — the execution ran on that
  // cluster's YARN, so the RM proxy link follows it.
  cluster?: string
}) {
  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Feature View Event" icon={ActivityIcon}>
        <FieldTable
          rows={[
            { label: "feature_view_event_id", value: <EventIdBadge eventId={data.feature_view_event_id} /> },
            // kind 가 주어보다 앞이다 — 이벤트가 무엇에 대한 것인지는 kind 가 정한다.
            {
              label: "event_kind",
              value: <EnumBadges set="featureViewEventKind" value={data.event_kind} />,
            },
            {
              label: "feature_view_name",
              value: (
                <FeatureViewNameLink
                  featureViewName={data.feature_view_name}
                  href={`/feature-view-events?feature_view_name=${encodeURIComponent(data.feature_view_name)}`}
                />
              ),
            },
            { label: "status", value: <EnumBadges set="eventStatus" value={data.status} /> },
            {
              label: "actor",
              value: data.actor ? <ActorBadge actor={data.actor} /> : display(undefined),
            },
            { label: "submitted_at", value: data.submitted_at },
            {
              label: "succeeded_at",
              value: display(data.succeeded_at),
              label2: "failed_at",
              value2: display(data.failed_at),
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
      <ExecutionSection executions={executions} cluster={cluster} />
    </div>
  )
}
