import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { PartitionFlowGraph } from "@/components/guide/partition-flow-graph"

// 상태 머신 도식과 같은 이유로 story를 둔다 — 좌표와 뱃지 폭이 맞물려 있어 시각 확인이 필요하다.
const meta: Meta<typeof PartitionFlowGraph> = {
  title: "Feature Store/PartitionFlowGraph",
  component: PartitionFlowGraph,
  parameters: { layout: "padded" },
}
export default meta

export const Default: StoryObj<typeof PartitionFlowGraph> = {}
