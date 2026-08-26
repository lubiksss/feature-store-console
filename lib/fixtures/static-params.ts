// 정적 export가 미리 렌더할 상세 페이지 좌표.
//
// 픽스처에서 파생시킨다 — 목록에 있는 행의 상세가 빠지거나, 없는 행의 상세가 생성되는 것을
// 손으로 관리한 목록으로는 막을 수 없다.
import * as fx from "./dataset"
import { featureViewProfiles, storeProfiles } from "./serve"

const uniq = <T,>(xs: T[]): T[] => Array.from(new Set(xs.map((x) => JSON.stringify(x)))).map((s) => JSON.parse(s) as T)

export const entityParams = () => fx.entities.map((e) => ({ entity_name: e.entity_name }))

export const sourceParams = () => fx.featureViews.map((s) => ({ feature_view_name: s.feature_view_name }))

export const ingestionSpecParams = () => fx.ingestionSpecs.map((s) => ({ feature_view_name: s.feature_view_name }))

export const streamSpecParams = () => fx.streamSpecs.map((s) => ({ feature_view_name: s.feature_view_name }))

export const storeParams = () =>
  fx.stores.map((s) => ({ store_name: s.store_name, store_kind: s.store_kind }))

export const featureViewEventParams = () => fx.featureViewEvents.map((e) => ({ id: String(e.feature_view_event_id) }))

export const storeEventParams = () => fx.storeEvents.map((e) => ({ id: String(e.store_event_id) }))

export const partitionEventParams = () =>
  fx.partitionEvents.map((e) => ({ id: String(e.partition_event_id) }))

export const sourceScheduleParams = () =>
  fx.featureViewSchedules.map((s) => ({ schedule_id: String(s.schedule_id) }))

export const storeScheduleParams = () =>
  fx.storeEventSchedules.map((s) => ({ schedule_id: String(s.schedule_id) }))

export const featureViewProfileParams = () =>
  uniq(
    featureViewProfiles.map((p) => ({
      feature_view_name: p.feature_view_name,
      dt: p.partition.dt,
      field_path: p.field_path,
    })),
  )

export const storeProfileParams = () =>
  uniq(
    storeProfiles.map((p) => ({
      store_event_id: String(p.store_event_id),
      field_name: p.field_name,
    })),
  )
