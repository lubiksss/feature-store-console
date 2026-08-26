import { canEdit } from "@/lib/auth"
import { loadFeatureViewList } from "@/lib/feature-view-list"
import { entityNameOptions } from "@/lib/entity-list"
import { toFeatureViewRow } from "@/components/feature-views/feature-view-mappers"
import { FeatureViewTableClient } from "@/components/feature-views/feature-view-table-client"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"

export default async function SourcesPage() {
  const { featureViews, sourceOptions, failure, limit, offset, total } = await loadFeatureViewList({
    offset: 0,
    filters: {
      feature_view_name: undefined,
      entity_name: undefined,
      producer: undefined,
      owner: undefined,
      lifecycle_status: undefined,
    },
  })

  const items = featureViews.map(toFeatureViewRow)
  const entityOptions = await entityNameOptions().catch(() => [])

  const editable = await canEdit()

  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Feature Views" }]} />
      <PageMain variant="list">
        <FeatureViewTableClient
          data={items}
          sourceOptions={sourceOptions}
          entityOptions={entityOptions}
          limit={limit}
          offset={offset}
          total={total}
          addHref="/feature-views/add"
          canEdit={editable}
          failure={failure}
          filtered={false}
          className="flex-1 min-h-0"
        />
      </PageMain>
    </>
  )
}
