import { ArrowMarker, EdgeLabel, GraphNode, arrow } from "@/components/guide/graph-parts"

// 파티션 이벤트 진행 도식. 상태 머신 도식과 같은 방식(실제 뱃지 + SVG 간선)으로 그린다.
//
// 두 단계가 한 행에서 이어진다: 적재(materialization) 세 상태 → 정합성(consistency) 세 상태.
// 각 단계는 submitted에서 시작해 완료 또는 실패로 갈라지고, 적재가 완료되면 정합성 검사가 이어진다.
//
//   [materialization_submitted] ──완료──▶ [materialization_succeeded]
//              │실패                              │이어서
//   [materialization_failed]                       ▼
//   [consistency_submitted] ──완료──▶ [consistency_succeeded]
//              │실패
//   [consistency_failed]
//
// 좌표 규약: 왼쪽 열 x=180 / 오른쪽 열 x=520, 적재 행 y=30(실패 y=100) / 정합성 행 y=180(실패 y=250).
// 뱃지 폭 추정치(text-xs + 아이콘 + px-2): materialization_* 187 / materialization_failed 168 /
// consistency_* 162 / consistency_failed 144. 간선 끝점은 이 폭 기준이다.

const ID = "partition-flow-arrow"
const ARROW = arrow(ID)

export function PartitionFlowGraph() {
  return (
    <div className="flex justify-center rounded-lg border p-4">
      {/* role은 group이다(img가 아니다) — 노드가 foreignObject 안의 실제 뱃지 링크라, img로 두면
          스크린리더가 도식 전체를 한 장의 그림으로 보고 그 링크들을 감춘다. */}
      <svg
        viewBox="0 0 640 280"
        role="group"
        aria-label="파티션 이벤트 진행: materialization_submitted에서 완료되면 materialization_succeeded, 실패하면 materialization_failed. 적재가 완료되면 consistency_submitted로 이어지고, 완료되면 consistency_succeeded, 실패하면 consistency_failed"
        className="h-auto w-full max-w-2xl"
      >
        <ArrowMarker id={ID} />

        <g className="stroke-muted-foreground" strokeWidth={1} fill="none">
          {/* 적재: submitted → succeeded / failed */}
          <line x1={277} y1={30} x2={423} y2={30} markerEnd={ARROW} />
          <line x1={180} y1={41} x2={180} y2={88} markerEnd={ARROW} />
          {/* 적재 완료 → 정합성 검사 시작 */}
          <line x1={480} y1={41} x2={200} y2={168} markerEnd={ARROW} />
          {/* 정합성: submitted → succeeded / failed */}
          <line x1={264} y1={180} x2={436} y2={180} markerEnd={ARROW} />
          <line x1={180} y1={191} x2={180} y2={238} markerEnd={ARROW} />
        </g>

        <EdgeLabel x={350} y={30} w={36} text="완료" />
        <EdgeLabel x={196} y={64} w={36} text="실패" />
        <EdgeLabel x={340} y={104} w={44} text="이어서" />
        <EdgeLabel x={350} y={180} w={36} text="완료" />
        <EdgeLabel x={196} y={214} w={36} text="실패" />

        <GraphNode
          cx={180}
          cy={30}
          w={200}
          set="partitionStatus"
          value="materialization_submitted"
        />
        <GraphNode
          cx={520}
          cy={30}
          w={200}
          set="partitionStatus"
          value="materialization_succeeded"
        />
        <GraphNode cx={175} cy={100} w={180} set="partitionStatus" value="materialization_failed" />
        <GraphNode cx={180} cy={180} w={175} set="partitionStatus" value="consistency_submitted" />
        <GraphNode cx={520} cy={180} w={175} set="partitionStatus" value="consistency_succeeded" />
        <GraphNode cx={170} cy={250} w={160} set="partitionStatus" value="consistency_failed" />
      </svg>
    </div>
  )
}
