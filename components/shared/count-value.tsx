import { IconBadge } from "@/components/shared/icon-badge"
import { display, displayBytes } from "@/lib/display"

// 카운트 축약 (k/m만). 20000 → 20k, 1500 → 1.5k, 23_000_000 → 23m.
function abbrevCount(n: number): string {
  const fmt = (v: number, suffix: string) => `${Number.isInteger(v) ? v : v.toFixed(1)}${suffix}`
  if (n >= 1_000_000) return fmt(n / 1_000_000, "m")
  if (n >= 1_000) return fmt(n / 1_000, "k")
  return String(n)
}

// 카운트 헬퍼 뱃지만 따로: 임계값(1,000)과 축약 표기를 여기 한 곳에 둔다. 읽기 뷰(CountValue)와
// 폼 입력(form-fields의 numberField)이 같은 규칙을 쓰도록 — 둘이 갈라지면 그게 더 나쁜 버그다.
export function CountBadge({ value }: { value: number }) {
  return value >= 1_000 ? <IconBadge>{abbrevCount(value)}</IconBadge> : null
}

// A count/quantity value: the raw number with thousands separators (1,234,567) plus an
// abbreviated (k/m) badge once it reaches 1,000. null/undefined → em-dash, matching display().
// For counts only — not fractions/scores/bytes/durations (those have their own formatters).
export function CountValue({ value }: { value?: number | null }) {
  if (value == null) return <>{display(value)}</>
  return (
    <span className="inline-flex items-center gap-1 tabular-nums">
      {value.toLocaleString("en-US")}
      <CountBadge value={value} />
    </span>
  )
}

// A byte count: same shape as CountValue — the raw byte count with thousands separators plus
// a human-readable badge (KB/MB/GB) once it reaches 1 KiB. The raw value is never replaced.
export function BytesValue({ value }: { value?: number | null }) {
  if (value == null) return <>{display(value)}</>
  return (
    <span className="inline-flex items-center gap-1 tabular-nums">
      {value.toLocaleString("en-US")}
      {value >= 1024 ? <IconBadge>{displayBytes(value)}</IconBadge> : null}
    </span>
  )
}
