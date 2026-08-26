import React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { GrafanaIconLink } from "@/components/shared/grafana-icon-link"

export interface BreadcrumbEntry {
  label: string
  href?: string
}

interface Props {
  breadcrumbs: BreadcrumbEntry[]
  // Grafana 대시보드로 나가는 링크. env를 여기서 읽어 모든 페이지에 띄우지 않고 호출부가 준다 —
  // 이 링크의 목적지는 대시보드 화면이 iframe으로 끌어오는 그 대시보드라, 패널이 있는 화면에서만
  // "이 화면의 원본"으로 읽힌다. 목록, 상세 화면에서는 나갈 이유가 없는 chrome이었다.
  grafanaUrl?: string
}

export function PageHeader({ breadcrumbs, grafanaUrl }: Props) {
  // Every page needs exactly one h1 for the screen-reader heading outline. The visual
  // header is the breadcrumb; the current (last) crumb is the page title, exposed sr-only.
  const pageTitle = breadcrumbs[breadcrumbs.length - 1]?.label
  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-4 border-b px-4">
      {pageTitle && <h1 className="sr-only">{pageTitle}</h1>}
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {i < breadcrumbs.length - 1 ? (
                  <BreadcrumbLink href={crumb.href ?? "#"}>{crumb.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      {/* 문서 링크(Guide, API docs)는 라벨이 붙는 사이드바 푸터로 옮겼다. 여기 남는 것은 화면에
          딸린 링크뿐이다 — 헤더 높이는 h-12로 고정이라 링크가 없어도 본문이 밀리지 않는다. */}
      {grafanaUrl && <GrafanaIconLink href={grafanaUrl} />}
    </header>
  )
}
