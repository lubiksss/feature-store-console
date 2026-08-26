import Image, { type StaticImageData } from "next/image"
import { type LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

// 설명 카드(stream spec Pipeline, Guide)를 쓰는 공용 프리미티브.
// 규약: 줄글로 설명 가능한 건 Facts 불릿으로, 값/조건에 따라 분기하는 것만 CondTable로.
// server component에서도 쓰므로 "use client"를 붙이지 않는다(상태 없음).
//
// 뱃지 어휘: 화면에서 객체인 것만 뱃지다 — 필드값(Val), enum 값(EnumBadge), 액션(ActionBadge),
// 화면·카드(IconBadge), role(RoleBadge). 필드 "이름"만 가리킬 때는 평문으로 쓴다(Guide처럼
// 인스턴스가 없는 문서). Val은 값이 없으면 "컬럼(-)"으로 렌더돼 "값 없음"을 뜻하므로, 이름만
// 가리키는 자리에 쓰면 없는 값이 있는 것처럼 읽힌다.

// 필드값 슬롯을 색 없는(outline) 뱃지로 렌더. 내부에 "컬럼(값)"을 함께 적어 이름/값 혼동을 없앤다.
export function Val({ col, children }: { col: string; children?: React.ReactNode }) {
  return (
    <Badge variant="outline" className="align-middle font-normal">
      {col}({children == null || children === "" ? "-" : children})
    </Badge>
  )
}

export function Stage({
  index,
  title,
  children,
}: {
  index: number
  title: string
  children: React.ReactNode
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-foreground bg-background text-xs font-medium tabular-nums">
        {index}
      </span>
      <div className="min-w-0 flex-1 space-y-2">
        <p className="text-sm font-medium">{title}</p>
        {children}
      </div>
    </li>
  )
}

// 스테이지 설명을 불릿 목록으로. 명사형(terse) 종결로 쓴다.
export function Facts({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground marker:text-muted-foreground">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  )
}

// 예시 데이터 등 데이터 형태를 그대로 보여주는 코드 블록.
export function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="mt-1 overflow-x-auto rounded border bg-muted px-2 py-1 font-mono text-xs leading-relaxed">
      {children}
    </pre>
  )
}

