import { UserRoundCogIcon, UserRoundIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// 권한 role 뱃지. 계정 드롭다운(사이드바)과 가이드의 권한 설명이 같은 모양을 써야 "admin은
// 전부 수정 가능"이라는 문장과 내 계정에 붙은 뱃지가 같은 것으로 읽힌다.
// 역할은 사람 축이라 둘 다 사람 아이콘이고 권한 차이는 톱니로만 갈린다: admin은 빨강 + 톱니
// (ownership 무시·상위 권한), 그 외(user 등)는 파랑 + 사람(자기 피처 뷰만). 방패 계열
// (Shield/ShieldCheck/ShieldX)은 정합성 게이트 어휘라 여기 쓰지 않는다 — 한 글리프가 "관리자"와
// "정합성 통과" 둘을 뜻하면 어느 쪽도 그 뜻으로 굳지 않는다.
// 둘 다 채운 배경 + 흰 글자. 뱃지가 자식 svg를 규격(size-3)으로 맞춘다.
export function RoleBadge({ role }: { role: string }) {
  const isAdmin = role === "admin"
  const Icon = isAdmin ? UserRoundCogIcon : UserRoundIcon
  return (
    <Badge
      className={
        isAdmin
          ? "border-transparent bg-status-failed text-status-failed-fg align-middle"
          : "border-transparent bg-status-submitted text-status-submitted-fg align-middle"
      }
    >
      <Icon />
      {role}
    </Badge>
  )
}

// 여러 role을 나란히. 없으면 숨기지 않고 없음을 적는다.
export function RoleBadges({ roles }: { roles?: string[] }) {
  if (!roles || roles.length === 0) {
    return <span className="text-xs text-muted-foreground">no roles</span>
  }
  return (
    <>
      {roles.map((r) => (
        <RoleBadge key={r} role={r} />
      ))}
    </>
  )
}
