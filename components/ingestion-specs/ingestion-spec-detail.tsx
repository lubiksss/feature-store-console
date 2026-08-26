import { FieldTable, SectionCard } from "@/components/shared/detail-section"
import { ScrollTextIcon } from "lucide-react"
import { HdfsPathLink } from "@/components/shared/hdfs-path-link"
import { HiveTableLink } from "@/components/shared/hive-table-link"
import { EnumBadges } from "@/components/shared/enum-badges"
import { IngestionSpecActionsMenu } from "@/components/ingestion-specs/ingestion-spec-actions-menu"
import { CountValue } from "@/components/shared/count-value"
import { display } from "@/lib/display"

export interface IngestionSpecDetailData {
  partitionKeys?: string
  partitionFallback?: string
  sourcePathPattern: string
  sourceFormat: string
  sampleRowLimit?: number
  transformSql?: string
  outputHdfsPathPattern: string
  outputHdfsFormat: string
  outputHiveFullTableName: string
  outputHiveValueType?: string
  createdAt: string
  updatedAt: string
}

interface Props {
  featureViewName: string
  data?: IngestionSpecDetailData
  canEdit?: boolean
}

export function IngestionSpecDetail({ featureViewName, data, canEdit = false }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {data ? (
        <SectionCard
          title="Ingestion Spec"
          icon={ScrollTextIcon}
          action={<IngestionSpecActionsMenu featureViewName={featureViewName} canEdit={canEdit} />}
        >
          <FieldTable
            rows={[
              { label: "feature_view_name", value: featureViewName },
              {
                label: "source_format",
                value: <EnumBadges set="sourceFormat" value={data.sourceFormat} />,
              },
              {
                label: "source_path_pattern",
                value: <HdfsPathLink path={data.sourcePathPattern} />,
              },
              { label: "partition_keys", value: display(data.partitionKeys) },
              { label: "partition_fallback", value: display(data.partitionFallback) },
              { label: "sample_row_limit", value: <CountValue value={data.sampleRowLimit} /> },
              { label: "transform_sql", value: display(data.transformSql) },
              {
                label: "output_hdfs_path_pattern",
                value: <HdfsPathLink path={data.outputHdfsPathPattern} />,
              },
              {
                label: "output_hdfs_format",
                value: <EnumBadges set="hdfsFormat" value={data.outputHdfsFormat} />,
              },
              {
                label: "output_hive_full_table_name",
                value: <HiveTableLink hiveTable={data.outputHiveFullTableName} />,
              },
              { label: "output_hive_value_type", value: display(data.outputHiveValueType) },
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
        <SectionCard title="Ingestion Spec" icon={ScrollTextIcon}>
          <FieldTable rows={[{ label: "feature_view_name", value: featureViewName }]} />
          <p className="mt-3 text-sm text-muted-foreground">No ingestion spec for this featureView.</p>
        </SectionCard>
      )}
    </div>
  )
}
