// 리스트 시간 창 필터: URL은 상대 토큰(updated_within=3d)을 들고, 렌더 시점에
// 서버 wire 포맷(RFC3339, +09:00 고정 — openapi pattern 강제)으로 변환한다.
// 절대 타임스탬프 대신 상대 토큰을 쓰므로 URL이 rolling window로 동작한다.

const KST_OFFSET_MS = 9 * 3600_000

export function kstRfc3339(d: Date): string {
  return new Date(d.getTime() + KST_OFFSET_MS).toISOString().slice(0, 19) + "+09:00"
}

export const TIME_WINDOWS = ["1d", "3d", "7d", "30d"] as const

// "3d" → now-3d의 KST RFC3339. 미지정/미인식 토큰은 undefined (필터 없음).
export function windowStart(window?: string): string | undefined {
  if (!window) return undefined
  const m = /^(\d+)d$/.exec(window)
  if (!m) return undefined
  return kstRfc3339(new Date(Date.now() - Number(m[1]) * 86_400_000))
}
