import { TriangleAlertIcon, InboxIcon } from "lucide-react"
import { TableCell, TableRow } from "@/components/ui/table"
import type { ReadFailure } from "@/lib/read-failure"

interface Props {
  colSpan: number
  // 실패했다(boolean)가 아니라 "이렇게 실패했다". 서버가 문구를 보냈으면 그것을 보여준다 —
  // 목록이 실패를 boolean 으로 뭉개던 동안, 400(잘못된 필터)과 연결 불가가 화면에서 같은
  // 문장이었다. 연결 문구는 서버가 아무 말도 하지 못한 실패에만 쓴다.
  failure?: ReadFailure
  filtered?: boolean
  // 요청한 offset 이 결과 끝을 지나 서버가 빈 쪽을 준 자리. 목록에 행이 있는데도 이 쪽에만
  // 없는 것이라 "아직 없다"와 다른 사실이다 — 푸터의 "0 of N" 과 같은 판단(isPastEnd)에서 온다.
  pastEnd?: boolean
}

export function TableEmptyState({ colSpan, failure, filtered, pastEnd }: Props) {
  if (failure) {
    return (
      <TableRow className="hover:bg-transparent">
        <TableCell colSpan={colSpan} className="py-12">
          <div className="flex flex-col items-center gap-3 text-center">
            <TriangleAlertIcon className="size-8 text-status-failed" />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {failure.message ? "Failed to load data" : "Cannot connect to 서버"}
              </p>
              {/* break-words: 서버 문구에는 끊을 자리가 없는 긴 토큰이 온다(enum 20개 목록,
                  HDFS 경로, SQL 조각). 그것 하나가 표 밖으로 흘러 라운드 테두리에 잘린다. */}
              <p className="max-w-prose text-xs break-words text-muted-foreground">
                {failure.message ??
                  `Failed to load data. Please refresh in a moment.${
                    failure.status ? ` (HTTP ${failure.status})` : ""
                  }`}
              </p>
              {/* request_id 는 이 화면이 서버 로그와 대조되는 유일한 실. 선택 가능하게 둔다. */}
              {failure.requestId ? (
                <p className="font-mono text-xs text-muted-foreground select-all">
                  request_id: {failure.requestId}
                </p>
              ) : null}
            </div>
          </div>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="py-12">
        <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
          <InboxIcon className="size-7" />
          {/* 왜 비었는지를 가장 좁은 사실부터 고른다: 이 쪽에 없다 → 필터가 걸러냈다 → 아직 없다. */}
          <p className="text-sm">
            {pastEnd
              ? "No items on this page"
              : filtered
                ? "No results match the filter"
                : "No items yet"}
          </p>
        </div>
      </TableCell>
    </TableRow>
  )
}
