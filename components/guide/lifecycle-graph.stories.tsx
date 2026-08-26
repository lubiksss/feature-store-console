import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { LifecycleGraph } from "@/components/guide/lifecycle-graph"

// 도식은 좌표를 손으로 잡은 SVG라, 뱃지 폭이나 토큰이 바뀌면 여기서 먼저 깨진 게 보인다.
const meta: Meta<typeof LifecycleGraph> = {
  title: "Feature Store/LifecycleGraph",
  component: LifecycleGraph,
  parameters: { layout: "padded" },
}
export default meta

export const Default: StoryObj<typeof LifecycleGraph> = {}
