import { ArchiveIcon, BadgeCheckIcon, PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react"
import { ActionLabel, ArrowMarker, GraphNode, arrow } from "@/components/guide/graph-parts"

// 피처 뷰 상태 머신 도식. shadcn/ui에 다이어그램 프리미티브가 없고, mermaid/React Flow는 정적 도식에
// 외부 렌더러를 얹는 셈이며 구워낸 이미지는 다크모드가 깨지고 상태가 늘어도 CI가 못 잡는다.
// 그래서 SVG로 직접 그린다(공용 조각은 graph-parts.tsx).
//
// *_failed 두 상태는 일부러 없다. 이 페이지의 역할 분담은 "도식이 전이를, 상태 표가 상태의 뜻을,
// 액션 표가 액션이 하는 일을" 맡는 것이고 두 실패 상태는 상태 표에 뜻까지 이미 있다. 전이로 치면
// 둘 다 둘레에 붙은 혹이다 — validation_failed 는 draft 에서 나가 Redraft 로 draft 로 돌아오고,
// retirement_failed 는 suspended 에서 나가 Retire 재시도로 retired 에 흘러들거나 Redraft 로
// draft 에 닿는다. 둘 다 결국 draft 로 돌아오지만 어느 쪽도 둘레를 새로 가로지르지 않는다 —
// 아래 불변식이 말하는 "Retire 를 지난다"를 둘 다 지키기 때문이다. 잡이 실패할 수 있다는 사실은
// 액션 표의 이벤트 열이 말한다 — 잡을 띄우는 액션에는 event kind 뱃지가 붙고 동기 전이에는
// "-" 가 붙는다.
//
// 배치: 정원 하나를 네 개의 호로 끊어 만든다. 상태는 원 위 45·135·225·315도 — 사각형의 네
// 꼭지점 — 에 놓이고, 액션은 인접한 두 꼭지점을 잇는 90도 호다. 네 호가 모여 원을 완성하므로
// 운영 순환이 도형 그 자체로 읽힌다. 액션 라벨은 각 호의 중점, 즉 12·3·6·9시에 온다.
//
// 원은 시계방향으로만 흐른다 — draft →(Validate) active →(Pause) suspended →(Retire) retired
// →(Redraft) draft. 이 모양이 말하는 불변식은 "서빙하던 피처 뷰가 편집으로 돌아오려면 Retire 를
// 통과한다"는 것이다: 둘레에 suspended 에서 draft 로 바로 가는 호가 없으므로, shape 을 고치려면
// 반드시 서빙 키스페이스를 비우는 Retire 가 먼저 돈다. 원이 닫히는 것 자체가 그 불변식이고, 읽는
// 사람이 규칙을 외우지 않아도 모양에서 읽힌다.
//
// draft 로 들어오는 호가 이 하나뿐이라는 뜻은 아니다. 서버는 retirement_failed 에서도 Redraft 를
// 열어 둔다 — 스윕이 끝까지 못 갔더라도 Retire 는 이미 돌았고, 그 상태에서 편집을 막으면 피처 뷰가
// 갇힌다. validation_failed 도 draft 로 돌아오지만 그건 서빙한 적이 없는 피처 뷰라 이 규칙의 대상이
// 아니다. 둘 다 도식에 없는 상태이므로 위 문장이 도식에 대해 말하는 바는 그대로다.
//
// Pause/Resume 은 인접한 두 꼭지점 사이의 왕복이라 오른쪽 호 하나에 양방향 화살촉으로 얹는다.
// 되돌릴 수 있는 유일한 전이라는 점이 원의 방향을 끊지 않고 그 호 안에서 표현된다. 라벨 두 개는
// 호의 중점을 기준으로 위아래 대칭으로 쌓고(위가 나가는 쪽 Pause, 아래가 돌아오는 쪽 Resume),
// 두 라벨의 x 는 같게 준다 — 어긋나게 주면 폭이 달라 가운데정렬이 왼쪽정렬로 읽힌다.
//
// 화살촉은 전부 목적지 뱃지 가장자리에서 3 떨어뜨린다. 호의 끝점은 원이 뱃지 경계와 만나는 각에서
// 그만큼 물러난 자리다 — 원 위의 보기 좋은 각으로 일괄해서 끊으면 뱃지 폭이 서로 다른 만큼
// 화살촉이 뱃지에서 떠 보이는 정도도 달라진다.
//
// 이 도식은 1:1로 그린다 — width/height 를 viewBox 와 같게 주고 max-w-full 로만 줄어들게 해서
// viewBox 단위 1 = CSS 1px 이 되게 한다. 확대해서 그리면 foreignObject 안의 뱃지도 같이 커져
// 같은 페이지의 표에 뜬 같은 뱃지와 크기가 어긋난다. 그래서 이 도식의 자연 크기는 뱃지 실측 폭이
// 정하며, 넓은 카드에서는 가운데 정렬로 남는 여백이 생긴다.
//
// 좌표 규약: 원 중심 (180,147) 반지름 130 → 상태는 draft (88,55) / active (272,55) /
// suspended (272,239) / retired (88,239), 라벨은 Validate (180,17) / Pause·Resume (310,147) /
// Retire (180,277) / Redraft (50,147). 호의 끝점은 foreignObject 박스가 아니라 뱃지 실제
// 가장자리 기준이고, 그 폭은 실측값이다(1440px 뷰포트에서 렌더한 표의 같은 뱃지를
// getBoundingClientRect 로 잰 값): draft 62.2 / active 68.8 / suspended 97.7 / retired 72.4 /
// Validate 80.5 / Pause 68.9 / Resume 80.1 / Retire 68.1 / Redraft 76.9. 뱃지 높이는 전부 20이라
// 위아래 경계는 cy±10. foreignObject 폭(w)은 뱃지가 잘리지 않게 그보다 넉넉히 준다.

const ID = "lifecycle-arrow"
const ARROW = arrow(ID)

export function LifecycleGraph() {
  return (
    <div className="flex justify-center rounded-lg border p-4">
      {/* role은 group이다(img가 아니다) — 노드가 foreignObject 안의 실제 뱃지 링크라, img로 두면
          스크린리더가 도식 전체를 한 장의 그림으로 보고 그 링크들을 감춘다. */}
      <svg
        width={360}
        height={294}
        viewBox="0 0 360 294"
        role="group"
        aria-label="피처 뷰 상태 머신: 정원 위 네 상태를 잇는 네 개의 호. draft에서 Validate로 active. active와 suspended 사이는 Pause, Resume. suspended에서 Retire로 retired. retired에서 Redraft로 draft 복귀"
        className="h-auto max-w-full"
      >
        <ArrowMarker id={ID} />

        <g className="stroke-muted-foreground" strokeWidth={1} fill="none">
          {/* Validate: 12시를 지나는 호, draft → active */}
          <path d="M102,43 A130,130 0 0,1 258,43" markerEnd={ARROW} />

          {/* Pause ⇄ Resume: 3시를 지나는 호 하나, 양쪽에 화살촉 */}
          <path d="M283,68 A130,130 0 0,1 283,227" markerStart={ARROW} markerEnd={ARROW} />

          {/* Retire: 6시를 지나는 호, suspended → retired */}
          <path d="M258,251 A130,130 0 0,1 102,251" markerEnd={ARROW} />

          {/* Redraft: 9시를 지나는 호, retired → draft. 서빙했던 피처 뷰가 편집으로 돌아오는 호다 */}
          <path d="M77,227 A130,130 0 0,1 77,68" markerEnd={ARROW} />
        </g>

        <ActionLabel x={180} y={17} w={88} icon={BadgeCheckIcon} text="Validate" />
        <ActionLabel x={310} y={134} w={76} icon={PauseIcon} text="Pause" />
        <ActionLabel x={310} y={160} w={88} icon={PlayIcon} text="Resume" />
        <ActionLabel x={180} y={277} w={76} icon={ArchiveIcon} text="Retire" />
        <ActionLabel x={50} y={147} w={88} icon={RotateCcwIcon} text="Redraft" />

        {/* 225도 */}
        <GraphNode set="featureViewLifecycle" cx={88} cy={55} w={92} value="draft" />
        {/* 315도 */}
        <GraphNode set="featureViewLifecycle" cx={272} cy={55} w={96} value="active" />
        {/* 45도 */}
        <GraphNode set="featureViewLifecycle" cx={272} cy={239} w={128} value="suspended" />
        {/* 135도 */}
        <GraphNode set="featureViewLifecycle" cx={88} cy={239} w={104} value="retired" />
      </svg>
    </div>
  )
}
