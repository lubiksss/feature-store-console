"use client"

import { Badge } from "@/components/ui/badge"
import { IconBadge } from "@/components/shared/icon-badge"
import { BadgeLink } from "@/components/shared/badge-link"
import { ProfileAvatar } from "@/components/shared/profile-avatar"

// owner is a comma-separated set (fs_feature_view.owner). Parse to trimmed, non-empty names.
function parseOwners(owner: string): string[] {
  return owner
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean)
}

interface Props {
  owner: string
  // 이 뱃지가 좁힐 목록. 뱃지는 자기가 앉은 목록을 좁힌다 — entity 화면의 owner 를 눌러
  // 피처 뷰 목록으로 나가면 방금 보던 것과 무관한 화면이 열린다. 기본값을 두지 않는 이유는
  // 그것이 정확히 이 버그였기 때문이다: /feature-views 가 하드코딩되어 있어 entity·store 화면이
  // 조용히 남의 목록을 가리켰다. 필수로 두면 새 호출부가 컴파일에서 막힌다.
  //
  // 목적지는 owner 를 파싱하는 목록이어야 한다(현재 /feature-views, /entities, /stores).
  listPath: string
  className?: string
  // List view: show the first owner + a "+N" overflow badge. Detail view (default): show
  // every owner as its own badge.
  collapse?: boolean
}

export function OwnerBadges({ owner, listPath, className, collapse }: Props) {
  const owners = parseOwners(owner)
  if (owners.length === 0) return <span className="text-muted-foreground">—</span>

  const shown = collapse ? owners.slice(0, 1) : owners
  const overflow = owners.length - shown.length

  return (
    <div
      className={collapse ? "flex min-w-0 items-center gap-1" : "flex flex-wrap items-center gap-1"}
    >
      {/* enum 뱃지와 같은 규약: 값으로 필터한, 자기가 앉은 목록으로 보낸다. */}
      {shown.map((o) => (
        <BadgeLink
          key={o}
          href={`${listPath}?${new URLSearchParams({ owner: o })}`}
          className="min-w-0"
        >
          <IconBadge leading={<ProfileAvatar accountId={o} />} className={className}>
            {o}
          </IconBadge>
        </BadgeLink>
      ))}
      {overflow > 0 && (
        <Badge variant="secondary" className="tabular-nums" title={owners.slice(1).join(", ")}>
          +{overflow}
        </Badge>
      )}
    </div>
  )
}
