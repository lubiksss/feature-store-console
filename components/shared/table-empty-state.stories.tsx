import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TableEmptyState } from "@/components/shared/table-empty-state"

const meta: Meta<typeof TableEmptyState> = {
  title: "Feature Store/TableEmptyState",
  component: TableEmptyState,
  parameters: { layout: "padded" },
}
export default meta
type Story = StoryObj<typeof TableEmptyState>

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border overflow-hidden">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2">FeatureView Name</TableHead>
                <TableHead className="w-1/4">Type</TableHead>
                <TableHead className="w-1/4">Owner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{children}</TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

// 실패 두 종류를 나란히 둔다: 서버가 문구를 보낸 실패와 아무 말도 하지 못한 실패. 둘이 같은
// 문장으로 보이던 것이 이 컴포넌트가 고친 결함이라, 카탈로그에서도 갈라 놓는다.
export const FailedWithServerMessage: Story = {
  name: "Failed (server said why)",
  render: () => (
    <Frame title="Failed with server message">
      <TableEmptyState
        colSpan={3}
        failure={{
          message:
            '0: value is not one of the allowed values ["draft","active","suspended","retired","validation_failed","retirement_failed"]',
          code: "validation",
          requestId: "00000000000000000000000000000000",
        }}
      />
    </Frame>
  ),
}

export const Unreachable: Story = {
  name: "Cannot connect (server said nothing)",
  render: () => (
    <Frame title="Unreachable">
      <TableEmptyState colSpan={3} failure={{}} />
    </Frame>
  ),
}

export const EmptyFiltered: Story = {
  name: "Empty (filtered)",
  render: () => (
    <Frame title="No filtered results">
      <TableEmptyState colSpan={3} filtered />
    </Frame>
  ),
}

export const Empty: Story = {
  name: "Empty (no items)",
  render: () => (
    <Frame title="No items">
      <TableEmptyState colSpan={3} />
    </Frame>
  ),
}
