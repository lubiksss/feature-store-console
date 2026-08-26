"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useScrollRestore } from "@/hooks/use-scroll-restore"

type Variant = "list" | "detail" | "form" | "center"

const VARIANT: Record<Variant, string> = {
  list: "overflow-hidden flex flex-col gap-6",
  detail: "overflow-y-auto flex flex-col gap-6",
  form: "overflow-y-auto",
  center: "overflow-y-auto flex items-center justify-center",
}

// 스크롤되는 variant만 복원 대상이다. list는 <main>이 overflow-hidden이고 실제 스크롤러가 안쪽
// DataTable이라, 그쪽이 자기 몫을 복원한다.
const SCROLLS: Record<Variant, boolean> = {
  list: false,
  detail: true,
  form: true,
  center: true,
}

// 스크롤 복원 때문에 client component지만, children은 서버에서 렌더된 그대로 통과한다
// (페이지 로직이 클라이언트 번들로 끌려오지 않는다).
export function PageMain({
  variant,
  className,
  children,
}: {
  variant: Variant
  className?: string
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLElement>(null)
  useScrollRestore(ref, "main", SCROLLS[variant])
  return (
    <main ref={ref} className={cn("min-h-0 flex-1 p-6", VARIANT[variant], className)}>
      {children}
    </main>
  )
}
