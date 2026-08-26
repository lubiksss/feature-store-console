"use client"

import * as React from "react"
import { GUIDE_SECTIONS, type GuideSectionId } from "@/components/guide/guide-sections"
import { cn } from "@/lib/utils"

// 문서 우측 sticky 레일("On this page"). shadcn/ui에 ToC 프리미티브는 없다 — 공식 docs 사이트도
// registry 컴포넌트가 아니라 자체 구현이라, 여기서도 sticky aside로 최소 구성만 만든다.
//
// 겉모습은 사이드바 nav를 그대로 따른다: 배경, 글자, 테두리는 sidebar 토큰이고, 항목은
// SidebarMenuButton과 같은 기하(h-8 / rounded-md / px-2 / text-sm)와 같은 활성 표현
// (data-active와 동일한 bg-sidebar-accent 블록)을 쓴다. 왼쪽 바로 활성을 표시하면 콘솔 어디에도
// 없는 방식이라 같은 화면에 두 가지 nav 어휘가 생긴다.
//
// 활성 판정 = 스크롤포트 상단선(READ_LINE)을 마지막으로 통과한 섹션. IntersectionObserver로
// "상단 밴드에 걸친 첫 섹션"을 고르면 ToC 클릭과 어긋난다: 짧은 섹션은 다음 섹션과 함께 밴드에
// 걸려 앞선 쪽이 이기고, 마지막 섹션은 위로 끌어올릴 스크롤이 없어 밴드에 닿지 못한다.
// 위치를 직접 재면 두 경우 모두 클릭 결과와 일치한다.
const READ_LINE = 32

// 스크롤이 바닥에 닿으면 남은 섹션들은 상단선까지 올라올 수 없다. 그때는 마지막 섹션이 활성.
const LAST_SECTION = GUIDE_SECTIONS[GUIDE_SECTIONS.length - 1].id

export function GuideToc() {
  const [active, setActive] = React.useState<GuideSectionId>(GUIDE_SECTIONS[0].id)
  // 클릭한 항목은 사용자가 다음 스크롤 입력을 줄 때까지 그대로 둔다 — 문서 끝부분처럼 클릭해도
  // 위치가 더 움직이지 않는 구간에서 계산값이 클릭을 덮어쓰는 것을 막는다.
  const pinned = React.useRef<GuideSectionId | null>(null)
  const asideRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    // PageMain(<main>)이 스크롤 컨테이너다. 페이지가 위치를 내려주는 대신 레일이 자기 조상에서
    // 찾는다 — 이 컴포넌트를 어디에 꽂아도 동작이 같다.
    const scroller = asideRef.current?.closest("main")
    if (!scroller) return

    let frame = 0
    const measure = () => {
      frame = 0
      if (pinned.current) return
      // 내용이 넘치지 않으면 scrollTop=0에서도 "바닥"이 참이라, 그대로 두면 로드 직후 마지막
      // 섹션이 활성으로 뜬다. 넘칠 때만 바닥 규칙을 적용한다.
      const overflows = scroller.scrollHeight > scroller.clientHeight + 2
      const atBottom =
        overflows && scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2
      if (atBottom) {
        setActive(LAST_SECTION)
        return
      }
      const line = scroller.getBoundingClientRect().top + READ_LINE
      let current: GuideSectionId = GUIDE_SECTIONS[0].id
      for (const s of GUIDE_SECTIONS) {
        const el = document.getElementById(s.id)
        if (el && el.getBoundingClientRect().top <= line) current = s.id
      }
      setActive(current)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    // 사용자가 직접 스크롤을 조작하면 클릭 고정을 푼다. scroll 이벤트로 풀면 클릭이 유발한
    // 스크롤이 자기 고정을 즉시 해제해버리므로, 입력 이벤트로만 판단한다.
    // pointerdown이 있어야 스크롤바를 끌어 스크롤한 경우에도 풀린다(wheel/touch가 안 온다).
    const release = () => {
      pinned.current = null
      onScroll()
    }

    measure()
    scroller.addEventListener("scroll", onScroll, { passive: true })
    scroller.addEventListener("wheel", release, { passive: true })
    scroller.addEventListener("pointerdown", release, { passive: true })
    scroller.addEventListener("touchstart", release, { passive: true })
    window.addEventListener("keydown", release)
    window.addEventListener("resize", onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      scroller.removeEventListener("scroll", onScroll)
      scroller.removeEventListener("wheel", release)
      scroller.removeEventListener("pointerdown", release)
      scroller.removeEventListener("touchstart", release)
      window.removeEventListener("keydown", release)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <aside ref={asideRef} className="sticky top-2 hidden w-56 shrink-0 lg:block">
      {/* 레일에 머리를 두지 않는다 — 아이콘 + FEATURE STORE는 사이드바 헤더가 이미 같은 화면에서
          같은 표기로 보여주고 있어 두 번 읽힌다. 목차임을 알리는 건 nav의 접근성 이름이 맡는다. */}
      <nav
        aria-label="On this page"
        className="rounded-lg border border-sidebar-border bg-sidebar p-2 text-sidebar-foreground"
      >
        <ul className="flex flex-col gap-1">
          {GUIDE_SECTIONS.map((s) => {
            const isActive = s.id === active
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={isActive ? "location" : undefined}
                  onClick={() => {
                    pinned.current = s.id
                    setActive(s.id)
                  }}
                  className={cn(
                    "flex h-8 items-center rounded-md px-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                  )}
                >
                  {s.title}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
