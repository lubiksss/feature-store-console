import { canEdit } from "@/lib/auth"
import { loadEntityList } from "@/lib/entity-list"
import { toEntityRow } from "@/components/entities/entity-mappers"
import { EntityTableClient } from "@/components/entities/entity-table-client"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"

export default async function EntitiesPage() {
  const { entities, entityOptions, failure, limit, offset, total } = await loadEntityList({
    offset: 0,
    filters: {
      entity_name: undefined,
      owner: undefined,
    },
  })

  const editable = await canEdit()

  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Entities" }]} />
      <PageMain variant="list">
        <EntityTableClient
          data={entities.map(toEntityRow)}
          entityOptions={entityOptions}
          limit={limit}
          offset={offset}
          total={total}
          addHref="/entities/add"
          canEdit={editable}
          failure={failure}
          filtered={false}
          className="flex-1 min-h-0"
        />
      </PageMain>
    </>
  )
}
