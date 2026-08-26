import { FieldTable, SectionCard } from "@/components/shared/detail-section"
import { entityHref } from "@/lib/resource-href"
import { EntityNameLink } from "@/components/shared/entity-name"
import { WavesIcon } from "lucide-react"
import { TopicLink } from "@/components/shared/topic-link"
import { InfoTooltip } from "@/components/shared/info-tooltip"
import { EnumBadges } from "@/components/shared/enum-badges"
import { StreamSpecActionsMenu } from "@/components/stream-sources/stream-spec-actions-menu"
import { StreamSpecPipelineCard } from "@/components/stream-sources/stream-spec-pipeline-card"
import { CountValue } from "@/components/shared/count-value"
import { DurationValue } from "@/components/shared/duration-value"
import { ENTITY_NAME_INFO } from "@/lib/catalog-enums"
import { display } from "@/lib/display"

export interface StreamSpecDetailData {
  featureName: string
  entityName: string
  inputBroker: string
  inputTopic: string
  consumerGroup: string
  inputSchema?: string
  samplePartition?: string
  keyPath?: string
  valuePath?: string
  eventTsPath?: string
  eventTsFormat?: string
  aggregationType: string
  dedupOnOutput?: boolean
  maxWindowSeconds?: number
  maxWindowItems?: number
  outputBroker: string
  outputTopic: string
  identityFilterType?: string
  identityFallbackPath?: string
  filterFlagsPath?: string
  publisherFilterPath?: string
  conversionFilterPath?: string
  createdAt: string
  updatedAt: string
}

interface Props {
  featureViewName: string
  data?: StreamSpecDetailData
  canEdit?: boolean
}

export function StreamSpecDetail({ featureViewName, data, canEdit = false }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {data ? (
        <SectionCard
          title="Stream Spec"
          icon={WavesIcon}
          action={<StreamSpecActionsMenu featureViewName={featureViewName} canEdit={canEdit} />}
        >
          <FieldTable
            rows={[
              { label: "feature_view_name", value: featureViewName },
              { label: "feature_name", value: data.featureName },
              {
                label: (
                  <span className="flex items-center justify-between gap-1.5">
                    entity_name
                    <InfoTooltip text={ENTITY_NAME_INFO} />
                  </span>
                ),
                value: (
                  <EntityNameLink entityName={data.entityName} href={entityHref(data.entityName)} />
                ),
              },
              { label: "input_broker", value: data.inputBroker },
              {
                label: "input_topic",
                value: <TopicLink topic={data.inputTopic} broker={data.inputBroker} />,
              },
              { label: "consumer_group", value: data.consumerGroup },
              { label: "input_schema", value: display(data.inputSchema) },
              { label: "sample_partition", value: display(data.samplePartition) },
              { label: "key_path", value: display(data.keyPath) },
              { label: "value_path", value: display(data.valuePath) },
              { label: "event_ts_path", value: display(data.eventTsPath) },
              { label: "event_ts_format", value: display(data.eventTsFormat) },
              {
                label: "aggregation_type",
                value: <EnumBadges set="aggregation" value={data.aggregationType} />,
              },
              {
                label: "dedup_on_output",
                value:
                  data.dedupOnOutput != null ? (
                    <EnumBadges set="boolNeutral" value={String(data.dedupOnOutput)} />
                  ) : (
                    display(undefined)
                  ),
              },
              {
                label: "max_window_seconds",
                value:
                  data.maxWindowSeconds != null ? (
                    <DurationValue
                      raw={data.maxWindowSeconds}
                      totalSeconds={data.maxWindowSeconds}
                    />
                  ) : (
                    display(undefined)
                  ),
              },
              { label: "max_window_items", value: <CountValue value={data.maxWindowItems} /> },
              { label: "output_broker", value: data.outputBroker },
              {
                label: "output_topic",
                value: <TopicLink topic={data.outputTopic} broker={data.outputBroker} />,
              },
              {
                label: "identity_filter_type",
                value: data.identityFilterType ? (
                  <EnumBadges set="identityFilter" value={data.identityFilterType} />
                ) : (
                  display(undefined)
                ),
              },
              { label: "identity_fallback_path", value: display(data.identityFallbackPath) },
              { label: "filter_flags_path", value: display(data.filterFlagsPath) },
              { label: "publisher_filter_path", value: display(data.publisherFilterPath) },
              {
                label: "conversion_filter_path",
                value: display(data.conversionFilterPath),
              },
              {
                label: "updated_at",
                value: data.updatedAt,
                label2: "created_at",
                value2: data.createdAt,
              },
            ]}
          />
        </SectionCard>
      ) : (
        <SectionCard title="Stream Spec" icon={WavesIcon}>
          <FieldTable rows={[{ label: "feature_view_name", value: featureViewName }]} />
          <p className="mt-3 text-sm text-muted-foreground">No stream spec for this featureView.</p>
        </SectionCard>
      )}
      {data ? <StreamSpecPipelineCard data={data} /> : null}
    </div>
  )
}