// 문서용 그림. 글로 설명한 것을 한 장으로 되짚는 자리이므로 캡션은 두지 않는다 — 그림이
// 새 사실을 말하면 그건 Facts 불릿으로 가야 한다.
//
// static import 로 받는다: 경로가 틀리면 런타임 404 가 아니라 빌드가 깨지고, width/height 가
// 파일에서 나와 레이아웃 시프트가 없다. **피처 뷰는 avif 로 두지 않는다** — Next 의 치수 판독이
// avif 를 모르고 100x100 으로 떨어져서, 예약되는 자리가 정사각형이 되고 이 프리미티브가
// 막으려는 시프트가 그대로 생긴다(실측: avif 100x100 / webp·png 977x586). webp 를 쓴다:
// 치수를 읽고, 크기도 avif 보다 작았다(47.7KB vs 56.3KB).
//
// 사용자가 받는 것은 이 파일이 아니다 — next/image 가 Accept 를 보고 재인코딩한다
// (실측: webp 지원 브라우저는 9.5KB, 구형은 jpeg 12.6KB).
//
// 크기는 **박스 고정**이다. 높이만 맞추면 종횡비가 다른 그림들이 서로 다른 폭이 되어(실측
// 16.26rem vs 15.05rem) 나란히 놓인 썸네일이 어긋난다. 그래서 두 축을 다 고정하고 그림은
// object-contain 으로 그 안에 맞춘다 — 잘리지 않고, 박스는 어느 그림이든 같다.
//
//   높이 h-39 = 9.75rem = Facts 6줄
//     한 줄 = text-sm(0.875rem) × leading-relaxed(1.625) = 1.421875rem
//     6줄 + space-y-1(0.25rem) 다섯 칸 = 8.53125 + 1.25 = 9.78rem (h-39 와 0.5px 차)
//   폭  w-66 = 16.5rem = 그 높이에서 가장 넓어지는 그림(종횡비 1.667)의 16.26rem 을 담는 값
//
// 종횡비가 이보다 좁은 그림은 좌우에 배경이 조금 남는다. 박스가 같은 것이 그 여백보다 중요하다
// — 여백은 카드 배경과 같은 색이라 눈에 띄지 않지만, 어긋난 박스는 바로 보인다.
//
// 좁은 화면(sm 미만)에서는 불릿 아래로 쌓이므로 그때만 한 폭 전체를 쓴다. sizes 는 두 축을
// 그대로 알려 준다 — 없으면 Next 가 뷰포트 전체 폭 후보를 만들어 실제로 쓰지 않는 큰 파일을
// 받는다.
//
// 클릭하면 원본을 새 탭에서 연다. 썸네일 폭에서 작은 라벨은 읽히지 않고, 원본을 보는 길이
// 없으면 그림이 장식이 된다. 링크는 next/image 가 만든 리사이즈본이 아니라 src.src — 콘텐츠
// 해시가 붙은 정적 경로이므로 파일이 옮겨져도 따라간다. 다이얼로그로 띄우지 않는 이유는 이
// 모듈의 규약이다: 상태가 없어 server component 에서도 쓰이고, "use client" 는 파일 단위라
// 그 성질을 이 모듈 전체에서 잃는다.
export function Figure({
  src,
  alt,
  caption,
  className,
}: {
  src: StaticImageData
  alt: string
  /** 출처나 성격을 밝히는 한 줄. 인용한 도판에는 반드시 붙인다. */
  caption?: string
  className?: string
}) {
  return (
    <figure
      className={cn(
        "w-full overflow-hidden rounded-lg border bg-background sm:w-66",
        className,
      )}
    >
      <a
        href={src.src}
        target="_blank"
        rel="noreferrer"
        className="block cursor-zoom-in transition-opacity hover:opacity-80"
      >
        <Image
          src={src}
          alt={alt}
          sizes="(min-width: 640px) 17rem, 100vw"
          className="h-auto w-full sm:h-full sm:w-full sm:object-contain"
        />
      </a>
      {caption && (
        <figcaption className="border-t px-2 py-1 text-[10px] leading-tight text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// 문서용 표. 헤더가 필요하고 설명 칸이 줄바꿈돼야 하므로 shadcn Table 프리미티브로 세운다 —
// 헤더 스타일(bg-muted + h-10)을 새로 발명하지 않고 앱의 데이터 표와 같은 모양이 된다.
// 첫 칸은 라벨(뱃지)이라 한 줄로 두고, 나머지 칸은 문장이 흐르도록 줄바꿈을 허용한다.
// 열 폭은 고정한다 — 표를 위아래로 쌓아 읽으므로 표마다 열이 어긋나면 비교가 끊긴다.
//   - 첫 열 w-44: 가장 긴 라벨(retirement_failed 뱃지)이 들어가고도 남는 폭
//   - 3열 표의 마지막 열 w-72: 가장 긴 값("시스템이 운영하는 배치 파이프라인")이 한 줄에 들어가는 폭
//   - 가운데 설명 열은 남는 폭 전부 (table-fixed라 지정하지 않은 열이 나머지를 가져간다)
// table-fixed가 있어야 위 폭이 내용과 무관하게 그대로 유지된다.
// 열이 넷 이상이면 이 위치 규칙이 맞지 않는다(체크 한 칸짜리 열과 설명 열이 같은 폭을 받는다).
// 그때는 widths 로 열별 폭을 직접 준다 — undefined 로 둔 열이 남는 폭을 전부 가져간다.
function colWidth(i: number, n: number): string | undefined {
  if (i === 0) return "w-44"
  if (n >= 3 && i === n - 1) return "w-72"
  return undefined
}
export function DocTable({
  head,
  rows,
  widths,
}: {
  head: string[]
  rows: React.ReactNode[][]
  widths?: (string | undefined)[]
}) {
  const width = (i: number, n: number) => (widths ? widths[i] : colWidth(i, n))
  return (
    <div className="overflow-hidden rounded-lg border">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            {head.map((h, i) => (
              <TableHead key={h} className={cn("px-3", width(i, head.length))}>
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((cells, i) => (
            <TableRow key={i}>
              {cells.map((cell, j) => (
                <TableCell
                  key={j}
                  className={cn(
                    "px-3 py-2 align-top",
                    width(j, cells.length),
                    j > 0 && "whitespace-normal leading-relaxed",
                  )}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// 값에 따라 분기하는 필드의 조건 → 동작 테이블. 좌측(조건)은 label 셀, 우측(동작)은 값 셀.
// 동작 셀 안에서 또 분기하면 dense 테이블을 중첩한다(테이블 속 테이블).
// 세 번째 튜플 요소 active=이 스펙 값이 만족하는 행 → enum 선택과 같은 검은 뱃지로 강조.
// undefined는 강조도 흐림도 없는 중립(문서처럼 특정 값을 전제하지 않는 표).
// 네 번째 튜플 요소 Icon은 기존 enum 뱃지처럼 조건의 의미를 나타낸다.
export type CondRow = [React.ReactNode, React.ReactNode, boolean | undefined, LucideIcon]

export function CondTable({ rows, dense }: { rows: CondRow[]; dense?: boolean }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border", dense && "mt-2")}>
      <table className="w-full text-sm">
        <tbody>
          {rows.map(([cond, act, active, Icon], i) => {
            return (
              <tr key={i} className="border-b last:border-0">
                <td
                  className={cn(
                    "whitespace-nowrap bg-muted px-3 py-1.5 align-top font-medium",
                    dense ? "w-20" : "w-40",
                  )}
                >
                  <Badge
                    variant={active ? "default" : "outline"}
                    className={cn(active === false && "opacity-40")}
                  >
                    <Icon className="size-3" />
                    {cond}
                  </Badge>
                </td>
                <td className="px-3 py-1.5 align-top leading-relaxed text-foreground">{act}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
