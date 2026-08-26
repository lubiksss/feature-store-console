// 대시보드 패널의 자리를 채우는 차트.
//
// 원본은 이 자리에 Grafana 패널을 iframe 으로 끼운다. 정적 데모에는 Grafana 가 없으므로
// 같은 자리에 같은 성격의 차트를 인라인 SVG 로 그린다 — 라이브 지표가 아니라 합성 데이터다.
//
// 색은 두 가지만 쓴다: 단일 시리즈는 파랑, 성공/실패로 갈리는 곳만 파랑/빨강.
// 초록/빨강 조합은 적록색약에서 구분되지 않아(ΔE 4.1) 쓰지 않는다. 두 시리즈 차트는
// 범례를 항상 띄워 색만으로 정체가 결정되지 않게 한다.
//
// 축·격자는 후퇴색(text token), 마크만 색을 갖는다. 다크모드는 자동 반전이 아니라
// 각 모드에 맞춰 고른 값이다.
import { cn } from "@/lib/utils"

// ─── 결정적 합성 데이터 ────────────────────────────────────────────────────────
// Math.random 을 쓰면 빌드마다 그림이 흔들린다. seed 로 고정한다.
function series(seed: number, n: number, base: number, amp: number): number[] {
  let s = seed >>> 0
  const out: number[] = []
  for (let i = 0; i < n; i++) {
    s = (s * 1664525 + 1013904223) >>> 0
    const noise = (s / 0x100000000 - 0.5) * amp
    const drift = (i / n) * amp * 0.6
    out.push(Math.max(0, base + drift + noise))
  }
  return out
}

const PATH_W = 320
const PATH_H = 96
const PAD = { t: 8, r: 4, b: 16, l: 4 }

function scaleX(i: number, n: number) {
  return PAD.l + (i / Math.max(1, n - 1)) * (PATH_W - PAD.l - PAD.r)
}
function scaleY(v: number, max: number) {
  return PATH_H - PAD.b - (v / (max || 1)) * (PATH_H - PAD.t - PAD.b)
}

function ChartFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg
      viewBox={`0 0 ${PATH_W} ${PATH_H}`}
      className="h-auto w-full"
      role="img"
      aria-label={label}
    >
      {/* 기준선. 격자는 두지 않는다 — 패널이 작아 눈금이 마크를 이긴다 */}
      <line
        x1={PAD.l}
        y1={PATH_H - PAD.b}
        x2={PATH_W - PAD.r}
        y2={PATH_H - PAD.b}
        className="stroke-border"
        strokeWidth={1}
      />
      {children}
    </svg>
  )
}

// ─── 추이 (단일 시리즈 영역) ───────────────────────────────────────────────────
export function TrendChart({
  seed,
  base,
  amp,
  points = 30,
  label,
}: {
  seed: number
  base: number
  amp: number
  points?: number
  label: string
}) {
  const data = series(seed, points, base, amp)
  const max = Math.max(...data) * 1.15
  const line = data.map((v, i) => `${i === 0 ? "M" : "L"}${scaleX(i, points)},${scaleY(v, max)}`).join(" ")
  const area = `${line} L${scaleX(points - 1, points)},${PATH_H - PAD.b} L${scaleX(0, points)},${PATH_H - PAD.b} Z`
  const last = data[data.length - 1]

  return (
    <div className="w-full">
      <ChartFrame label={label}>
        <path d={area} className="fill-[var(--viz-1)] opacity-15" />
        <path d={line} fill="none" className="stroke-[var(--viz-1)]" strokeWidth={2} strokeLinejoin="round" />
        {/* 마지막 값만 점을 찍는다 — 모든 점에 마커를 두면 선을 이긴다 */}
        <circle cx={scaleX(points - 1, points)} cy={scaleY(last, max)} r={3} className="fill-[var(--viz-1)]" />
      </ChartFrame>
      <p className="mt-1 text-right text-xs tabular-nums text-muted-foreground">
        현재 {Math.round(last).toLocaleString()}
      </p>
    </div>
  )
}

