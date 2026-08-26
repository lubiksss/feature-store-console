import { FieldTable, SectionCard } from "@/components/shared/detail-section"
import { StoreNameLink } from "@/components/shared/online-store-name-link"
import { EntityNameLink } from "@/components/shared/entity-name"
import { TableIcon } from "lucide-react"
import { EnumBadges, FieldTypeBadge } from "@/components/shared/enum-badges"
import { CountValue } from "@/components/shared/count-value"
import { InfoTooltip } from "@/components/shared/info-tooltip"
import { PROFILE_INFO } from "@/lib/catalog-enums"
import { ProfileStatsSection } from "@/components/shared/profile-stats-section"
import type { StoreProfile } from "@/lib/meta-client"

// One observed node — its identity plus the statistics, rendered by the SAME panel the
// featureView profile detail uses. The two planes report one set of columns, so one component
// draws both; a second copy would drift the moment either side gains a statistic.
export function StoreProfileDetail({ data }: { data: StoreProfile }) {
  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Field" icon={TableIcon}>
        <FieldTable
          rows={[
            // 상세는 어휘 전체를 스트립으로 그린다 — 값 하나만 보여주면 이 값이 어떤 어휘의
            // 어디쯤인지 읽히지 않는다. store_kind 가 한 값이던 동안에는 스트립이나 단일
            // 뱃지나 화면이 같았지만, 온라인 스토어가 둘이 된 뒤로는 갈린다. 두 스토어를 나란히
            // 읽는 것이 이 평면의 목적이므로 여기가 특히 스트립이어야 한다.
            {
              label: "store_name",
              value: (
                <StoreNameLink
                  storeName={data.store_name}
                  href={`/online-store-profiles?store_name=${encodeURIComponent(data.store_name)}`}
                />
              ),
            },
            {
              label: "store_kind",
              value: (
                <EnumBadges
                  set="storeKind"
                  value={data.store_kind}
                  selectedHref={`/online-store-profiles?store_kind=${data.store_kind}`}
                />
              ),
              label2: "entity_name",
              value2: (
                <EntityNameLink
                  entityName={data.entity_name}
                  href={`/online-store-profiles?entity_name=${encodeURIComponent(data.entity_name)}`}
                />
              ),
            },
            // The run's denominators — the whole world this result saw. Every rate on the row is
            // read against them: row_count alone cannot say whether 40 is broad coverage of a
            // small sample or a rare field.
            {
              label: (
                <span className="flex items-center justify-between gap-1.5">
                  keys_requested
                  <InfoTooltip text={PROFILE_INFO.keys_requested} />
                </span>
              ),
              value: <CountValue value={data.keys_requested} />,
              label2: (
                <span className="flex items-center justify-between gap-1.5">
                  keys_with_field
                  <InfoTooltip text={PROFILE_INFO.keys_with_field} />
                </span>
              ),
              value2: <CountValue value={data.keys_with_field} />,
            },
            // field_name is the observed store field and can be long; field_path/field_type
            // describe the node WITHIN it, so they read as a pair below rather than as two
            // more columns beside it.
            {
              label: (
                <span className="flex items-center justify-between gap-1.5">
                  field_name
                  <InfoTooltip text={PROFILE_INFO.field_name} />
                </span>
              ),
              value: data.field_name,
            },
            {
              label: (
                <span className="flex items-center justify-between gap-1.5">
                  field_path
                  <InfoTooltip text={PROFILE_INFO.field_path} />
                </span>
              ),
              value: data.field_path,
              label2: (
                <span className="flex items-center justify-between gap-1.5">
                  field_type
                  <InfoTooltip text={PROFILE_INFO.field_type} />
                </span>
              ),
              value2: <FieldTypeBadge value={data.field_type} listPath="/online-store-profiles" />,
            },
            { label: "created_at", value: data.created_at },
          ]}
        />
      </SectionCard>
      <ProfileStatsSection data={data} />
    </div>
  )
}
