import { PageHeader } from "@/components/shared/page-header"
import { PageMain } from "@/components/shared/page-main"
import { GuideCards } from "@/components/guide/guide-cards"

// 정적 안내 문서지만 이 페이지도 (app) 레이아웃의 per-request 인증 아래에 둔다 — 콘솔 화면
// 이름과 링크를 담고 있으므로 로그인 사용자에게만 보이는 편이 자연스럽다.
export default function GuidePage() {
  return (
    <>
      <PageHeader breadcrumbs={[{ label: "Guide" }]} />
      <PageMain variant="detail">
        <GuideCards metaServerUrl={process.env.META_SERVER_URL} />
      </PageMain>
    </>
  )
}
