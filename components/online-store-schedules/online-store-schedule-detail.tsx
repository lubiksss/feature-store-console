import { FieldTable, SectionCard } from "@/components/shared/detail-section"
import { StoreNameLink } from "@/components/shared/online-store-name-link"
import { EntityNameLink } from "@/components/shared/entity-name"
import { CalendarClockIcon } from "lucide-react"
import { EnumBadges } from "@/components/shared/enum-badges"
import { StoreEventScheduleActionsMenu } from "@/components/online-store-schedules/online-store-schedule-actions-menu"
import { display } from "@/lib/display"
import type { SchedulableStoreEventKind } from "@/lib/meta-client"

export interface StoreEventScheduleDetailData {
  // 주어는 온라인 스토어이고 entity_name 은 좌표다. 순서가 그 관계를 말한다.
  storeName: string
  storeKind: string
  entityName: string
  eventKind: SchedulableStoreEventKind
  cronExpression?: string
  scheduleEnabled: boolean
  createdAt: string
  updatedAt: string
}

interface Props {
  scheduleId: number
  data?: StoreEventScheduleDetailData
  canEdit?: boolean
}

export function StoreEventScheduleDetail({ scheduleId, data, canEdit = false }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {data ? (
        <SectionCard
          title="Store Event Schedule"
          icon={CalendarClockIcon}
          adminOnly
          action={
            <StoreEventScheduleActionsMenu
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
                label: "store_name",
                value: (
                  <StoreNameLink
                    storeName={data.storeName}
                    href={`/online-store-schedules?store_name=${encodeURIComponent(data.storeName)}`}
                  />
                ),
              },
              {
                label: "store_kind",
                value: (
                  <EnumBadges
                    set="storeKind"
                    value={data.storeKind}
                    selectedHref={`/online-store-schedules?store_kind=${data.storeKind}`}
                  />
                ),
              },
              {
                // 대상에 엮이지 않는 런은 좌표가 빈 문자열이고, 그 표기는 없음의 표기와 같은
                // "-" 다. 이 화면만의 설명을 값 자리에 넣지 않는다.
                label: "entity_name",
                value:
                  data.entityName === "" ? (
                    display(undefined)
                  ) : (
                    <EntityNameLink
                      entityName={data.entityName}
                      href={`/online-store-schedules?entity_name=${encodeURIComponent(data.entityName)}`}
                    />
                  ),
              },
              {
                label: "event_kind",
                value: <EnumBadges set="schedulableStoreEventKind" value={data.eventKind} />,
              },
              { label: "cron_expression", value: display(data.cronExpression) },
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
        <SectionCard title="Store Event Schedule" icon={CalendarClockIcon}>
          <p className="text-sm text-muted-foreground">No schedule with id {scheduleId}.</p>
        </SectionCard>
      )}
    </div>
  )
}
