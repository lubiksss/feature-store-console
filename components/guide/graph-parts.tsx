import type { LucideIcon } from "lucide-react"
import { EnumBadge, type EnumSet } from "@/components/shared/enum-badges"
import { ActionBadge } from "@/components/guide/action-badge"

// 가이드 도식(상태 머신 / 파티션 진행)이 공유하는 SVG 조각들.
// 노드는 foreignObject 안에 실제 뱃지를 넣는다 — 선과 화살촉은 같은 좌표계의 path + marker라
// 굵기와 끝점이 정확히 맞고, 노드는 화면에 뜨는 그 뱃지 그대로다. 색은 전부 토큰이라 다크모드가
// 자동으로 따라온다.
//
// 공통 규약:
//  - 노드 박스(foreignObject)는 글자가 잘리지 않게 넉넉히 잡고, 간선 끝점은 박스가 아니라 뱃지
//    실제 가장자리에 붙인다. 뱃지 높이는 20이라 위아래 경계는 cy±10.
//  - 라벨은 자기 간선의 가운데에 얹고 카드색 배경으로 선을 끊는다.
//  - 화살촉 marker id는 도식마다 다르게 준다(한 문서에 두 도식이 함께 뜨므로 id가 겹치면 안 된다).
//  - 같은 marker를 markerStart로도 쓸 수 있다(양방향 간선). refX/refY가 삼각형 꼭지점이라
//    orient=auto-start-reverse면 시작점에서도 꼭지가 정확히 끝점에 닿고 방향만 뒤집힌다.

export const arrow = (id: string) => `url(#${id})`

export function ArrowMarker({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
        viewBox="0 0 8 8"
        refX="7"
        refY="4"
        markerWidth="8"
        markerHeight="8"
        markerUnits="userSpaceOnUse"
        orient="auto-start-reverse"
      >
        <path d="M1,1 L7,4 L1,7 z" className="fill-muted-foreground" />
      </marker>
    </defs>
  )
}

export function EdgeLabel({ x, y, w, text }: { x: number; y: number; w: number; text: string }) {
  return (
    <>
      <rect x={x - w / 2} y={y - 8} width={w} height={16} rx={3} className="fill-card" />
      {/* 간선 라벨은 svg의 aria-label이 이미 서술하므로 AT에는 감춘다 — role=group이라
          내부 텍스트가 그대로 노출되면 같은 내용을 두 번 읽는다. */}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        aria-hidden="true"
        className="fill-foreground text-xs"
      >
        {text}
      </text>
    </>
  )
}

// 노드 = 실제 enum 뱃지. 박스 폭은 뱃지가 가운데 오도록 넉넉히 주고 flex로 정렬한다.
export function GraphNode({
  cx,
  cy,
  w,
  set,
  value,
}: {
  cx: number
  cy: number
  w: number
  set: EnumSet
  value: string
}) {
  return (
    <foreignObject x={cx - w / 2} y={cy - 13} width={w} height={26}>
      <div className="flex h-full w-full items-center justify-center">
        <EnumBadge set={set} value={value} />
      </div>
    </foreignObject>
  )
}

// 액션 라벨 = 액션 메뉴, 액션 표와 같은 뱃지. outline 뱃지는 배경이 투명해 간선이 비치므로
// bg-card로 불투명하게 만든다.
export function ActionLabel({
  x,
  y,
  w,
  icon,
  text,
}: {
  x: number
  y: number
  w: number
  icon: LucideIcon
  text: string
}) {
  return (
    <foreignObject x={x - w / 2} y={y - 11} width={w} height={22}>
      <div className="flex h-full w-full items-center justify-center">
        <ActionBadge icon={icon} text={text} className="bg-card" />
      </div>
    </foreignObject>
  )
}
