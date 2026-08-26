import type { StreamSource } from "@/lib/meta-client"
import { numStr } from "@/components/shared/mappers-util"
import type { StreamSpecRowData } from "@/components/stream-sources/stream-spec-row"
import type { StreamSpecDetailData } from "@/components/stream-sources/stream-spec-detail"

// ─── FeatureView Stream Spec (server → view) ───────────────────────────────────────
export function toStreamSpecRow(ss: StreamSource): StreamSpecRowData {
  return {
    featureViewName: ss.feature_view_name,
    inputTopic: ss.input_topic,
    inputBroker: ss.input_broker,
    keyPath: ss.key_path,
    valuePath: ss.value_path,
    eventTsPath: ss.event_ts_path,
    updatedAt: ss.updated_at,
  }
}

export function toStreamSpecDetail(ss: StreamSource): StreamSpecDetailData {
  return {
    featureName: ss.feature_name,
    entityName: ss.entity_name,
    inputBroker: ss.input_broker,
    inputTopic: ss.input_topic,
    consumerGroup: ss.consumer_group,
    inputSchema: ss.input_schema,
    samplePartition: numStr(ss.sample_partition),
    keyPath: ss.key_path,
    valuePath: ss.value_path,
    eventTsPath: ss.event_ts_path,
    eventTsFormat: ss.event_ts_format,
    aggregationType: ss.aggregation_type,
    dedupOnOutput: ss.dedup_on_output,
    maxWindowSeconds: ss.max_window_seconds,
    maxWindowItems: ss.max_window_items,
    outputBroker: ss.output_broker,
    outputTopic: ss.output_topic,
    identityFilterType: ss.identity_filter_type,
    identityFallbackPath: ss.identity_fallback_path,
    filterFlagsPath: ss.filter_flags_path,
    publisherFilterPath: ss.publisher_filter_path,
    conversionFilterPath: ss.conversion_filter_path,
    createdAt: ss.created_at,
    updatedAt: ss.updated_at,
  }
}

