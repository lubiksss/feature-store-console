import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { ApiDocsIconLink } from "@/components/shared/api-docs-icon-link"

const meta: Meta<typeof ApiDocsIconLink> = {
  title: "Feature Store/ApiDocsIconLink",
  component: ApiDocsIconLink,
  parameters: { layout: "centered" },
  args: {
    href: "http://localhost:8080/docs",
  },
}
export default meta
type Story = StoryObj<typeof ApiDocsIconLink>

export const Default: Story = {}
