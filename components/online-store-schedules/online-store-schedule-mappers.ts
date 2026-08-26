import type { StoreEventSchedule } from "@/lib/meta-client"
import type { StoreEventScheduleRowData } from "@/components/online-store-schedules/online-store-schedule-row"
import type { StoreEventScheduleDetailData } from "@/components/online-store-schedules/online-store-schedule-detail"

// entity_name 은 빈 문자열일 수 있고 그것이 값이다 — undefined 로 접으면 "대상에 엮이지 않는
// 런"과 "값을 못 읽었다"가 같은 모양이 된다.
export function toStoreEventScheduleRow(s: StoreEventSchedule): StoreEventScheduleRowData {
  return {
    storeName: s.store_name,
    storeKind: s.store_kind,
    entityName: s.entity_name,
    eventKind: s.event_kind,
    scheduleId: s.schedule_id,
    cronExpression: s.cron_expression,
    scheduleEnabled: s.schedule_enabled,
    updatedAt: s.updated_at,
  }
}

export function toStoreEventScheduleDetail(s: StoreEventSchedule): StoreEventScheduleDetailData {
  return {
    storeName: s.store_name,
    storeKind: s.store_kind,
    entityName: s.entity_name,
    eventKind: s.event_kind,
    cronExpression: s.cron_expression,
    scheduleEnabled: s.schedule_enabled,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
  }
}
