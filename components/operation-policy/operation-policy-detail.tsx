import { FieldTable, SectionCard } from "@/components/shared/detail-section"
import { SlidersHorizontalIcon } from "lucide-react"
import { InfoTooltip } from "@/components/shared/info-tooltip"
import { POLICY_INFO } from "@/lib/catalog-enums"
import { CountValue } from "@/components/shared/count-value"
import { ResourceActionsMenu } from "@/components/shared/resource-actions-menu"
import { display } from "@/lib/display"
import type { OperationPolicy } from "@/lib/meta-client"

// Global singleton (id=1). Grouped by knob domain: validation → materialization →
// consistency → store profiling → retirement. Edit-only (no add/delete — the singleton
// always exists).
export function OperationPolicyDetail({
  data,
  canEdit = false,
}: {
  data?: OperationPolicy | null
  canEdit?: boolean
}) {
  return (
    <div className="flex flex-col gap-4">
      {data ? (
        <SectionCard
          title="Operation Policy"
          icon={SlidersHorizontalIcon}
          adminOnly
          action={
            <ResourceActionsMenu
              editHref="/operation-policy/edit"
              canEdit={canEdit}
              resourceLabel="operation policy"
            />
          }
        >
          <FieldTable
            labels="wide"
            rows={[
              // ── validation ──
              {
                label: (
                  <span className="flex items-center justify-between gap-1.5">
                    validation_sample_row_limit
                    <InfoTooltip text={POLICY_INFO.validation_sample_row_limit} />
                  </span>
                ),
                value: <CountValue value={data.validation_sample_row_limit} />,
              },
              // ── materialization ──
              {
                label: (
                  <span className="flex items-center justify-between gap-1.5">
                    materialization_sample_row_limit
                    <InfoTooltip text={POLICY_INFO.materialization_sample_row_limit} />
                  </span>
                ),
                value: <CountValue value={data.materialization_sample_row_limit} />,
              },
              // ── consistency ──
              {
                label: (
                  <span className="flex items-center justify-between gap-1.5">
                    materialization_kafka_produce_partitions
                    <InfoTooltip text={POLICY_INFO.materialization_kafka_produce_partitions} />
                  </span>
                ),
                value: <CountValue value={data.materialization_kafka_produce_partitions} />,
              },
              {
                label: (
                  <span className="flex items-center justify-between gap-1.5">
                    materialization_kafka_produce_batch_size
                    <InfoTooltip text={POLICY_INFO.materialization_kafka_produce_batch_size} />
                  </span>
                ),
                value: <CountValue value={data.materialization_kafka_produce_batch_size} />,
              },
              {
                label: (
                  <span className="flex items-center justify-between gap-1.5">
                    consistency_sample_row_limit
                    <InfoTooltip text={POLICY_INFO.consistency_sample_row_limit} />
                  </span>
                ),
                value: <CountValue value={data.consistency_sample_row_limit} />,
              },
              // ── store profiling ──
              // consistency 바로 뒤에 둔다: 같은 성격의 노브다(키집합을 표본추출해 Redis 를
              // 병렬 조회). 표본 크기 규칙도 같다 — row_limit 이 있으면 그 개수, 없으면 비율.
              {
                label: (
                  <span className="flex items-center justify-between gap-1.5">
                    consistency_sample_fraction
                    <InfoTooltip text={POLICY_INFO.consistency_sample_fraction} />
                  </span>
                ),
                value: display(data.consistency_sample_fraction),
              },
              {
                label: (
                  <span className="flex items-center justify-between gap-1.5">
                    consistency_redis_probe_partitions
                    <InfoTooltip text={POLICY_INFO.consistency_redis_probe_partitions} />
                  </span>
                ),
                value: <CountValue value={data.consistency_redis_probe_partitions} />,
              },
              {
                label: (
                  <span className="flex items-center justify-between gap-1.5">
                    consistency_redis_probe_chunk_size
                    <InfoTooltip text={POLICY_INFO.consistency_redis_probe_chunk_size} />
                  </span>
                ),
                value: <CountValue value={data.consistency_redis_probe_chunk_size} />,
              },
              {
                label: (
                  <span className="flex items-center justify-between gap-1.5">
                    store_profiling_sample_row_limit
                    <InfoTooltip text={POLICY_INFO.store_profiling_sample_row_limit} />
                  </span>
                ),
                value: <CountValue value={data.store_profiling_sample_row_limit} />,
              },
              {
                label: (
                  <span className="flex items-center justify-between gap-1.5">
                    store_profiling_sample_fraction
                    <InfoTooltip text={POLICY_INFO.store_profiling_sample_fraction} />
                  </span>
                ),
                value: display(data.store_profiling_sample_fraction),
              },
              {
                label: (
                  <span className="flex items-center justify-between gap-1.5">
                    store_profiling_redis_probe_partitions
                    <InfoTooltip text={POLICY_INFO.store_profiling_redis_probe_partitions} />
                  </span>
                ),
                value: <CountValue value={data.store_profiling_redis_probe_partitions} />,
              },
              {
                label: (
                  <span className="flex items-center justify-between gap-1.5">
                    store_profiling_redis_probe_chunk_size
                    <InfoTooltip text={POLICY_INFO.store_profiling_redis_probe_chunk_size} />
                  </span>
                ),
                value: <CountValue value={data.store_profiling_redis_probe_chunk_size} />,
              },
              // ── retirement ──
              {
                label: (
                  <span className="flex items-center justify-between gap-1.5">
                    retirement_scan_rate_limit
                    <InfoTooltip text={POLICY_INFO.retirement_scan_rate_limit} />
                  </span>
                ),
                value: <CountValue value={data.retirement_scan_rate_limit} />,
              },
              // ── general ──
              {
                label: "updated_at",
                value: data.updated_at,
                label2: "created_at",
                value2: data.created_at,
                labels: "default",
              },
            ]}
          />
        </SectionCard>
      ) : (
        <SectionCard title="Operation Policy" icon={SlidersHorizontalIcon}>
          <p className="text-sm text-muted-foreground">No operation policy configured.</p>
        </SectionCard>
      )}
    </div>
  )
}
