import { getOperationPolicy } from "@/lib/meta-client"
import { canEdit } from "@/lib/auth"
import { OperationPolicyDetail } from "@/components/operation-policy/operation-policy-detail"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"

// Global singleton — the page IS the detail (no list; there is only one policy row).
export default async function OperationPolicyPage() {
  const policy = await getOperationPolicy().catch(() => null)
  const editable = await canEdit()

  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Operation Policy" }]} />
      <PageMain variant="detail">
        <OperationPolicyDetail data={policy} canEdit={editable} />
      </PageMain>
    </>
  )
}
