import type { FeatureViewSchedule, StoreEventSchedule } from "@/lib/meta-client"

// 스케줄은 평면별로 라우트가 다르다. 두 테이블이 각자 AUTO_INCREMENT 라 대리키가 겹치므로,
// 경로가 평면을 담지 않으면 두 평면의 같은 id 가 서로의 화면을 연다 — 서버의 cron 이 엔트리를
// (plane, id) 로 키잉하는 것과 같은 이유다.
export function sourceScheduleHref(scheduleId: number, suffix = ""): string {
  return `/feature-view-schedules/${scheduleId}${suffix}`
}

export function storeScheduleHref(scheduleId: number, suffix = ""): string {
  return `/online-store-schedules/${scheduleId}${suffix}`
}

export function sourceScheduleLabelOf(s: FeatureViewSchedule): string {
  return `${s.feature_view_name} / ${s.event_kind}`
}

// 좌표가 빈 값이면 "이 런은 대상에 엮이지 않는다"는 뜻이므로 "-" 가 아니라 "(전체)" 로 읽는다 —
// 빈 값은 결손이 아니라 값이다.
export function storeScheduleLabelOf(s: StoreEventSchedule): string {
  const coordinate = s.entity_name === "" ? "(전체)" : s.entity_name
  return `${s.store_name} / ${s.store_kind} / ${coordinate} / ${s.event_kind}`
}
