import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { GuideCards } from "@/components/guide/guide-cards"

const meta: Meta<typeof GuideCards> = {
  title: "Feature Store/GuideCards",
  component: GuideCards,
  parameters: { layout: "padded" },
}
export default meta
type Story = StoryObj<typeof GuideCards>

// ToC 레일의 활성 추적은 스크롤 컨테이너(<main>)를 조상에서 찾으므로 Storybook에서는 첫 항목
// 고정으로 보인다 — 문구와 카드 레이아웃 확인용 story.
export const Default: Story = {}
