import { FieldTable, SectionCard } from "@/components/shared/detail-section"
import { StoreNameLink } from "@/components/shared/online-store-name-link"
import { EntityNameLink } from "@/components/shared/entity-name"
import { ActivityIcon } from "lucide-react"
import { EventIdBadge } from "@/components/shared/event-id-badge"
import { EnumBadges } from "@/components/shared/enum-badges"
import { ActorBadge } from "@/components/shared/actor-badge"
import { ExecutionSection } from "@/components/shared/execution-section"
import { display } from "@/lib/display"
import type { StoreEvent, Execution } from "@/lib/meta-client"

// One store-profiling run. No feature_view_name: the subject is the STORE, narrowed by an entity
// coordinate. The key set it read is not here — that is the entity's property, and a copy on
// the event would be a second answer a later edit of the entity could contradict. What that
// costs is stated in the ticket: after such an edit, which table a PAST run read is no longer
// recoverable.
export function StoreEventDetail({
  data,
  executions = [],
}: {
  data: StoreEvent
  executions?: Execution[]
}) {
  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Store Event" icon={ActivityIcon}>
        <FieldTable
          rows={[
            { label: "store_event_id", value: <EventIdBadge eventId={data.store_event_id} /> },
            // kind 가 주어보다 앞이다 — 이벤트가 무엇에 대한 것인지는 kind 가 정한다.
            {
              label: "event_kind",
              value: <EnumBadges set="storeEventKind" value={data.event_kind} />,
            },
            {
              label: "store_name",
              value: (
                <StoreNameLink
                  storeName={data.store_name}
                  href={`/online-store-events?store_name=${encodeURIComponent(data.store_name)}`}
                />
              ),
            },
            {
              label: "store_kind",
              value: <EnumBadges set="storeKind" value={data.store_kind} />,
            },
            {
              // 대상에 엮이지 않는 런은 좌표가 빈 문자열이고, 그 표기는 없음의 표기와 같은
              // "-" 다. 이 화면만의 설명을 값 자리에 넣지 않는다.
              label: "entity_name",
              value:
                data.entity_name === "" ? (
                  display(undefined)
                ) : (
                  <EntityNameLink
                    entityName={data.entity_name}
                    href={`/online-store-events?entity_name=${encodeURIComponent(data.entity_name)}`}
                  />
                ),
            },
            {
              label: "status",
              value: (
                <EnumBadges
                  set="eventStatus"
                  value={data.status}
                  selectedHref={`/online-store-events?status=${data.status}`}
                />
              ),
            },
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
      {/* 런이 어느 클러스터에서 돌았는지는 이 행이 알지 못한다 — 키 집합의 속성이고 그건
          대상이 갖는다. YARN 링크는 클러스터를 모르면 그리지 않는다. */}
      <ExecutionSection executions={executions} />
    </div>
  )
}
