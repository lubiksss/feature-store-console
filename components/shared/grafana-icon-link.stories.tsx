import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { GrafanaIconLink } from "@/components/shared/grafana-icon-link"

const meta: Meta<typeof GrafanaIconLink> = {
  title: "Feature Store/GrafanaIconLink",
  component: GrafanaIconLink,
  parameters: { layout: "centered" },
  args: {
    href: "https://example.grafana/d/feature-store-state?viewPanel=1",
  },
}
export default meta
type Story = StoryObj<typeof GrafanaIconLink>

export const Default: Story = {}
