import type { FeatureViewSchedule } from "@/lib/meta-client"
import type { FeatureViewScheduleRowData } from "@/components/feature-view-schedules/feature-view-schedule-row"
import type { FeatureViewScheduleDetailData } from "@/components/feature-view-schedules/feature-view-schedule-detail"

// 주어가 NOT NULL 이므로 접을 자리가 없다 — 평면이 갈리면서 "반쪽만 채워진 행"이 표현
// 불가능해졌고, 매퍼에서 undefined 를 다루던 분기가 함께 사라졌다.
export function toFeatureViewScheduleRow(s: FeatureViewSchedule): FeatureViewScheduleRowData {
  return {
    featureViewName: s.feature_view_name,
    eventKind: s.event_kind,
    scheduleId: s.schedule_id,
    cronExpression: s.cron_expression,
    scheduleEnabled: s.schedule_enabled,
    updatedAt: s.updated_at,
  }
}

export function toFeatureViewScheduleDetail(s: FeatureViewSchedule): FeatureViewScheduleDetailData {
  return {
    featureViewName: s.feature_view_name,
    eventKind: s.event_kind,
    cronExpression: s.cron_expression,
    params: s.params,
    scheduleEnabled: s.schedule_enabled,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
  }
}
