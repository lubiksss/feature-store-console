"use client"

import { BoxesIcon } from "lucide-react"
import { IdentityBadge, IdentityLink } from "@/components/shared/identity-badge"

// 링크 없는 뱃지. 폼 안의 잠긴 참조가 이것을 쓴다 — 이 레포에는 unsaved-changes 가드가 없어
// 입력 중에 링크를 잘못 누르면 저장 안 한 값이 사라진다(enum-badges 의 link={false} 와 같은
// 이유). 생성 폼의 파생 이름 미리보기도 링크할 곳이 없다.
export function FeatureViewNameBadge({ featureViewName }: { featureViewName: string }) {
  return <IdentityBadge name={featureViewName} icon={BoxesIcon} />
}

// href 는 필수다. 목적지가 문맥마다 다르고(그 화면이 속한 목록을 이 값으로 좁힌다), 기본값을
// 두면 조용히 남의 화면을 가리킨다 — owner 뱃지가 /feature-views 를 하드코딩해 entity·store 화면에서
// 엉뚱한 목록으로 나갔던 것이 정확히 그 버그다.
export function FeatureViewNameLink({ featureViewName, href }: { featureViewName: string; href: string }) {
  return <IdentityLink name={featureViewName} icon={BoxesIcon} href={href} />
}
