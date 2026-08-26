// 카탈로그 리소스 자신으로 가는 주소. "use client" 가 아닌 평범한 모듈인 이유는 상세 뷰가
// 서버 컴포넌트라서다 — 클라이언트 모듈의 export 를 서버에서 호출하면 그것은 함수가 아니라
// 클라이언트 참조다.
//
// 뱃지의 기본 목적지는 이것이 아니다. 뱃지는 자기가 속한 목록을 그 값으로 좁히고, 좁힐 수
// 없는 자리(그 목록이 그 파라미터를 파싱하지 않는 경우)에서만 이 주소를 쓴다.
export function sourceHref(featureViewName: string): string {
  return `/feature-views/${encodeURIComponent(featureViewName)}`
}

export function entityHref(entityName: string): string {
  return `/entities/${encodeURIComponent(entityName)}`
}

// 온라인 스토어의 주소는 (이름, 종류) 짝이어야 한다.
export function storeHref(storeName: string, storeKind: string): string {
  return `/stores/${encodeURIComponent(storeName)}/${encodeURIComponent(storeKind)}`
}