// ─── 성공/실패 누적 막대 ───────────────────────────────────────────────────────
export function OutcomeBars({ seed, label }: { seed: number; label: string }) {
  const days = 14
  const ok = series(seed, days, 42, 18)
  const fail = series(seed + 7, days, 2, 3)
  const max = Math.max(...ok.map((v, i) => v + fail[i])) * 1.15
  const bw = (PATH_W - PAD.l - PAD.r) / days - 3

  return (
    <div className="w-full">
      <ChartFrame label={label}>
        {ok.map((v, i) => {
          const x = PAD.l + (i * (PATH_W - PAD.l - PAD.r)) / days
          const yOk = scaleY(v, max)
          const yTop = scaleY(v + fail[i], max)
          return (
            <g key={i}>
              {/* 아래 세그먼트는 위쪽을 각지게 둔다 — 둥글면 위 세그먼트와 사이가 떠 보인다 */}
              <rect x={x} y={yOk} width={bw} height={PATH_H - PAD.b - yOk} className="fill-[var(--viz-1)]" />
              {/* 위 세그먼트만 데이터 끝을 둥글게. 사이 1 단위 면 간격으로 경계를 만든다 */}
              <rect
                x={x}
                y={yTop}
                width={bw}
                height={Math.max(1, yOk - yTop - 1)}
                rx={1}
                className="fill-[var(--viz-2)]"
              />
            </g>
          )
        })}
      </ChartFrame>
      {/* 시리즈가 둘이므로 범례는 항상 띄운다 */}
      <div className="mt-1 flex items-center justify-end gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-sm bg-[var(--viz-1)]" aria-hidden />
          성공
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2 rounded-sm bg-[var(--viz-2)]" aria-hidden />
          실패
        </span>
      </div>
    </div>
  )
}

// ─── 분포 (수평 막대) ──────────────────────────────────────────────────────────
export function DistributionBars({
  items,
  label,
}: {
  items: { name: string; value: number }[]
  label: string
}) {
  const max = Math.max(...items.map((i) => i.value)) || 1
  return (
    <div className="w-full space-y-1.5" role="img" aria-label={label}>
      {items.map((it) => (
        <div key={it.name} className="flex items-center gap-2">
          <span className="w-28 shrink-0 truncate text-xs text-muted-foreground">{it.name}</span>
          <span className="h-3 flex-1 overflow-hidden rounded-sm bg-muted">
            <span
              className="block h-full rounded-sm bg-[var(--viz-1)]"
              style={{ width: `${Math.max(4, (it.value / max) * 100)}%` }}
            />
          </span>
          <span className="w-10 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
            {it.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── 비율 (게이지) ─────────────────────────────────────────────────────────────
// 값 하나가 헤드라인인 자리는 차트보다 숫자가 낫다. 숫자를 크게 두고 막대는 보조로.
export function ScoreGauge({ value, label }: { value: number; label: string }) {
  const pct = Math.round(value * 1000) / 10
  return (
    <div className="w-full" role="img" aria-label={`${label}: ${pct}%`}>
      <p className="text-2xl font-semibold tabular-nums">{pct}%</p>
      <span className="mt-2 block h-2 overflow-hidden rounded-sm bg-muted">
        <span className="block h-full rounded-sm bg-[var(--viz-1)]" style={{ width: `${pct}%` }} />
      </span>
      <p className="mt-1 text-xs text-muted-foreground">최근 7일 평균</p>
    </div>
  )
}

// ─── 색 토큰 ──────────────────────────────────────────────────────────────────
// 검증기 통과 값. 두 모드 각각에 맞춰 고른 것이며 자동 반전이 아니다.
// 적록 조합을 피해 파랑/빨강을 쓴다(성공/실패 쌍 CVD ΔE 25.7).
export function VizTokens() {
  return (
    <style>{`
      .viz-root { --viz-1: #2a78d6; --viz-2: #d03b3b; }
      @media (prefers-color-scheme: dark) {
        :root:not([data-theme="light"]) .viz-root { --viz-1: #3987e5; --viz-2: #d03b3b; }
      }
      :root[data-theme="dark"] .viz-root { --viz-1: #3987e5; --viz-2: #d03b3b; }
    `}</style>
  )
}

export function VizRoot({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("viz-root", className)}>
      <VizTokens />
      {children}
    </div>
  )
}
