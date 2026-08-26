// 서버가 서빙하는 Redoc(/docs)의 오퍼레이션 앵커 규약: #tag/<tag>/operation/<operationId>.
// 호스트는 META_SERVER_URL을 그대로 쓴다 — 환경별 값이 이미 배포 설정에 있어서
// 앱이 환경을 판별할 필요가 없다(PageHeader의 API docs 링크와 같은 경로).
//
// META_SERVER_URL은 서버 전용 env라 client component는 읽을 수 없다. 서버 컴포넌트에서 읽어
// prop으로 내려보낸 뒤 이 헬퍼로 조립한다.
export function apiDocsOperationHref(
  metaServerUrl: string,
  tag: string,
  operationId: string,
): string {
  return `${metaServerUrl}/docs#tag/${tag}/operation/${operationId}`
}
