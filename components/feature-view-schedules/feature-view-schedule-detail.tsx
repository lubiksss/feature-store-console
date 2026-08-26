import { FieldTable, SectionCard } from "@/components/shared/detail-section"
import { CalendarClockIcon } from "lucide-react"
import { FeatureViewNameLink } from "@/components/shared/feature-view-name-link"
import { EnumBadges } from "@/components/shared/enum-badges"
import { FeatureViewScheduleActionsMenu } from "@/components/feature-view-schedules/feature-view-schedule-actions-menu"
import { display } from "@/lib/display"
import type { SchedulableFeatureViewEventKind } from "@/lib/meta-client"

export interface FeatureViewScheduleDetailData {
  featureViewName: string
  eventKind: SchedulableFeatureViewEventKind
  cronExpression?: string
  // kind 마다 필요한 키가 다르고 서버가 그 모양의 주인이다 — 편집 폼과 같이 원문 그대로 둔다.
  params?: unknown
  scheduleEnabled: boolean
  createdAt: string
  updatedAt: string
}

interface Props {
  scheduleId: number
  data?: FeatureViewScheduleDetailData
  canEdit?: boolean
}

export function FeatureViewScheduleDetail({ scheduleId, data, canEdit = false }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {data ? (
        <SectionCard
          title="Feature View Event Schedule"
          icon={CalendarClockIcon}
          action={
            <FeatureViewScheduleActionsMenu
              scheduleId={scheduleId}
              eventKind={data.eventKind}
              scheduleEnabled={data.scheduleEnabled}
              canEdit={canEdit}
            />
          }
        >
          <FieldTable
            rows={[
              {
                label: "feature_view_name",
                value: (
                  <FeatureViewNameLink
                    featureViewName={data.featureViewName}
                    href={`/feature-view-schedules?feature_view_name=${encodeURIComponent(data.featureViewName)}`}
                  />
                ),
              },
              {
                label: "event_kind",
                value: <EnumBadges set="schedulableFeatureViewEventKind" value={data.eventKind} />,
              },
              { label: "cron_expression", value: display(data.cronExpression) },
              {
                label: "params",
                value: data.params ? (
                  <pre className="whitespace-pre-wrap font-mono text-xs">
                    {JSON.stringify(data.params, null, 2)}
                  </pre>
                ) : (
                  display(undefined)
                ),
                multiline: true,
              },
              {
                label: "schedule_enabled",
                value: <EnumBadges set="bool" value={String(data.scheduleEnabled)} />,
              },
              {
                label: "updated_at",
                value: data.updatedAt,
                label2: "created_at",
                value2: data.createdAt,
              },
            ]}
          />
        </SectionCard>
      ) : (
        <SectionCard title="Feature View Event Schedule" icon={CalendarClockIcon}>
          <p className="text-sm text-muted-foreground">No schedule with id {scheduleId}.</p>
        </SectionCard>
      )}
    </div>
  )
}
