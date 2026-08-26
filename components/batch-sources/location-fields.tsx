import { FieldTable } from "@/components/shared/detail-section"
import { HdfsPathLink } from "@/components/shared/hdfs-path-link"
import { HiveTableLink } from "@/components/shared/hive-table-link"
import { EnumBadges } from "@/components/shared/enum-badges"
import { InfoTooltip } from "@/components/shared/info-tooltip"
import { DurationValue } from "@/components/shared/duration-value"
import { display } from "@/lib/display"
import { KEY_DATA_TYPE_INFO, VALUE_DATA_TYPE_INFO } from "@/lib/catalog-enums"

// The redis_* columns of fs_batch_source are absent here on purpose: they duplicate what
// the entity (its prefix) and the store (its endpoint) own, and they are being dropped. This
// card is the origin (Hive/HDFS) side of a featureView and never showed them.
export interface LocationData {
  updatePeriod?: string
  partitionColumns?: string
  hadoopCluster?: string
  hadoopHiveTable?: string
  hadoopStoragePath?: string
  hadoopKeyColumnName?: string
  hadoopValueColumnName?: string
  keyDataType?: string
  valueDataType?: string
  createdAt: string
  updatedAt: string
}

// location is optional: a featureView without one still renders every row as "-" rather than
// hiding the card. Absence is information — an empty table says "no location yet" precisely,
// where a missing card would leave the operator guessing.
export function LocationFields({
  featureViewName,
  location,
}: {
  featureViewName: string
  location?: LocationData
}) {
  return (
    <FieldTable
      rows={[
        // ── 공용 ──
        // feature_view_name은 위 FeatureView 카드와 겹치지만 그대로 싣는다: 카드 하나만 떼어 봐도
        // 어느 피처 뷰의 것인지 알 수 있어야 한다(카드 단위 원자성 > 중복 제거).
        { label: "feature_view_name", value: featureViewName },
        {
          label: "update_period",
          value: location?.updatePeriod ? (
            <DurationValue
              raw={Number(location.updatePeriod)}
              totalSeconds={Number(location.updatePeriod)}
            />
          ) : (
            display(undefined)
          ),
        },
        {
          label: (
            <span className="flex items-center justify-between gap-1.5">
              key_data_type
              <InfoTooltip text={KEY_DATA_TYPE_INFO} />
            </span>
          ),
          value: location?.keyDataType ? (
            <EnumBadges set="keyDataType" value={location.keyDataType} />
          ) : (
            display(undefined)
          ),
          multiline: true,
        },
        {
          label: (
            <span className="flex items-center justify-between gap-1.5">
              value_data_type
              <InfoTooltip text={VALUE_DATA_TYPE_INFO} />
            </span>
          ),
          value: location?.valueDataType ? (
            <EnumBadges set="valueDataType" value={location.valueDataType} />
          ) : (
            display(undefined)
          ),
          multiline: true,
        },
        // ── 하둡 ──
        { label: "partition_columns", value: display(location?.partitionColumns) },
        { label: "hadoop_key_column_name", value: display(location?.hadoopKeyColumnName) },
        { label: "hadoop_value_column_name", value: display(location?.hadoopValueColumnName) },
        {
          label: "hadoop_cluster",
          value: location?.hadoopCluster ? (
            <EnumBadges set="hadoopCluster" value={location.hadoopCluster} />
          ) : (
            display(undefined)
          ),
        },
        {
          label: "hadoop_hive_table",
          value: location?.hadoopHiveTable ? (
            <HiveTableLink hiveTable={location.hadoopHiveTable} cluster={location.hadoopCluster} />
          ) : (
            display(undefined)
          ),
        },
        {
          label: "hadoop_storage_path",
          value: location?.hadoopStoragePath ? (
            <HdfsPathLink path={location.hadoopStoragePath} cluster={location.hadoopCluster} />
          ) : (
            display(undefined)
          ),
        },
        {
          label: "updated_at",
          value: display(location?.updatedAt),
          label2: "created_at",
          value2: display(location?.createdAt),
        },
      ]}
    />
  )
}
