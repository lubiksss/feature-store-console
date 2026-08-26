import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { RoleBadge } from "@/components/shared/role-badge"
import { DataTable } from "@/components/shared/data-table"
import { ServerPagination } from "@/components/shared/table-controls"
import { rangeLabel } from "@/lib/pagination"

interface Props {
  title: string
  icon?: LucideIcon
  // 이 리소스의 쓰기가 admin 전용이라는 표시. 계정 드롭다운의 role 뱃지와 같은 것을 쓴다 —
  // "내 뱃지가 admin 이 아니면 여기서 아무것도 만들 수 없다"가 한 번에 읽혀야 한다.
  adminOnly?: boolean
  action?: React.ReactNode
  limit: number
  offset: number
  total: number
  footerUnit: string
  className?: string
  columns?: (string | undefined)[]
  children: React.ReactNode
}

export function SummaryTableShell({
  title,
  icon: Icon,
  adminOnly,
  action,
  limit,
  offset,
  total,
  footerUnit,
  className,
  columns,
  children,
}: Props) {
  return (
    <Card className={cn("flex flex-col min-h-0", className)}>
      <CardHeader className="flex flex-row items-center justify-between min-h-8">
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="size-4 text-foreground" />}
          {title}
          {adminOnly && <RoleBadge role="admin" />}
        </CardTitle>
        {action}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 min-h-0">
        <DataTable scroll>
          {columns ? (
            <colgroup>
              {columns.map((width, i) => (
                <col key={i} style={width ? { width } : undefined} />
              ))}
            </colgroup>
          ) : null}
          {children}
        </DataTable>
      </CardContent>
      <CardFooter className="flex items-center justify-between py-2">
        <p className="text-sm tabular-nums">
          {rangeLabel(limit, offset, total)} {footerUnit}
        </p>
        <ServerPagination limit={limit} offset={offset} total={total} />
      </CardFooter>
    </Card>
  )
}
