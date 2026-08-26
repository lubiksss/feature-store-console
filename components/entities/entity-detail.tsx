import { OwnerBadges } from "@/components/shared/owner-badge"
import { EnumBadges } from "@/components/shared/enum-badges"
import { EntityActionsMenu } from "@/components/entities/entity-actions-menu"
import { FieldTable, SectionCard } from "@/components/shared/detail-section"
import { GroupIcon } from "lucide-react"
import { display } from "@/lib/display"

export interface EntityDetailData {
  entityName: string
  entityPrefix: string
  owner: string
  description?: string
  keySourceHadoopCluster?: string
  keySourceHiveTable?: string
  keySourceKeyColumn?: string
  createdAt: string
  updatedAt: string
}

interface Props {
  data: EntityDetailData
  canEdit?: boolean
}

// 카드는 하나다. 키 원천은 대상의 다른 종류의 사실이 아니라 대상의 나머지 절반이라, 두 카드로
// 나누면 한 행을 읽으려고 두 번 스캔하게 된다 — description 아래로 그대로 이어 붙인다.
//
// 필드는 한 줄에 하나다(피처 뷰 상세와 같다). 짝으로 붙는 것은 updated_at / created_at 뿐이다 —
// 그 둘은 같은 축의 두 시점이라 나란히 읽는 것이 값싸고, 나머지는 서로 다른 축이다.
export function EntityDetail({ data, canEdit = false }: Props) {
  return (
    <SectionCard
      title="Entity"
      icon={GroupIcon}
      adminOnly
      action={<EntityActionsMenu entityName={data.entityName} canEdit={canEdit} />}
    >
      <FieldTable
        rows={[
          // 피처 뷰 상세의 feature_view_name 과 같은 형식이다: 리소스 타입 아이콘 + 이름. 값마다
          // 아이콘이 다른 enum 칩이 아니라 "이 행의 정체성" 표기다.
          {
            label: "entity_name",
            value: data.entityName,
          },
          { label: "entity_prefix", value: data.entityPrefix },
          { label: "owner", value: <OwnerBadges owner={data.owner} listPath="/entities" /> },
          { label: "description", value: display(data.description), multiline: true },
          // 키 원천은 all-or-none 이라 셋이 모두 채워져 있거나 모두 "-" 다. 클러스터가 테이블
          // 위다 — 테이블 이름은 그 클러스터 안에서만 뜻이 있고, location 카드도 같은 순서다.
          {
            label: "key_source_hadoop_cluster",
            value: data.keySourceHadoopCluster ? (
              <EnumBadges set="hadoopCluster" value={data.keySourceHadoopCluster} />
            ) : (
              display(undefined)
            ),
          },
          { label: "key_source_hive_table", value: display(data.keySourceHiveTable) },
          { label: "key_source_key_column", value: display(data.keySourceKeyColumn) },
          {
            label: "updated_at",
            value: data.updatedAt,
            label2: "created_at",
            value2: data.createdAt,
          },
        ]}
      />
    </SectionCard>
  )
}
