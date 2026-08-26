import { notFound } from "next/navigation"
import { getStoreEvent, listExecutions, MAX_PAGE_SIZE } from "@/lib/meta-client"
import { StoreEventDetail } from "@/components/online-store-events/online-store-event-detail"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"
import { storeEventParams } from "@/lib/fixtures/static-params"

interface Props {
  params: Promise<{ id: string }>
}

export default async function StoreEventDetailPage({ params }: Props) {
  const { id } = await params
  const event = await getStoreEvent(Number(id)).catch(() => null)
  if (!event) notFound()

  // Narrowed by the server on the event id. Filtering a global page in memory here would
  // silently empty this section for any event older than one page.
  const execResult = await listExecutions({
    store_event_id: [event.store_event_id],
    limit: MAX_PAGE_SIZE,
  }).catch(() => null)
  const executions = execResult?.items ?? []

  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Online Store Events", href: "/online-store-events" }, { label: id }]} />
      <PageMain variant="detail">
        <StoreEventDetail data={event} executions={executions} />
      </PageMain>
    </>
  )
}

// 정적 export: 미리 렌더할 상세 좌표를 픽스처에서 파생시킨다.
export async function generateStaticParams() {
  return storeEventParams()
}
