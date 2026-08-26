import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { GrafanaPanel } from "@/components/shared/grafana-panel"

const meta: Meta<typeof GrafanaPanel> = {
  title: "Feature Store/GrafanaPanel",
  component: GrafanaPanel,
  parameters: { layout: "padded" },
  args: {
    title: "Dashboard metric",
    src: "about:blank",
  },
}
export default meta
type Story = StoryObj<typeof GrafanaPanel>

export const Default: Story = {}
