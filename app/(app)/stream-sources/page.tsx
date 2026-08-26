import { readList } from "@/lib/read-failure"
import { canEdit } from "@/lib/auth"
import { listStreamSources, PAGE_SIZE } from "@/lib/meta-client"
import { eligibleSourceOptions } from "@/lib/feature-view-list"
import { toStreamSpecRow } from "@/components/stream-sources/stream-spec-mappers"
import { StreamSpecTableClient } from "@/components/stream-sources/stream-spec-table-client"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"

export default async function StreamSourcesPage() {
  const offset = 0

  const [listed, sourceOptions] = await Promise.all([
    readList(
      listStreamSources({
        limit: PAGE_SIZE,
        offset,
        feature_view_name: undefined,
      }),
    ),
    eligibleSourceOptions(),
  ])

  const items = (listed.data?.items ?? []).map(toStreamSpecRow)
  const editable = await canEdit()

  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Stream Specs" }]} />
      <PageMain variant="list">
        <StreamSpecTableClient
          data={items}
          sourceOptions={sourceOptions}
          limit={listed.data?.pagination.limit ?? PAGE_SIZE}
          offset={listed.data?.pagination.offset ?? offset}
          total={listed.data?.pagination.total ?? 0}
          addHref="/stream-sources/add"
          canEdit={editable}
          failure={listed.failure}
          filtered={false}
          className="flex-1 min-h-0"
        />
      </PageMain>
    </>
  )
}
