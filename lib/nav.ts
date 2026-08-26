import {
  ActivityIcon,
  BoxesIcon,
  CalendarClockIcon,
  ChartColumnIcon,
  DatabaseIcon,
  ScrollTextIcon,
  GroupIcon,
  SlidersHorizontalIcon,
  WavesIcon,
  type LucideIcon,
} from "lucide-react"

// 콘솔 화면 목록 SSOT. 사이드바 nav와 가이드의 화면 참조 뱃지가 같은 목록에서 나와야
// 이름과 아이콘이 갈리지 않는다 — 사이드바에서 "View Events"를 고쳤는데 가이드 문장은
// 옛 이름으로 남는 일을 막는다.
//
// Dashboard는 항목이 없다 — 사이드바 헤더("FEATURE STORE")가 홈으로 링크한다.
export interface NavItem {
  title: string
  url: string
  icon: LucideIcon
}

export interface NavSection {
  label?: string
  items: NavItem[]
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Catalog",
    items: [
      // 피처 뷰가 마지막이다 — 피처 뷰는 대상으로 주소화되고 스토어로 서빙되므로, 읽는 순서도
      // 그 둘이 먼저다. 피처 뷰는 그 둘이 있어야 뜻이 생기는 쪽이다.
      { title: "Entities", url: "/entities", icon: GroupIcon },
      { title: "Online Stores", url: "/online-stores", icon: DatabaseIcon },
      { title: "Feature Views", url: "/feature-views", icon: BoxesIcon },
    ],
  },
  {
    // 프로파일은 카탈로그가 아니다 — 누가 선언한 행이 아니라 런이 관측한 통계다. 카탈로그
    // 바로 아래에 두는 것은 읽는 순서가 그쪽이기 때문이다: 무엇이 있는지 먼저 보고, 그것이
    // 실제로 무엇을 담고 있는지 다음에 본다.
    label: "Statistics",
    items: [
      { title: "View Profiles", url: "/feature-view-profiles", icon: ChartColumnIcon },
      { title: "Store Profiles", url: "/online-store-profiles", icon: ChartColumnIcon },
    ],
  },
  {
    label: "Events",
    items: [
      { title: "View Events", url: "/feature-view-events", icon: ActivityIcon },
      { title: "Store Events", url: "/online-store-events", icon: ActivityIcon },
      { title: "Partition Events", url: "/partition-events", icon: ActivityIcon },
    ],
  },
  {
    label: "Specs",
    items: [
      { title: "Stream Sources", url: "/stream-sources", icon: WavesIcon },
      { title: "Ingestion Specs", url: "/ingestion-specs", icon: ScrollTextIcon },
    ],
  },
  {
    label: "Operations",
    items: [
      // 평면별로 나뉜다. 두 스케줄은 주어가 다르고(피처 뷰 / 스토어) 쓸 수 있는 사람도 다르다 —
      // 한 항목 뒤에 숨기면 오퍼는 자기가 무엇을 예약하는지 목록에서 알 수 없다.
      { title: "View Schedules", url: "/feature-view-schedules", icon: CalendarClockIcon },
      { title: "Store Schedules", url: "/online-store-schedules", icon: CalendarClockIcon },
      { title: "Operation Policy", url: "/operation-policy", icon: SlidersHorizontalIcon },
    ],
  },
]

// url로 화면을 찾는다. 없는 url을 주면 만든 쪽의 실수이므로 조용히 넘기지 않고 던진다 —
// 가이드 문장에 죽은 참조가 남는 것보다 빌드가 깨지는 편이 낫다.
export function navItem(url: string): NavItem {
  const found = NAV_SECTIONS.flatMap((s) => s.items).find((i) => i.url === url)
  if (!found) throw new Error(`navItem: unknown url ${url}`)
  return found
}
