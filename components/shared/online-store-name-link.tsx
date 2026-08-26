"use client"

import { DatabaseIcon } from "lucide-react"
import { IdentityBadge, IdentityLink } from "@/components/shared/identity-badge"

// 온라인 스토어의 정체성은 (이름, 종류) 짝이지만 뱃지가 그리는 것은 이름이다 — 종류는 자기 행에서
// 닫힌 어휘 칩으로 읽는다.
export function StoreNameBadge({ storeName, filled }: { storeName: string; filled?: boolean }) {
  return <IdentityBadge name={storeName} icon={DatabaseIcon} filled={filled} />
}

export function StoreNameLink({
  storeName,
  href,
  filled,
}: {
  storeName: string
  href: string
  filled?: boolean
}) {
  return <IdentityLink name={storeName} icon={DatabaseIcon} href={href} filled={filled} />
}
