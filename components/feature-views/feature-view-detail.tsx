import { OwnerBadges } from "@/components/shared/owner-badge"
import { EntityNameLink } from "@/components/shared/entity-name"
import { EnumBadges } from "@/components/shared/enum-badges"
import { FeatureViewActionsMenu } from "@/components/feature-views/feature-view-actions-menu"
import { FieldTable, SectionCard } from "@/components/shared/detail-section"
import { ListAddMenu } from "@/components/shared/list-add-menu"
import { LocationFields, type LocationData } from "@/components/batch-sources/location-fields"
import { LocationActionsMenu } from "@/components/batch-sources/location-actions-menu"
import { ResourceActionsMenu } from "@/components/shared/resource-actions-menu"
import {
  FeatureViewStoreFields,
  type FeatureViewStoreMembership,
} from "@/components/feature-view-stores/feature-view-store-fields"
import { BoxesIcon, DatabaseIcon, MapPinIcon } from "lucide-react"
import { InfoTooltip } from "@/components/shared/info-tooltip"
import { PRODUCER_INFO } from "@/lib/catalog-enums"
import { display } from "@/lib/display"
import { DurationValue } from "@/components/shared/duration-value"
import type { AvailableActions } from "@/lib/meta-client"

export interface FeatureViewDetailData {
  featureViewName: string
  featureName: string
  entityName: string
  producer: string
  owner: string
  description?: string
  ttlSeconds?: number
  lifecycleStatus: string
  baselineEpochAt: string
  createdAt: string
  updatedAt: string
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  data: FeatureViewDetailData
  canEdit?: boolean
  // 지금 이 피처 뷰로 가능한 것 (서버의 오퍼). 액션 메뉴가 이것만 보고 활성/비활성을 정한다.
  actions: AvailableActions
  // 형상(satellite) 을 지금 쓸 수 있는가. 오퍼가 같이 실어 주므로 콘솔이 lifecycle_status 로
  // 추론하지 않는다 — 추론하면 그것이 또 하나의 규칙 사본이다.
  shapeEditable: boolean
  // The featureView's location (1:1 satellite keyed by feature_view_name). undefined = none yet; the cards
  // still render with every field as "-" and offer Add instead of Edit/Delete.
  location?: LocationData
  // 이 피처 뷰가 적재되는 스토어들(fs_feature_view_store). location 과 같은 위성이지만 1:1 이 아니라
  // 종류당 한 행이다.
  memberships?: FeatureViewStoreMembership[]
  // 카탈로그의 store_kind 전부. 카드의 행 집합이 이것이라 안 묶인 종류도 꺼진 뱃지로 남는다.
  storeKinds?: string[]
  // 종류 → 인스턴스 이름들. 꺼진 종류가 "묶이면 어디로 가는지"를 보여주는 데 쓴다.
  storeNamesByKind?: Record<string, string[]>
  // 서버 오리진 — 액션 메뉴의 API 문서 링크에 쓴다 (서버 env라 여기서 받아 내려준다).
  metaServerUrl?: string
}

export function FeatureViewDetail({
  data,
  canEdit = false,
  actions,
  shapeEditable,
  location,
  memberships = [],
  storeKinds = [],
  storeNamesByKind = {},
  metaServerUrl,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <SectionCard
        title="FeatureView"
        icon={BoxesIcon}
        action={
          <FeatureViewActionsMenu
            featureViewName={data.featureViewName}
            actions={actions}
            canEdit={canEdit}
            metaServerUrl={metaServerUrl}
          />
        }
      >
        <FieldTable
          rows={[
            { label: "feature_view_name", value: data.featureViewName },
            { label: "feature_name", value: data.featureName },
            {
              label: "entity_name",
              value: (
                <EntityNameLink
                  entityName={data.entityName}
                  href={`/feature-views?entity_name=${encodeURIComponent(data.entityName)}`}
                />
              ),
            },
            {
              label: (
                <span className="flex items-center justify-between gap-1.5">
                  producer
                  <InfoTooltip text={PRODUCER_INFO} />
                </span>
              ),
              value: <EnumBadges set="producer" value={data.producer} />,
            },
            { label: "owner", value: <OwnerBadges owner={data.owner} listPath="/feature-views" /> },
            {
              label: "lifecycle_status",
              value: <EnumBadges set="featureViewLifecycle" value={data.lifecycleStatus} />,
            },
            { label: "baseline_epoch_at", value: data.baselineEpochAt },
            { label: "description", value: display(data.description), multiline: true },
            {
              label: "ttl_seconds",
              value:
                data.ttlSeconds != null ? (
                  <DurationValue raw={data.ttlSeconds} totalSeconds={data.ttlSeconds} />
                ) : (
                  display(undefined)
                ),
            },
            {
              label: "updated_at",
              value: data.updatedAt,
              label2: "created_at",
              value2: data.createdAt,
            },
          ]}
        />
      </SectionCard>

      {/* Location is a satellite of this featureView, not its own resource — it reads here rather
          than on a separate page. Both cards render whether or not a location exists. */}
      <SectionCard
        title="Location"
        icon={MapPinIcon}
        action={
          // 형상 쓰기는 서버가 draft 에서만 받는다(오퍼의 shape_editable). 그래서 Edit/Add 를
          // 그 값으로 함께 잠근다 — 열어두면 폼을 다 채운 뒤 저장에서 409 를 만난다. 피처 뷰 카드의
          // Edit 은 owner/description(주석)이라 잠기지 않는다.
          location ? (
            <LocationActionsMenu featureViewName={data.featureViewName} canEdit={canEdit && shapeEditable} />
          ) : (
            <ListAddMenu
              addHref={`/feature-views/${encodeURIComponent(data.featureViewName)}/location/add`}
              canEdit={canEdit && shapeEditable}
            />
          )
        }
      >
        <LocationFields featureViewName={data.featureViewName} location={location} />
      </SectionCard>

      {/* 멤버십도 이 피처 뷰의 위성이다: 값이 어디로 가는가. location 과 같은 자리에 두고, 쓰기도
          같은 shape_editable 로 잠근다 — 서버가 draft 에서만 받으므로(CanMutateShape) 열어두면
          폼을 다 채운 뒤 409 를 만난다. */}
      <SectionCard
        title="Online Stores"
        icon={DatabaseIcon}
        action={
          // Add 가 아니라 Edit 하나다: 종류를 하나씩 더하는 화면이 아니라 "어느 종류에
          // 묶이는가"를 함께 정하는 화면이고, 없는 종류도 카드에 이미 행으로 있다.
          <ResourceActionsMenu
            editHref={`/feature-views/${encodeURIComponent(data.featureViewName)}/stores/edit`}
            canEdit={canEdit && shapeEditable}
            resourceLabel="online stores"
          />
        }
      >
        <FeatureViewStoreFields
          storeKinds={storeKinds}
          storeNamesByKind={storeNamesByKind}
          memberships={memberships}
        />
      </SectionCard>
    </div>
  )
}
