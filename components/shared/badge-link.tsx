"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

// 뱃지를 감싸는 링크. 뱃지 링크가 네 곳(EnumBadge의 앱 내/콘솔 링크, BadgeSelect, OwnerBadges)에서
// 같은 클래스 문자열을 복사해 쓰고 있었어서 하나로 모았다 — 포커스 링이나 hover가 한 곳만 바뀌는 일을
// 막는다.
//
// stopPropagation: 목록 행 자체가 클릭으로 상세로 가므로(row-nav-table-client), 뱃지 링크가 행
// 이동까지 같이 발동시키면 안 된다.
// external: 값의 외부 콘솔로 나가는 링크만 새 탭이다. 앱 안 목적지는 같은 탭에서 연다.
export function BadgeLink({
  href,
  external,
  className,
  children,
}: {
  href: string
  external?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "inline-flex rounded-4xl outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {children}
    </Link>
  )
}
