import { Suspense } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ConsoleSidebar } from "@/components/shared/console-sidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <ConsoleSidebar />
      <SidebarInset className="flex h-full flex-1 flex-col overflow-hidden">
        {/* 정적 export: 목록 필터·페이지네이션이 useSearchParams를 읽는다. 빌드 시점에는
            쿼리가 비어 있으므로 CSR bailout 경계가 필요하고, 레이아웃이 모든 화면의
            공통 조상이라 여기 한 곳에 둔다. */}
        <Suspense>{children}</Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
