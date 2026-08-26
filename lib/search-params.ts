export type MultiParam = string | string[] | undefined

// URL 파라미터는 임의 문자열이다. 목록 필터가 계약의 닫힌 enum 을 받는 자리에서는 그 타입으로
// 좁혀 넘기는데(호출부의 기대 타입에서 추론된다), 어휘에 없는 값을 걸러내지는 않는다 — 그대로
// 서버로 보내 400 을 받는 것이 콘솔이 자기 판단으로 필터를 지우는 것보다 정직하다(thin client).
export function toArrayParam<T extends string = string>(v: MultiParam): T[] | undefined {
  if (v == null) return undefined
  return (Array.isArray(v) ? v : [v]) as T[]
}

export function hasActiveFilters(sp: Record<string, MultiParam>): boolean {
  return Object.keys(sp).some((k) => k !== "offset")
}

// The write side of /feature-view-events' filter contract (the read side is that page's searchParams).
// Lives here so the links that jump into the list and the page that parses them can't drift.
// event_kind is optional: omitting it gives the featureView's whole event history.
//
// 뱃지는 이 함수를 쓰지 않는다: 모든 enum 뱃지는 "그 값으로 필터한 목록"으로 간다는 규약이 있고
// (enum-badges의 LIST_FILTER_HREFS), lifecycle 뱃지에 이 링크를 얹어두면 같은 뱃지가 화면마다 다른
// 곳으로 가버린다. 지금 호출부는 액션 메뉴의 "결과 보기"(요청한 잡의 이벤트로 점프)뿐이다.
export function featureViewEventsHref(featureViewName: string, eventKind?: string) {
  const params = new URLSearchParams({ feature_view_name: featureViewName })
  if (eventKind) params.set("event_kind", eventKind)
  return `/feature-view-events?${params}`
}
