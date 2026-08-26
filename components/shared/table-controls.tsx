// 정적 데모의 테이블 헤더.
//
// 원본은 여기서 URL 쿼리를 써서 서버 필터·페이지네이션을 구동한다(useSearchParams →
// router.push → 서버 컴포넌트 재요청). 정적 export에는 그 서버 왕복이 없고 샘플 데이터도
// 한 화면에 들어오므로, 헤더는 컬럼 이름만 보이고 필터 어피던스는 렌더하지 않는다.
//
// 호출부(목록 테이블 15개)를 원본 그대로 두기 위해 export 이름과 prop 형태는 유지한다 —
// 작동하지 않는 드롭다운을 남겨 두는 것보다, 없는 기능을 보여주지 않는 편이 정직하다.
import * as React from "react"
import type { FC } from "react"
import { TruncateTip } from "@/components/shared/truncate-tip"
import type { LucideIcon } from "lucide-react"

function HeaderLabel({ label }: { label: string }) {
  return (
    <div className="flex min-w-0 items-center gap-1">
      <TruncateTip>{label}</TruncateTip>
    </div>
  )
}

export function ColumnHeaderFilter({ label }: { label: string; [key: string]: unknown }) {
  return <HeaderLabel label={label} />
}

export function SourceHeaderFilter({ label }: { label: string; [key: string]: unknown }) {
  return <HeaderLabel label={label} />
}

export function EnumHeaderFilter({ label }: { label: string; [key: string]: unknown }) {
  return <HeaderLabel label={label} />
}

export function TimeHeaderFilter({ label }: { label: string; [key: string]: unknown }) {
  return <HeaderLabel label={label} />
}

// 순수 변환. 필터가 없어져도 호출부가 남아 있어 시그니처를 유지한다.
export function toFilterOptions(
  opts: { value: string; icon?: LucideIcon }[],
): { value: string; label: string; icon?: LucideIcon }[] {
  return opts.map((o) => ({ value: o.value, label: o.value, icon: o.icon }))
}

// 페이지 이동이 없으므로 항상 렌더하지 않는다. 원본도 한 페이지에 들어오면 null이었다.
// 페이지 이동이 없으므로 항상 렌더하지 않는다. 호출부는 limit/offset/total을 그대로 넘긴다.
export const ServerPagination: FC<Record<string, unknown>> = () => null
