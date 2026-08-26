import { notFound } from "next/navigation"
import { getFeatureViewEvent, getBatchSource, listExecutions, MAX_PAGE_SIZE } from "@/lib/meta-client"
import { FeatureViewEventDetail } from "@/components/feature-view-events/feature-view-event-detail"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"
import { featureViewEventParams } from "@/lib/fixtures/static-params"

interface Props {
  params: Promise<{ id: string }>
}

export default async function FeatureViewEventDetailPage({ params }: Props) {
  const { id } = await params
  const event = await getFeatureViewEvent(Number(id)).catch(() => null)
  if (!event) notFound()

  // Executions of this event (validation/retirement/ingestion/profiling) reference it via feature_view_event_id.
  // The location rides along (same round trip) purely for its hadoop_cluster: the run happened on
  // that cluster's YARN, so the RM proxy link has to follow it. Missing location → undefined →
  // the link falls back to hadoop-primary, which is what every pre-secondary featureView is.
  const [execResult, location] = await Promise.all([
    listExecutions({
      feature_view_name: [event.feature_view_name],
      event_kind: [event.event_kind],
      limit: MAX_PAGE_SIZE,
    }).catch(() => null),
    getBatchSource(event.feature_view_name).catch(() => null),
  ])
  const executions = (execResult?.items ?? []).filter(
    (e) => e.feature_view_event_id === event.feature_view_event_id,
  )

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Feature View Events", href: "/feature-view-events" }, { label: id }]}
      />
      <PageMain variant="detail">
        <FeatureViewEventDetail
          data={event}
          executions={executions}
          cluster={location?.hadoop_cluster ?? undefined}
        />
      </PageMain>
    </>
  )
}

// 정적 export: 미리 렌더할 상세 좌표를 픽스처에서 파생시킨다.
export async function generateStaticParams() {
  return featureViewEventParams()
}
