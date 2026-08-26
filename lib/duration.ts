const UNITS = [
  [86400, "day"],
  [3600, "hour"],
  [60, "minute"],
  [1, "second"],
] as const

// 총 초를 나머지 없이 표현할 수 있는 가장 큰 단위 하나로 변환한다.
// 예: 108000초 → 30 hour, 129600초 → 36 hour, 3661초 → 3661 second.
export function exactDurationUnit(totalSeconds: number) {
  const [secondsPerUnit, unit] = UNITS.find(
    ([seconds]) => totalSeconds !== 0 && totalSeconds % seconds === 0,
  ) ?? [1, "second"]

  return { value: totalSeconds / secondsPerUnit, unit }
}
