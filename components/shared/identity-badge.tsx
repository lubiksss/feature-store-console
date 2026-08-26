"use client"

import { BadgeLink } from "@/components/shared/badge-link"
import type { LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TruncateTip } from "@/components/shared/truncate-tip"
import { cn } from "@/lib/utils"

// 리소스의 정체성을 그리는 한 가지 형식: 리소스 타입 아이콘 + 이름. 값마다 아이콘이 다른
// enum 칩과 다르다 — 여기서 아이콘은 "무엇의 이름인가"를 말하고, 값 쪽은 언제든 늘어난다.
// 그래서 이름이 행에서 오는 리소스(피처 뷰·대상·스토어)가 모두 같은 형식을 쓸 수 있다.
//
// 어디에 쓰는가 — 고정 룰: 그 화면 자신의 이름은 평문이다. 목록에서 한 행이 곧 그 리소스인
// 이름 칼럼(featureViews / entities / stores / stream-specs / ingestionSpecs), 그리고 상세·폼에서
// 그 리소스 자신의 이름 행이 그렇다 — 화면 제목이 이미 "무엇의 이름인가"를 말하고, 자기
// 자신으로 가는 링크는 무동작이다.
//
// 다른 리소스를 참조하는 자리만 뱃지다. 그리고 그 링크는 리소스가 아니라 그 화면이 속한
// 목록을 이 값으로 좁힌다 — 피처 뷰 이벤트 목록에서 feature_view_name 을 누르면 그 피처 뷰의 이벤트만
// 남는 것이 그 화면에서 원하는 것이고, 피처 뷰 상세로 나가는 것은 문맥을 버리는 것이다.
// 좁힐 수 없는 자리(그 목록이 그 파라미터를 파싱하지 않는 경우)에서만 리소스로 간다.
//
// 폼의 잠긴 참조는 링크 없는 뱃지다 — unsaved-changes 가드가 없어 잘못 누르면 입력이 사라진다.
//
// 서버 컴포넌트는 이것을 직접 부르지 않는다. icon 은 함수 컴포넌트이고 상세 뷰는 서버
// 컴포넌트라, 넘기는 순간 "Functions cannot be passed directly to Client Components" 로
// 죽는다(enum-badges 의 SETS 가 set 키만 받는 것과 같은 이유). 리소스별 래퍼가 아이콘을 자기
// 번들 안에서 박고, 서버는 문자열만 넘긴다 — FeatureViewNameLink / EntityNameLink / StoreNameLink.
// filled: 이 이름이 "켜진" 상태라는 표기. 멤버십처럼 있음/없음이 이 화면의 내용인 자리에서
// 쓴다 — enum 스트립이 현재 값을 채워 그리고 나머지를 흐리게 두는 것과 같은 규약이고, 그래서
// 편집 폼과 읽기 카드가 같은 모양이 된다. 기본은 outline: 참조는 상태가 아니라 가리킴이다.
export function IdentityBadge({
  name,
  icon: Icon,
  filled,
  className,
}: {
  name: string
  icon: LucideIcon
  filled?: boolean
  className?: string
}) {
  return (
    <Badge
      variant={filled ? "default" : "outline"}
      className={cn("max-w-full min-w-0 gap-1", className)}
    >
      <Icon className="size-3 shrink-0" />
      <TruncateTip>{name}</TruncateTip>
    </Badge>
  )
}

// 링크는 BadgeLink 를 쓴다 — 뱃지 링크의 hover 와 포커스 링은 그 한 곳이 갖는다. 자체 hover 를
// 두면 규약이 갈리고, 채운 뱃지에서는 배경색이 통째로 바뀌어 다른 뱃지들과 다르게 반응한다.
export function IdentityLink({
  name,
  icon,
  href,
  filled,
  className,
}: {
  name: string
  icon: LucideIcon
  href: string
  filled?: boolean
  className?: string
}) {
  return (
    <BadgeLink href={href} className="min-w-0">
      <IdentityBadge name={name} icon={icon} filled={filled} className={className} />
    </BadgeLink>
  )
}
