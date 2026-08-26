"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  ActivityIcon,
  BookOpenIcon,
  BookTextIcon,
} from "lucide-react"
import { NAV_SECTIONS } from "@/lib/nav"

interface Props {
  // 서버 Redoc 주소. META_SERVER_URL은 서버 전용 env라 이 client 컴포넌트가 직접 읽을 수
  // 없어 레이아웃에서 내려받는다. 값이 없으면 항목을 걸지 않는다 — 링크가 없는 링크는 없는 게 낫다.
  apiDocsUrl?: string
}

export function ConsoleSidebar({ apiDocsUrl }: Props) {
  const currentPath = usePathname()
  const isActive = (url: string) => currentPath === url || currentPath.startsWith(`${url}/`)

  return (
    <Sidebar collapsible="none" className="border-r">
      <SidebarHeader>
        <div className="flex items-center justify-between gap-1.5 px-2 py-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <ActivityIcon className="size-4" />
            <span className="font-semibold text-sm tracking-wide">FEATURE STORE</span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {NAV_SECTIONS.map((section, i) => (
          <SidebarGroup key={section.label ?? `group-${i}`}>
            {section.label && <SidebarGroupLabel>{section.label}</SidebarGroupLabel>}
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={isActive(item.url)}
                    render={<Link href={item.url} />}
                    className="font-medium"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        {/* 문서 그룹. Guide(콘솔 사용법)와 API docs(서버 계약)는 리소스가 아니라 참고
            자료라 SidebarContent에 두면 Sources, Events와 같은 층으로 읽힌다. 푸터(콘솔 자체에
            대한 것들의 자리)로 내리고 separator로 nav와 끊는다.
            아이콘은 아이콘 링크로 쓰일 때와 같은 것을 유지한다 — 본문 안의 API docs 참조와 이 항목이
            같은 문서를 가리킨다는 것을 눈으로 잇는다. 외부로 나가는 표시는 새 탭뿐이다(레포 관례). */}
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive("/guide")}
              render={<Link href="/guide" />}
              className="font-medium"
            >
              <BookOpenIcon />
              <span>Guide</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {apiDocsUrl && (
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<a href={apiDocsUrl} target="_blank" rel="noopener noreferrer" />}
                className="font-medium"
              >
                <BookTextIcon />
                <span>API docs</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
