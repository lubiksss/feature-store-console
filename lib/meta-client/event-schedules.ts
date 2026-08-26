import { client, unwrap, type Query } from "./transport"
import type { components } from "./schema"

// ─── Event Schedules (admin) ───────────────────────────────────────────────────
// 스케줄은 평면별로 테이블이 갈렸다. 한 테이블에 두 평면의 주어를 union 으로 담았을 때는
// "어느 평면도 아닌 행"이 표현 가능했고, 그 거절이 스펙이 아니라 코드에 있었다.
//
// 여기서도 두 모듈이다. 화면은 둘을 한 자리에 모아 보여주지만(목록은 뷰이지 상태공간이
// 아니다), 쓰기는 어느 평면인지 정해진 뒤에만 가능하다.
//
// 불변식: schedule_enabled=true 는 cron_expression 을 요구한다.
// 예약은 운영 노브이지 형상이 아니다 — 서버가 lifecycle 을 묻지 않는다. 다만 cron 이 띄우는
// 일은 피처 뷰의 일과 같은 관문을 지나므로, 멈춘 피처 뷰의 예약은 발화하되 거절된다.
export type ScheduleId = components["schemas"]["ScheduleId"]
export type EventParams = components["schemas"]["EventParams"]

// 스케줄의 평면. 상세·편집 경로가 이 값을 실어야 한다 — 두 테이블이 각자 AUTO_INCREMENT 라
// id 만으로는 어느 행인지 정해지지 않는다(서버의 cron 이 (plane, id) 로 키잉하는 것과 같은 이유).
export type SchedulePlane = "featureView" | "store"

// ── featureView plane ──────────────────────────────────────────────────────────────
export type SchedulableFeatureViewEventKind = components["schemas"]["SchedulableFeatureViewEventKindEnum"]
export type FeatureViewSchedule = components["schemas"]["FeatureViewSchedule"]
export type FeatureViewScheduleList = components["schemas"]["FeatureViewScheduleList"]
export type FeatureViewScheduleCreate = components["schemas"]["FeatureViewScheduleCreate"]
export type FeatureViewSchedulePatch = components["schemas"]["FeatureViewSchedulePatch"]

export async function listFeatureViewSchedules(query?: Query<"listFeatureViewSchedules">) {
  return unwrap(await client.GET("/v1/admin/feature-view-schedules", { params: { query } }))
}

export async function getFeatureViewSchedule(scheduleId: ScheduleId) {
  return unwrap(
    await client.GET("/v1/admin/feature-view-schedules/{schedule_id}", {
      params: { path: { schedule_id: scheduleId } },
    }),
  )
}

export async function createFeatureViewSchedule(body: FeatureViewScheduleCreate) {
  return unwrap(await client.POST("/v1/admin/feature-view-schedules", { body }))
}

export async function patchFeatureViewSchedule(
  scheduleId: ScheduleId,
  body: FeatureViewSchedulePatch,
) {
  return unwrap(
    await client.PATCH("/v1/admin/feature-view-schedules/{schedule_id}", {
      params: { path: { schedule_id: scheduleId } },
      body,
    }),
  )
}

export async function deleteFeatureViewSchedule(scheduleId: ScheduleId): Promise<void> {
  unwrap(
    await client.DELETE("/v1/admin/feature-view-schedules/{schedule_id}", {
      params: { path: { schedule_id: scheduleId } },
    }),
  )
}

// ── store plane ───────────────────────────────────────────────────────────────
export type SchedulableStoreEventKind = components["schemas"]["SchedulableStoreEventKindEnum"]
export type StoreEventSchedule = components["schemas"]["StoreEventSchedule"]
export type StoreEventScheduleList = components["schemas"]["StoreEventScheduleList"]
export type StoreEventScheduleCreate = components["schemas"]["StoreEventScheduleCreate"]
export type StoreEventSchedulePatch = components["schemas"]["StoreEventSchedulePatch"]

export async function listStoreEventSchedules(query?: Query<"listStoreEventSchedules">) {
  return unwrap(await client.GET("/v1/admin/online-store-schedules", { params: { query } }))
}

export async function getStoreEventSchedule(scheduleId: ScheduleId) {
  return unwrap(
    await client.GET("/v1/admin/online-store-schedules/{schedule_id}", {
      params: { path: { schedule_id: scheduleId } },
    }),
  )
}

export async function createStoreEventSchedule(body: StoreEventScheduleCreate) {
  return unwrap(await client.POST("/v1/admin/online-store-schedules", { body }))
}

export async function patchStoreEventSchedule(
  scheduleId: ScheduleId,
  body: StoreEventSchedulePatch,
) {
  return unwrap(
    await client.PATCH("/v1/admin/online-store-schedules/{schedule_id}", {
      params: { path: { schedule_id: scheduleId } },
      body,
    }),
  )
}

export async function deleteStoreEventSchedule(scheduleId: ScheduleId): Promise<void> {
  unwrap(
    await client.DELETE("/v1/admin/online-store-schedules/{schedule_id}", {
      params: { path: { schedule_id: scheduleId } },
    }),
  )
}
