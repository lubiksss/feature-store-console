import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { TruncateTip } from "@/components/shared/truncate-tip"
import { RoleBadge } from "@/components/shared/role-badge"

export interface FieldRow {
  // string → truncates with an overflow tooltip (TruncateTip). ReactNode → renders
  // as-is (used to embed an InfoTooltip next to the label text).
  label: string | React.ReactNode
  value: React.ReactNode
  label2?: string | React.ReactNode
  value2?: React.ReactNode
  // A third pair renders the row as a 6-column strip (for short-value fields).
  label3?: string | React.ReactNode
  value3?: React.ReactNode
  // A value that may occupy more than one line — it wraps instead of truncating.
  // Height is not what this controls: no cell clips its content (see ValueCell).
  multiline?: boolean
  // Overrides the table's label width for THIS row. A card widened for its own long field
  // names still carries rows from the shared vocabulary — the created_at / updated_at pair
  // reads the same on every screen, so it keeps the standard width.
  labels?: LabelWidth
}

// Single-line row height (min-h-8, vertically centered) so text / badge (h-5) / input (h-8)
// all occupy the exact same row height — no layout shift between view↔edit or field↔field.
// It is a MINIMUM, not a fixed height: a badge whose text wraps in a narrow column, or any
// taller child, grows the row instead of being clipped. Alignment is unaffected because a
// value that fits still lands at exactly 32px.
// NOTE: py-1.5 (12px) + h-8 (32px) = 44px total, kept in sync with the data tables'
// row height in data-table.tsx (h-11) so detail↔list rows line up. Change both together.
function ValueCell({
  children,
  colSpan,
  multiline,
}: {
  children: React.ReactNode
  colSpan?: number
  multiline?: boolean
}) {
  // Same policy as table cells: a single-line bare string/number value truncates
  // (with a tooltip on overflow) instead of being silently clipped by the card's
  // overflow-hidden. multiline values keep wrapping; rich children (badges/links)
  // self-truncate and pass through.
  const content =
    !multiline && (typeof children === "string" || typeof children === "number") ? (
      <TruncateTip>{children}</TruncateTip>
    ) : (
      children
    )
  return (
    <td className="px-4 py-1.5 align-middle tabular-nums" colSpan={colSpan}>
      <div className="flex min-h-8 min-w-0 items-center">{content}</div>
    </td>
  )
}

// labels sizes the label column. It is one axis, so it is one prop: "narrow" for half-width
// cards that still carry a 4-column (label|value|label|value) row — the partition twin's
// materialization/consistency cards — and "wide" where the field names themselves are long,
// as the operation policy's knob names are (materialization_kafka_produce_partitions).
// Truncation is the fallback, not the plan: a label the reader has to hover to finish is a
// label they cannot scan.
export type LabelWidth = "narrow" | "default" | "wide"

const LABEL_W: Record<LabelWidth, string> = {
  narrow: "w-44",
  default: "w-72",
  wide: "w-96",
}

export function FieldTable({
  rows,
  labels = "default",
}: {
  rows: FieldRow[]
  labels?: LabelWidth
}) {
  // Explicit 4-column widths so the left pair (label|value) and right pair are symmetric:
  // without a colgroup, single rows' colSpan=3 value makes table-fixed split cols 2-4 evenly,
  // widening the right label. colgroup pins col1==col3 (label) and col2==col4 (value).
  const labelW = LABEL_W[labels]
  const labelCell = "bg-muted px-4 py-1.5 font-medium align-middle"
  return (
    <div className="rounded-xl border overflow-hidden">
      <table className="w-full text-sm table-fixed">
        <colgroup>
          <col className={labelW} />
          <col />
          <col className={labelW} />
          <col />
        </colgroup>
        <tbody>
          {rows.map(
            ({ label, value, label2, value2, label3, value3, multiline, labels: rowLabels }, i) => (
              <tr key={typeof label === "string" ? label : i} className="border-b last:border-0">
                {label3 === undefined && rowLabels !== undefined && rowLabels !== labels ? (
                  // Same nested-colgroup trick the 3-pair strip uses: table-fixed pins widths
                  // per table, so a row wanting a different label width needs its own.
                  <td colSpan={4} className="p-0">
                    <table className="w-full table-fixed">
                      <colgroup>
                        <col className={LABEL_W[rowLabels]} />
                        <col />
                        <col className={LABEL_W[rowLabels]} />
                        <col />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td className={labelCell}>
                            {typeof label === "string" ? <TruncateTip>{label}</TruncateTip> : label}
                          </td>
                          <ValueCell multiline={multiline}>{value}</ValueCell>
                          {label2 !== undefined ? (
                            <>
                              <td className={labelCell}>
                                {typeof label2 === "string" ? (
                                  <TruncateTip>{label2}</TruncateTip>
                                ) : (
                                  label2
                                )}
                              </td>
                              <ValueCell multiline={multiline}>{value2}</ValueCell>
                            </>
                          ) : (
                            <td colSpan={2} />
                          )}
                        </tr>
                      </tbody>
                    </table>
                  </td>
                ) : label3 !== undefined ? (
                  // 3-pair row → nested symmetric 6-column strip (compact short-value fields).
                  <td colSpan={4} className="p-0">
                    <table className="w-full table-fixed">
                      <colgroup>
                        <col className={labelW} />
                        <col />
                        <col className={labelW} />
                        <col />
                        <col className={labelW} />
                        <col />
                      </colgroup>
                      <tbody>
                        <tr>
                          <td className={labelCell}>
                            <TruncateTip>{label}</TruncateTip>
                          </td>
                          <ValueCell>{value}</ValueCell>
                          <td className={labelCell}>
                            {typeof label2 === "string" ? (
                              <TruncateTip>{label2}</TruncateTip>
                            ) : (
                              label2
                            )}
                          </td>
                          <ValueCell>{value2}</ValueCell>
                          <td className={labelCell}>
                            {typeof label3 === "string" ? (
                              <TruncateTip>{label3}</TruncateTip>
                            ) : (
                              label3
                            )}
                          </td>
                          <ValueCell>{value3}</ValueCell>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                ) : (
                  <>
                    <td className={labelCell}>
                      {typeof label === "string" ? <TruncateTip>{label}</TruncateTip> : label}
                    </td>
                    {label2 !== undefined ? (
                      <>
                        <ValueCell multiline={multiline}>{value}</ValueCell>
                        <td className={labelCell}>
                          {typeof label2 === "string" ? (
                            <TruncateTip>{label2}</TruncateTip>
                          ) : (
                            label2
                          )}
                        </td>
                        <ValueCell multiline={multiline}>{value2}</ValueCell>
                      </>
                    ) : (
                      <ValueCell colSpan={3} multiline={multiline}>
                        {value}
                      </ValueCell>
                    )}
                  </>
                )}
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  )
}

export function SectionCard({
  title,
  icon: Icon,
  adminOnly,
  action,
  children,
}: {
  title: string
  icon?: LucideIcon
  // 이 리소스의 쓰기가 admin 전용이라는 표시 — 목록 셸과 같은 뱃지, 같은 뜻이다.
  adminOnly?: boolean
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between min-h-8">
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="size-4 text-foreground" />}
          {title}
          {adminOnly && <RoleBadge role="admin" />}
        </CardTitle>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
