"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { LiveDot } from "@/components/shared/live-dot"
import { TruncateTip } from "@/components/shared/truncate-tip"
import { cn } from "@/lib/utils"
import { BadgeLink } from "@/components/shared/badge-link"
import { optionGroups, type EnumOption } from "@/lib/catalog-enums"

// V 는 이 어휘의 값 타입(계약 enum)이다. 옵션이 값을 실어 오므로 onChange 는 그 타입 그대로
// 돌려줄 수 있고, 폼 상태가 문자열로 넓어지지 않는다. 빈 문자열은 "선택 없음"이다.
interface Props<V extends string> {
  options: readonly EnumOption<V>[]
  value: string
  onChange?: (value: V | "") => void
  disabled?: boolean
  readOnly?: boolean
  // allowDeselect: optional enum — clicking the selected badge clears it back to "".
  allowDeselect?: boolean
  // hrefFor: read-only enums whose values have an external console (e.g. hadoop_cluster) render
  // every badge as a link to its own console, so the enum shows the whole vocabulary AND each
  // value stays reachable. Ignored when editable (there a click picks the value).
  hrefFor?: (value: string) => string
  // selectedHref: an in-app destination for the CURRENT value only (e.g. lifecycle_status → the
  // featureView's event history). Unlike hrefFor this is one link, not one per value: the dimmed
  // badges are states the resource is not in, and pointing them at the same page would promise
  // something the destination does not show. A string, not a builder, so a server component can
  // pass it across the boundary.
  selectedHref?: string
}

// Only a value long enough to plausibly outgrow the narrowest value cell gets truncation and a
// tooltip trigger. Wrapping every badge would put a tooltip root + ResizeObserver on all 65 of a
// featureView detail page's badges to serve the one that needs it. 32 is a deliberate underestimate of
// what fits (text-xs in the ~256px value column holds roughly 40 chars), so the gate errs toward
// enabling the tip; short badges keep the atom's own shrink-0 sizing untouched.
const TIP_MIN_CHARS = 32

// 뱃지 마크업은 한 곳이다. 단일 선택(BadgeSelect)과 다중 선택(BadgeMultiSelect)이 같은 것을
// 그려야 하고, 각자 복사해두면 톤이나 truncate 규칙이 한쪽만 바뀐다.
function optionBadge<V extends string>(
  { value: v, icon: Icon, tone, running }: EnumOption<V>,
  selected: boolean,
) {
  const long = v.length >= TIP_MIN_CHARS
  return (
    <Badge
      variant={selected ? "default" : "outline"}
      // Long values only: min-w-0/max-w-full/shrink undo the atom's shrink-0 so the value clamps
      // to the cell and truncates, instead of running past the card edge where its
      // overflow-hidden would clip it with no way to read the rest.
      className={cn("gap-1", long && "min-w-0 max-w-full shrink", selected && tone)}
    >
      <Icon className="size-3" />
      {long ? <TruncateTip>{v}</TruncateTip> : v}
      {/* 선택된 것만: 현재 상태가 아닌 옵션에 진행 중 신호를 달면 거짓말이 된다. */}
      {running && selected ? <LiveDot /> : null}
    </Badge>
  )
}

// 스트립의 레이아웃도 한 곳이다(그룹 줄바꿈 + min-w-0 이 truncate 를 살리는 자리).
function BadgeStrip<V extends string>({
  rows,
  render,
}: {
  rows: readonly (readonly EnumOption<V>[])[]
  render: (opt: EnumOption<V>) => React.ReactNode
}) {
  // min-w-0 on the root is load-bearing, not decoration: this box is a flex item of the value
  // cell's row, so without it its automatic minimum size stays at min-content — the widest badge —
  // and every max-w-full/shrink below never engages. Truncation is a no-op without this class.
  return (
    <div className="flex min-w-0 flex-col gap-2">
      {rows.map((row, i) => (
        <div key={i} className="flex flex-wrap items-center gap-1.5">
          {row.map(render)}
        </div>
      ))}
    </div>
  )
}
export function BadgeSelect<V extends string>({
  options,
  value,
  onChange,
  disabled,
  readOnly,
  allowDeselect,
  hrefFor,
  selectedHref,
}: Props<V>) {
  // Case-insensitive match: some stored values are upper-cased while options are canonical lowercase.
  const normalized = value.toLowerCase()
  // Long vocabularies declare shape-family groups next to themselves (see optionGroups); the strip
  // breaks a row at each boundary and flows freely inside it. Everything else is one row, so the
  // outer vertical gap collapses and existing enums render exactly as before — this is additive,
  // not a second layout path to keep in sync. Read-only strip and form share it, so they can't drift.
  const rows = optionGroups(options) ?? [options]

  function renderOption(opt: EnumOption<V>) {
    const v = opt.value
    const selected = v.toLowerCase() === normalized
    const badge = optionBadge(opt, selected)
    if (readOnly) {
      // In-app first, matching EnumBadge: a destination scoped to this resource is more specific
      // than the value's generic console. No target/rel — it navigates within the admin.
      // stopPropagation because a list row may itself be clickable.
      if (selected && selectedHref) {
        return (
          <BadgeLink key={v} href={selectedHref} className="min-w-0">
            {badge}
          </BadgeLink>
        )
      }
      const href = hrefFor?.(v)
      // 콘솔 링크는 선택되지 않은 옵션을 흐리게(opacity-40) 두는 자기 스타일이 있어 BadgeLink의
      // 기본 hover와 맞지 않는다. 여기만 자체 Link를 유지한다.
      if (href) {
        return (
          <Link
            key={v}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "min-w-0 rounded-4xl outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-ring",
              selected ? "hover:opacity-80" : "opacity-40 hover:opacity-100",
            )}
          >
            {badge}
          </Link>
        )
      }
      return (
        <span key={v} className={cn("min-w-0", !selected && "opacity-40")}>
          {badge}
        </span>
      )
    }
    return (
      <button
        key={v}
        type="button"
        disabled={disabled}
        onClick={() => onChange?.(selected && allowDeselect ? "" : v)}
        className={cn(
          "min-w-0 outline-none rounded-4xl transition-opacity focus-visible:ring-2 focus-visible:ring-ring",
          selected ? "" : "opacity-40 hover:opacity-100",
          disabled && "cursor-not-allowed",
        )}
      >
        {badge}
      </button>
    )
  }

  return <BadgeStrip rows={rows} render={renderOption} />
}
