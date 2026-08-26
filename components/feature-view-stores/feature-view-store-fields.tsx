import { FeatureViewStoreStrip, type StoreKindRow } from "@/components/feature-view-stores/feature-view-store-strip"

export interface FeatureViewStoreMembership {
  storeKind: string
  storeName: string
  createdAt: string
}

// 행의 집합은 카탈로그의 store_kind 전부다 — 안 묶인 종류도 꺼진 뱃지로 남는다. 카드를 숨기거나
// 별도의 빈 문구를 두지 않는 이유는 location 카드와 같다: 없음은 정보다.
export function FeatureViewStoreFields({
  storeKinds,
  storeNamesByKind,
  memberships,
}: {
  storeKinds: readonly string[]
  // 종류 → 그 종류의 인스턴스 이름들. 꺼진 종류도 "묶이면 어디로 가는지"를 보여준다.
  storeNamesByKind: Record<string, string[]>
  memberships: readonly FeatureViewStoreMembership[]
}) {
  const byKind = new Map(memberships.map((m) => [m.storeKind, m]))
  const rows: StoreKindRow[] = storeKinds.map((storeKind) => ({
    storeKind,
    // 묶여 있으면 그 행이 말하는 인스턴스, 아니면 그 종류의 유일한 인스턴스.
    storeName: byKind.get(storeKind)?.storeName ?? (storeNamesByKind[storeKind] ?? [])[0] ?? "",
  }))
  return <FeatureViewStoreStrip rows={rows} selected={[...byKind.keys()]} />
}
