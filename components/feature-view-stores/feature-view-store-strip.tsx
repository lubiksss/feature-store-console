"use client"

import { FieldTable } from "@/components/shared/detail-section"
import { StoreNameBadge, StoreNameLink } from "@/components/shared/online-store-name-link"
import { display } from "@/lib/display"
import { storeHref } from "@/lib/resource-href"
import { cn } from "@/lib/utils"

export interface StoreKindRow {
  storeKind: string
  // 그 종류의 인스턴스 이름. 종류당 하나이므로 토글은 종류만 말하면 되고, 이름은 무엇에
  // 묶이는지를 보여준다. 인스턴스가 없는 종류는 빈 문자열이다.
  storeName: string
}

// 읽기 카드와 편집 폼이 같은 표를 쓴다. onToggle 이 없으면 읽기(켜진 것만 링크), 있으면 편집
// (뱃지가 버튼)이고 마크업은 하나다 — 두 화면이 갈라지면 오퍼는 편집에서 본 것과 다른 것을
// 저장한 뒤 보게 된다.
//
// 켜짐은 채운 뱃지, 꺼짐은 흐린 뱃지다. enum 스트립이 현재 값을 채우고 나머지를 흐리게 두는
// 그 규약이고, 여기서 "현재 값"은 이 피처 뷰가 묶여 있는 종류들이다.
export function FeatureViewStoreStrip({
  rows,
  selected,
  onToggle,
  disabled,
}: {
  rows: readonly StoreKindRow[]
  selected: readonly string[]
  onToggle?: (storeKind: string) => void
  disabled?: boolean
}) {
  const on = new Set(selected)
  return (
    <FieldTable
      rows={rows.map(({ storeKind, storeName }) => {
        const isOn = on.has(storeKind)
        if (!storeName) {
          // 그 종류에 인스턴스가 없다. 묶일 대상이 없으므로 토글도 없다.
          return { label: storeKind, value: display(undefined) }
        }
        const badge = <StoreNameBadge storeName={storeName} filled={isOn} />
        return {
          label: storeKind,
          value: onToggle ? (
            <button
              type="button"
              aria-pressed={isOn}
              disabled={disabled}
              onClick={() => onToggle(storeKind)}
              className={cn(
                "min-w-0 rounded-4xl outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-ring",
                isOn ? "" : "opacity-40 hover:opacity-100",
                disabled && "cursor-not-allowed",
              )}
            >
              {badge}
            </button>
          ) : isOn ? (
            // 켜진 것만 링크한다 — 꺼진 종류는 이 피처 뷰가 묶이지 않은 곳이라, 같은 곳으로
            // 보내면 화면이 약속하지 않은 것을 약속하게 된다(BadgeSelect 의 selectedHref 와
            // 같은 이유).
            <StoreNameLink storeName={storeName} href={storeHref(storeName, storeKind)} filled />
          ) : (
            <span className="min-w-0 opacity-40">{badge}</span>
          ),
        }
      })}
    />
  )
}
