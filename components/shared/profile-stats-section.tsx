import type { ComponentProps } from "react"
import { FieldTable, SectionCard } from "@/components/shared/detail-section"
import { ChartColumnIcon } from "lucide-react"
import { CountValue } from "@/components/shared/count-value"
import { display } from "@/lib/display"
import { InfoTooltip } from "@/components/shared/info-tooltip"
import { PROFILE_INFO } from "@/lib/catalog-enums"

// The statistic columns both profile planes carry. fs_feature_view_profile (Hive) and
// fs_store_profile (serving store) report the SAME set under the same names, so this
// renders either — the front mirror of the same field walk both pipelines use.
// A copy here would drift on the first change to either, which is the failure it prevents.
export interface ProfileStats {
  row_count?: number | null
  null_count?: number | null
  distinct_count?: number | null
  empty_count?: number | null
  zeros_count?: number | null

  length_min?: number | null
  length_p25?: number | null
  length_p50?: number | null
  length_p75?: number | null
  length_p95?: number | null
  length_p99?: number | null
  length_max?: number | null
  length_mean?: number | null
  length_stddev?: number | null

  size_min?: number | null
  size_p25?: number | null
  size_p50?: number | null
  size_p75?: number | null
  size_p95?: number | null
  size_p99?: number | null
  size_max?: number | null
  size_mean?: number | null
  size_stddev?: number | null

  numeric_min?: number | null
  numeric_p25?: number | null
  numeric_p50?: number | null
  numeric_p75?: number | null
  numeric_p95?: number | null
  numeric_p99?: number | null
  numeric_max?: number | null
  numeric_mean?: number | null
  numeric_stddev?: number | null

  top_values?: Record<string, unknown> | null
}

const has = (...vs: (number | null | undefined)[]) => vs.some((v) => v !== null && v !== undefined)

// One node fills the COMMON plane plus AT MOST ONE type plane — a string measures character
// length, a collection measures entry count, a number describes its own value. Showing the
// two it did not fill would be twenty empty cells, so each block appears only when it holds
// something. The units differ, which is exactly why they are not one family of columns.
// 라벨 옆 ⓘ. 상세 카드들이 쓰는 관용구와 같다(서버 컴포넌트라 헬퍼 호출이 아니라 인라인).
function labeled(text: string, info?: string) {
  if (!info) return text
  return (
    <span className="flex items-center justify-between gap-1.5">
      {text}
      <InfoTooltip text={info} />
    </span>
  )
}

export function ProfileStatsSection({ data }: { data: ProfileStats }) {
  // One block per plane, same nine positions. numeric measures the VALUE, the other two
  // measure how big it is — the shape is shared, the unit is not.
  const extent = (
    prefix: "length" | "size" | "numeric",
    v: {
      min?: number | null
      p25?: number | null
      p50?: number | null
      p75?: number | null
      p95?: number | null
      p99?: number | null
      max?: number | null
      mean?: number | null
      stddev?: number | null
    },
  ) => [
    {
      label: labeled(`${prefix}_min`, PROFILE_INFO[prefix]),
      value: <CountValue value={v.min} />,
      label2: `${prefix}_mean`,
      value2: <CountValue value={v.mean} />,
      label3: `${prefix}_max`,
      value3: <CountValue value={v.max} />,
    },
    {
      label: `${prefix}_p25`,
      value: <CountValue value={v.p25} />,
      label2: `${prefix}_p50`,
      value2: <CountValue value={v.p50} />,
      label3: `${prefix}_p75`,
      value3: <CountValue value={v.p75} />,
    },
    {
      label: `${prefix}_p95`,
      value: <CountValue value={v.p95} />,
      label2: `${prefix}_p99`,
      value2: <CountValue value={v.p99} />,
      label3: `${prefix}_stddev`,
      value3: <CountValue value={v.stddev} />,
    },
  ]

  // Counts first, two per row: what was observed (row/distinct), then what was degenerate
  // (empty/null). empty_count is common rather than per-plane — a numeric node simply has
  // none, and reading it as "—" beside null_count is clearer than moving the label around.
  const rows: ComponentProps<typeof FieldTable>["rows"] = [
    {
      label: labeled("row_count", PROFILE_INFO.row_count),
      value: <CountValue value={data.row_count} />,
      label2: labeled("distinct_count", PROFILE_INFO.distinct_count),
      value2: <CountValue value={data.distinct_count} />,
    },
    {
      label: labeled("empty_count", PROFILE_INFO.empty_count),
      value: <CountValue value={data.empty_count} />,
      label2: labeled("null_count", PROFILE_INFO.null_count),
      value2: <CountValue value={data.null_count} />,
    },
  ]

  if (
    has(data.length_min, data.length_max, data.length_mean, data.length_p50, data.length_stddev)
  ) {
    rows.push(
      ...extent("length", {
        min: data.length_min,
        p25: data.length_p25,
        p50: data.length_p50,
        p75: data.length_p75,
        p95: data.length_p95,
        p99: data.length_p99,
        max: data.length_max,
        mean: data.length_mean,
        stddev: data.length_stddev,
      }),
    )
  }

  if (has(data.size_min, data.size_max, data.size_mean, data.size_p50, data.size_stddev)) {
    rows.push(
      ...extent("size", {
        min: data.size_min,
        p25: data.size_p25,
        p50: data.size_p50,
        p75: data.size_p75,
        p95: data.size_p95,
        p99: data.size_p99,
        max: data.size_max,
        mean: data.size_mean,
        stddev: data.size_stddev,
      }),
    )
  }

  if (
    has(
      data.numeric_min,
      data.numeric_max,
      data.numeric_mean,
      data.numeric_p50,
      data.numeric_stddev,
    )
  ) {
    rows.push({
      label: labeled("zeros_count", PROFILE_INFO.zeros_count),
      value: <CountValue value={data.zeros_count} />,
    })
    rows.push(
      ...extent("numeric", {
        min: data.numeric_min,
        p25: data.numeric_p25,
        p50: data.numeric_p50,
        p75: data.numeric_p75,
        p95: data.numeric_p95,
        p99: data.numeric_p99,
        max: data.numeric_max,
        mean: data.numeric_mean,
        stddev: data.numeric_stddev,
      }),
    )
  }

  const topValues = data.top_values ? JSON.stringify(data.top_values, null, 2) : undefined
  rows.push({
    label: labeled("top_values", PROFILE_INFO.top_values),
    value: topValues ? (
      <pre className="whitespace-pre-wrap font-mono text-xs">{topValues}</pre>
    ) : (
      display(undefined)
    ),
    multiline: true,
  })

  return (
    <SectionCard title="Stats" icon={ChartColumnIcon}>
      <FieldTable rows={rows} />
    </SectionCard>
  )
}
