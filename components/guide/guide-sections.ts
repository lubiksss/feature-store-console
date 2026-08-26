// 섹션 목록 SSOT — 카드 헤더(server)와 우측 ToC 레일(client)이 같은 목록에서 파생돼야
// 앵커가 어긋나지 않는다. 아이콘(함수 컴포넌트)은 client 경계를 넘길 수 없어 여기 두지 않고,
// guide-cards가 id로 매핑한다.
export const GUIDE_SECTIONS = [
  { id: "overview", title: "Feature Store" },
  { id: "feature-view-lifecycle", title: "Feature View Lifecycle" },
  { id: "feature-view-event", title: "Feature View Event" },
  { id: "partition-events", title: "Partition Event" },
  { id: "store-event", title: "Store Event" },
  { id: "event-schedule", title: "Event Schedule" },
] as const

export type GuideSectionId = (typeof GUIDE_SECTIONS)[number]["id"]
