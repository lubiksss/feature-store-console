import { readList } from "@/lib/read-failure"
import { listFeatureViewProfiles, PAGE_SIZE } from "@/lib/meta-client"
import { eligibleSourceOptions } from "@/lib/feature-view-list"
import { toFeatureViewProfileRow } from "@/components/feature-view-profiles/feature-view-profile-mappers"
import { FeatureViewProfileTableClient } from "@/components/feature-view-profiles/feature-view-profile-table-client"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"

// fs_feature_view_profile — flat per-field profiling list. Row click → the field's full stats.
export default async function FeatureViewProfilesPage() {
  const offset = 0

  // Every profile list filter is an IN-list (multi-select), including the partition coords and
  // field_path.
  const [listed, sourceOptions] = await Promise.all([
    readList(
      listFeatureViewProfiles({
        limit: PAGE_SIZE,
        offset,
        feature_view_name: undefined,
        dt: undefined,
        hr: undefined,
        min: undefined,
        segment: undefined,
        field_path: undefined,
        field_type: undefined,
      }),
    ),
    eligibleSourceOptions(),
  ])

  const items = (listed.data?.items ?? []).map(toFeatureViewProfileRow)

  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Feature View Profiles" }]} />
      <PageMain variant="list">
        <FeatureViewProfileTableClient
          data={items}
          sourceOptions={sourceOptions}
          limit={listed.data?.pagination.limit ?? PAGE_SIZE}
          offset={listed.data?.pagination.offset ?? offset}
          total={listed.data?.pagination.total ?? 0}
          failure={listed.failure}
          filtered={false}
          className="flex-1 min-h-0"
        />
      </PageMain>
    </>
  )
}
