import { notFound } from "next/navigation"
import { getEntity, isNotFound } from "@/lib/meta-client"
import { canEdit } from "@/lib/auth"
import { EntityDetail } from "@/components/entities/entity-detail"
import { toEntityDetail } from "@/components/entities/entity-mappers"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"
import { entityParams } from "@/lib/fixtures/static-params"

interface Props {
  params: Promise<{ entity_name: string }>
}

export default async function EntityPage({ params }: Props) {
  const { entity_name } = await params
  const entity = await getEntity(entity_name).catch((e) => {
    if (isNotFound(e)) return null
    throw e
  })
  if (!entity) notFound()

  const editable = await canEdit()

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Entities", href: "/entities" }, { label: entity.entity_name }]}
      />
      <PageMain variant="detail">
        <EntityDetail data={toEntityDetail(entity)} canEdit={editable} />
      </PageMain>
    </>
  )
}

// 정적 export: 미리 렌더할 상세 좌표를 픽스처에서 파생시킨다.
export async function generateStaticParams() {
  return entityParams()
}
