"use client"

import { GroupIcon } from "lucide-react"
import { IdentityBadge, IdentityLink } from "@/components/shared/identity-badge"

// 대상 이름은 카탈로그 이름이다 — fs_entity 의 행이고 피처 뷰·온라인 스토어와 같은 급이다. 값마다
// 아이콘이 다른 enum 칩이 아니다: 어휘가 아니라 이름이라 언제든 늘어난다.
//
// 아이콘은 가족 안에서 읽혀야 한다: featureView 가 BoxesIcon(쌓인 조각)이고 그 조각 하나가
// feature 이므로, entity 는 그 조각들을 하나로 묶어 주소가 되게 하는 것 — 점선이 감싸고 안에
// 도형이 있는 모양이다. 사각형 계열이라 가족으로 보이는 것도 같은 이유로 고른 것이다.
export function EntityNameBadge({ entityName }: { entityName: string }) {
  return <IdentityBadge name={entityName} icon={GroupIcon} />
}

export function EntityNameLink({ entityName, href }: { entityName: string; href: string }) {
  return <IdentityLink name={entityName} icon={GroupIcon} href={href} />
}
