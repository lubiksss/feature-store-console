const GRAFANA_DASHBOARD_PATH = /\/d(?:-solo)?\//

export interface GrafanaPanelDefinition {
  panelId: number
  from: string
  to?: string
  refresh?: string
}

// 창은 알람이 판단하는 범위를 덮어야 한다. 좁으면 이미 울린 알람을 콘솔에서 확인할 수 없다.
// 등록 추이만 3개월이다: 그건 알람이 없고, 며칠 창으로는 추세가 보이지 않는다.
export const GRAFANA_PANELS = {
  activeSources: {
    panelId: 1,
    from: "now-3M",
  },
  runningEvents: {
    panelId: 2,
    from: "now-7d",
  },
  runningExecutions: {
    panelId: 3,
    from: "now-7d",
  },
  consistencyScore: {
    panelId: 5,
    from: "now-7d",
  },
  updateIntervalDaily: {
    panelId: 6,
    from: "now-7d",
  },
  updateIntervalHourly: {
    panelId: 7,
    from: "now-7d",
  },
  updateIntervalOther: {
    panelId: 8,
    from: "now-7d",
  },
  partitionEvents: {
    panelId: 17,
    from: "now-7d",
  },
} as const

export function buildGrafanaPanelUrl(
  dashboardUrl: string | undefined,
  panel: GrafanaPanelDefinition,
): string | undefined {
  if (!dashboardUrl) return undefined

  try {
    const url = new URL(dashboardUrl)
    if (!GRAFANA_DASHBOARD_PATH.test(url.pathname)) return undefined

    url.pathname = url.pathname.replace(GRAFANA_DASHBOARD_PATH, "/d-solo/")
    url.searchParams.set("from", panel.from)
    url.searchParams.set("to", panel.to ?? "now")
    url.searchParams.set("refresh", panel.refresh ?? "1m")
    url.searchParams.set("panelId", String(panel.panelId))
    url.searchParams.set("theme", "light")

    return url.toString()
  } catch {
    return undefined
  }
}
