import { FieldTable, SectionCard } from "@/components/shared/detail-section"
import { ProfileStatsSection } from "@/components/shared/profile-stats-section"
import { TableIcon } from "lucide-react"
import { FeatureViewNameLink } from "@/components/shared/feature-view-name-link"
import { FieldTypeBadge } from "@/components/shared/enum-badges"
import { display } from "@/lib/display"
import { InfoTooltip } from "@/components/shared/info-tooltip"
import { PROFILE_INFO } from "@/lib/catalog-enums"
import type { FeatureViewProfile } from "@/lib/meta-client"

// L4: a single profiled field — its identity (featureView/partition/field) + full stats.
export function FeatureViewProfileDetail({ data }: { data: FeatureViewProfile }) {
  const p = data.partition
  return (
    <div className="flex flex-col gap-4">
      <SectionCard title="Field" icon={TableIcon}>
        <FieldTable
          rows={[
            {
              label: "feature_view_name",
              value: (
                <FeatureViewNameLink
                  featureViewName={data.feature_view_name}
                  href={`/feature-view-profiles?feature_view_name=${encodeURIComponent(data.feature_view_name)}`}
                />
              ),
            },
            {
              label: "dt",
              value: p.dt,
              label2: "hr",
              value2: display(p.hr),
              label3: "min",
              value3: display(p.min),
            },
            { label: "segment", value: display(p.segment || undefined) },
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
              value2: <FieldTypeBadge value={data.field_type} />,
            },
            { label: "created_at", value: data.created_at },
          ]}
        />
      </SectionCard>
      <ProfileStatsSection data={data} />
    </div>
  )
}
