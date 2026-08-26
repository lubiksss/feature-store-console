import { notFound } from "next/navigation"
import {
  getPartitionEvent,
  getPartitionMaterializationResult,
  getPartitionConsistencyResult,
  getBatchSource,
  listExecutions,
  MAX_PAGE_SIZE,
} from "@/lib/meta-client"
import { PartitionEventDetail } from "@/components/partition-events/partition-event-detail"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"
import { partitionEventParams } from "@/lib/fixtures/static-params"

interface Props {
  params: Promise<{ id: string }>
}

export default async function PartitionEventDetailPage({ params }: Props) {
  const { id } = await params
  const eventId = Number(id)
  const event = await getPartitionEvent(eventId).catch(() => null)
  if (!event) notFound()

  // Results (1:1 by partition_event_id) + materialization/consistency runs (referenced via partition_event_id).
  // The location joins the same parallel fetch for its hadoop_cluster alone: partition paths live
  // on that cluster's storage and the runs on its YARN, so both console links follow it. Missing
  // location → undefined → links fall back to hadoop-primary (what every pre-secondary featureView is).
  const [materializationResult, consistencyResult, execResult, location] = await Promise.all([
    getPartitionMaterializationResult(eventId).catch(() => null),
    getPartitionConsistencyResult(eventId).catch(() => null),
    listExecutions({
      feature_view_name: [event.feature_view_name],
      event_kind: ["materialization", "consistency"],
      limit: MAX_PAGE_SIZE,
    }).catch(() => null),
    getBatchSource(event.feature_view_name).catch(() => null),
  ])
  const executions = (execResult?.items ?? []).filter(
    (e) => e.partition_event_id === event.partition_event_id,
  )

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Partition Events", href: "/partition-events" }, { label: id }]}
      />
      <PageMain variant="detail">
        <PartitionEventDetail
          data={event}
          materializationResult={materializationResult}
          consistencyResult={consistencyResult}
          executions={executions}
          cluster={location?.hadoop_cluster ?? undefined}
        />
      </PageMain>
    </>
  )
}

// 정적 export: 미리 렌더할 상세 좌표를 픽스처에서 파생시킨다.
export async function generateStaticParams() {
  return partitionEventParams()
}
