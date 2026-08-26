import { OwnerBadges } from "@/components/shared/owner-badge"
import { EnumBadges } from "@/components/shared/enum-badges"
import { StoreActionsMenu } from "@/components/online-stores/online-store-actions-menu"
import { FieldTable, SectionCard } from "@/components/shared/detail-section"
import { DatabaseIcon } from "lucide-react"
import { display } from "@/lib/display"

export interface StoreDetailData {
  storeName: string
  storeKind: string
  owner: string
  description?: string
  storeEndpoint?: string
  kafkaBroker: string
  kafkaTopic: string
  createdAt: string
  updatedAt: string
}

interface Props {
  data: StoreDetailData
  canEdit?: boolean
}

// 카드는 하나다. 쓰기 경로도 이 온라인 스토어의 사실이라 별도 카드로 두면 한 스토어를 읽으려고 두
// 번 스캔하게 된다 — description 아래로 그대로 이어 붙인다.
//
// 필드는 한 줄에 하나다(피처 뷰 상세와 같다). 짝으로 붙는 것은 updated_at / created_at 뿐이다.
export function StoreDetail({ data, canEdit = false }: Props) {
  return (
    <SectionCard
      title="Store"
      icon={DatabaseIcon}
      adminOnly
      action={
        <StoreActionsMenu storeName={data.storeName} storeKind={data.storeKind} canEdit={canEdit} />
      }
    >
      <FieldTable
        rows={[
          // 피처 뷰 상세의 feature_view_name 과 같은 형식. 정체성은 (이름, 종류) 짝이지만 뱃지가
          // 그리는 것은 이름이고, 종류는 아래 자기 행에서 닫힌 어휘 칩으로 읽는다.
          {
            label: "store_name",
            value: data.storeName,
          },
          {
            label: "store_kind",
            value: <EnumBadges set="storeKind" value={data.storeKind} link={false} />,
          },
          { label: "owner", value: <OwnerBadges owner={data.owner} listPath="/stores" /> },
          { label: "store_endpoint", value: display(data.storeEndpoint) },
          // 값이 아니라 "설정되어 있다"는 사실이다. 서버는 자격증명을 어떤 읽기에도 싣지 않고
          // (write-only), 이 GET 은 무인증이므로 실을 수도 없다 — 그래서 고정 마스크다. 칸을
          // 비워두면 폼에는 있는 행이 상세에는 없어 두 화면이 어긋나고, 자격증명이 설정되지
          // 않은 것처럼 읽힌다(서버는 required 라 항상 설정되어 있다).
          { label: "store_password", value: <span className="tracking-widest">••••••••</span> },
          { label: "description", value: display(data.description), multiline: true },
          // 브로커가 먼저다 — 토픽 이름은 그 브로커 안에서만 뜻이 있다. 대상의 키 원천에서
          // 클러스터가 테이블 위인 것과 같은 순서다.
          { label: "kafka_broker", value: data.kafkaBroker },
          { label: "kafka_topic", value: data.kafkaTopic },
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
