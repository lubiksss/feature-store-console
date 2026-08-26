import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { EntityNameBadge } from "@/components/shared/entity-name"
import { StoreNameBadge } from "@/components/shared/online-store-name-link"
import { FeatureViewNameBadge } from "@/components/shared/feature-view-name-link"
import { EnumBadge, FieldTypeBadge } from "@/components/shared/enum-badges"
import { ActorBadge } from "@/components/shared/actor-badge"
import { EventIdBadge } from "@/components/shared/event-id-badge"
import { ConsistencyScoreBadge } from "@/components/shared/consistency-score-badge"
import { OwnerBadges } from "@/components/shared/owner-badge"
import { ActionBadge } from "@/components/guide/action-badge"
import { BadgeCheckIcon, PauseIcon, ArchiveIcon } from "lucide-react"

const meta: Meta = {
  title: "Feature Store/Atoms",
  parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  )
}

export const AllAtoms: Story = {
  name: "All Atoms",
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      <Group label="action (피처 뷰 상세 액션 메뉴, 가이드 도식)">
        <ActionBadge icon={BadgeCheckIcon} text="Validate" />
        <ActionBadge icon={PauseIcon} text="Pause" />
        <ActionBadge icon={ArchiveIcon} text="Retire" />
      </Group>

      <Group label="lifecycle_status (fs_feature_view)">
        <EnumBadge set="featureViewLifecycle" value="draft" />
        <EnumBadge set="featureViewLifecycle" value="active" />
        <EnumBadge set="featureViewLifecycle" value="suspended" />
        <EnumBadge set="featureViewLifecycle" value="retired" />
        <EnumBadge set="featureViewLifecycle" value="validation_failed" />
        <EnumBadge set="featureViewLifecycle" value="retirement_failed" />
      </Group>

      <Group label="status (fs_partition_event)">
        <EnumBadge set="partitionStatus" value="materialization_submitted" />
        <EnumBadge set="partitionStatus" value="materialization_succeeded" />
        <EnumBadge set="partitionStatus" value="materialization_failed" />
        <EnumBadge set="partitionStatus" value="consistency_submitted" />
        <EnumBadge set="partitionStatus" value="consistency_succeeded" />
        <EnumBadge set="partitionStatus" value="consistency_failed" />
      </Group>

      <Group label="event_kind (fs_execution)">
        <EnumBadge set="eventKind" value="ingestion" />
        <EnumBadge set="eventKind" value="materialization" />
        <EnumBadge set="eventKind" value="consistency" />
        <EnumBadge set="eventKind" value="validation" />
        <EnumBadge set="eventKind" value="retirement" />
        <EnumBadge set="eventKind" value="profiling" />
      </Group>

      <Group label="event_kind (fs_feature_view_event)">
        <EnumBadge set="featureViewEventKind" value="validation" />
        <EnumBadge set="featureViewEventKind" value="retirement" />
        <EnumBadge set="featureViewEventKind" value="ingestion" />
        <EnumBadge set="featureViewEventKind" value="profiling" />
      </Group>

      <Group label="status (EventStatusEnum)">
        <EnumBadge set="eventStatus" value="submitted" />
        <EnumBadge set="eventStatus" value="succeeded" />
        <EnumBadge set="eventStatus" value="failed" />
      </Group>

      <Group label="event_kind (triggerable: ingestion/profiling)">
        <EnumBadge set="schedulableEventKind" value="ingestion" />
        <EnumBadge set="schedulableEventKind" value="profiling" />
      </Group>

      <Group label="schedule_enabled">
        <EnumBadge set="bool" value="true" />
        <EnumBadge set="bool" value="false" />
      </Group>

      {/* 카탈로그 이름 셋은 한 형식이다: 리소스 타입 아이콘 + 이름. 값마다 아이콘이 다른
          enum 칩과 다르다 — 어휘가 아니라 이름이라 언제든 늘어난다. */}
      <Group label="catalog names">
        <FeatureViewNameBadge featureViewName="recent_click_items_user" />
        <EntityNameBadge entityName="query_norm" />
        <StoreNameBadge storeName="demo-fs" />
      </Group>

      <Group label="hadoop_cluster">
        <EnumBadge set="hadoopCluster" value="hadoop-secondary" />
        <EnumBadge set="hadoopCluster" value="hadoop-primary" />
      </Group>

      <Group label="producer">
        <EnumBadge set="producer" value="batch" />
        <EnumBadge set="producer" value="stream" />
        <EnumBadge set="producer" value="external" />
      </Group>

      <Group label="aggregation_type (stream_spec)">
        <EnumBadge set="aggregation" value="list" />
        <EnumBadge set="aggregation" value="map" />
      </Group>

      <Group label="identity_filter_type">
        <EnumBadge set="identityFilter" value="reaction" />
        <EnumBadge set="identityFilter" value="conversion" />
      </Group>

      <Group label="field_type (fs_feature_view_profile) — 구조 매칭, 마지막은 미지 타입 폴백">
        <FieldTypeBadge value="string" />
        <FieldTypeBadge value="bigint" />
        <FieldTypeBadge value="double" />
        <FieldTypeBadge value="decimal(38,18)" />
        <FieldTypeBadge value="boolean" />
        <FieldTypeBadge value="date" />
        <FieldTypeBadge value="timestamp" />
        <FieldTypeBadge value="array<string>" />
        <FieldTypeBadge value="array<bigint>" />
        <FieldTypeBadge value="map<string,bigint>" />
        <FieldTypeBadge value="map<int,int>" />
        <FieldTypeBadge value="struct<a:int,b:string>" />
        <FieldTypeBadge value="array<map<string,string>>" compact />
        <FieldTypeBadge value="array<array<string>>" compact />
        <FieldTypeBadge value="binary" />
      </Group>

      <Group label="mode (materialization_result)">
        <EnumBadge set="mode" value="dump" />
        <EnumBadge set="mode" value="diff" />
      </Group>

      <Group label="consistency score (≥80 green / ≥50 yellow / <50 red)">
        <ConsistencyScoreBadge score={100} />
        <ConsistencyScoreBadge score={87.5} />
        <ConsistencyScoreBadge score={72.4} />
        <ConsistencyScoreBadge score={41} />
        <ConsistencyScoreBadge score={null} />
      </Group>

      {/* 사람 뱃지는 프로필 이미지를 앞에 붙인다. Storybook에는 프록시 라우트가 없어 사진이 늘
          404로 떨어지므로, 여기 보이는 모습이 곧 사진 없는 계정의 fallback이다. */}
      <Group label="EventId / Actor / Owner">
        <EventIdBadge eventId={10042} />
        <ActorBadge actor="jake.0208" />
        <ActorBadge actor="system" />
        <OwnerBadges owner="jake.0208" listPath="/feature-views" />
        <OwnerBadges owner="jake.0208, alice.kim, bob.lee" listPath="/feature-views" collapse />
        <OwnerBadges owner="jake.0208, alice.kim, bob.lee" listPath="/feature-views" />
      </Group>
    </div>
  ),
}
