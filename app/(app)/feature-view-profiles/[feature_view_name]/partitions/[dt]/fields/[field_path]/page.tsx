import { notFound } from "next/navigation"
import { getFeatureViewProfile } from "@/lib/meta-client"
import { FeatureViewProfileDetail } from "@/components/feature-view-profiles/feature-view-profile-detail"
import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"
import { featureViewProfileParams } from "@/lib/fixtures/static-params"

interface Props {
  params: Promise<{ feature_view_name: string; dt: string; field_path: string }>
}

// L4: a single profiled field's full stats, keyed by (feature_view_name, dt, field_path) + coord query.
export default async function FeatureViewProfileFieldDetailPage({ params }: Props) {
  // Next.js already URL-decodes dynamic segments; getFeatureViewProfile re-encodes for the API
  // call, so use the params directly (a second decodeURIComponent would 500 on a literal '%').
  const { feature_view_name, dt, field_path } = await params

  const data = await getFeatureViewProfile(feature_view_name, dt, field_path).catch(() => null)
  if (!data) notFound()

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Feature View Profiles", href: "/feature-view-profiles" },
          { label: field_path },
        ]}
      />
      <PageMain variant="detail">
        <FeatureViewProfileDetail data={data} />
      </PageMain>
    </>
  )
}

// 정적 export: 미리 렌더할 상세 좌표를 픽스처에서 파생시킨다.
export async function generateStaticParams() {
  return featureViewProfileParams()
}
