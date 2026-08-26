import { readList } from "@/lib/read-failure"
import { canEdit } from "@/lib/auth"
import { listIngestionSpecs, PAGE_SIZE } from "@/lib/meta-client"
import { eligibleSourceOptions } from "@/lib/feature-view-list"
import { toIngestionSpecRow } from "@/components/ingestion-specs/ingestion-spec-mappers"
import { IngestionSpecTableClient } from "@/components/ingestion-specs/ingestion-spec-table-client"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"

export default async function IngestionSpecsPage() {
  const offset = 0

  const [listed, sourceOptions] = await Promise.all([
    readList(
      listIngestionSpecs({
        limit: PAGE_SIZE,
        offset,
        feature_view_name: undefined,
      }),
    ),
    eligibleSourceOptions(),
  ])

  const items = (listed.data?.items ?? []).map(toIngestionSpecRow)
  const editable = await canEdit()

  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Ingestion Specs" }]} />
      <PageMain variant="list">
        <IngestionSpecTableClient
          data={items}
          sourceOptions={sourceOptions}
          limit={listed.data?.pagination.limit ?? PAGE_SIZE}
          offset={listed.data?.pagination.offset ?? offset}
          total={listed.data?.pagination.total ?? 0}
          addHref="/ingestion-specs/add"
          canEdit={editable}
          failure={listed.failure}
          filtered={false}
          className="flex-1 min-h-0"
        />
      </PageMain>
    </>
  )
}
