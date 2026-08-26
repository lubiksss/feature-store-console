"use client"

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation"

// 이 앱은 문서가 아니라 중첩 컨테이너가 스크롤된다((app) 레이아웃이 h-svh + overflow-hidden이고,
// 실제 스크롤러는 PageMain의 <main> 또는 목록의 DataTable 안쪽 div다). 브라우저와 Next의 기본
// 스크롤 복원은 문서 스크롤러만 대상이라, 뒤로가기로 돌아왔을 때 위치를 되찾는 일은 직접 해야 한다.
// 스크롤되는 셸이 이 훅을 붙이고, 페이지는 아무것도 하지 않는다.
//
// 저장 키는 경로 + 쿼리다. 이 앱에서 목록은 필터, 페이지네이션이 전부 쿼리로 표현되고
// (/feature-views?producer=batch), 그 이동은 컴포넌트를 언마운트하지 않으므로 pathname만 보면 키가
// 낡는다 — 필터 목록의 위치가 전체 목록의 저장값을 덮어쓴다. useSearchParams를 함께 의존해야 한다.
//
// 복원 시점은 "뒤로/앞으로 이동으로 이 URL에 도착했을 때"다. 판별을 시계(=popstate 이후 n초)로
// 하면 두 가지가 깨진다: 느린 목록(force-dynamic + per-row fetch)은 창이 닫힌 뒤에 마운트되어
// 복원을 못 하고, 반대로 하드 로드 직후에는 performance.now()가 작아 아무 이동도 없었는데 복원이
// 돈다. 그래서 popstate가 목표 URL을 적어두고(pendingUrl), 그 URL의 스크롤러가 마운트될 때만
// 복원한다. 한 페이지에 스크롤러가 둘 있어도 같은 커밋에서 둘 다 보고, 정리는 그 태스크가 끝난 뒤
// 한 번만 한다.
let pendingUrl: string | null = null
let clearScheduled = false

if (typeof window !== "undefined") {
  // popstate는 URL이 이미 바뀐 뒤에 오므로 location이 곧 목표다.
  window.addEventListener("popstate", () => {
    pendingUrl = location.pathname + location.search
    clearScheduled = false
  })
}

function consumePending(url: string): boolean {
  if (pendingUrl !== url) return false
  if (!clearScheduled) {
    clearScheduled = true
    // 같은 태스크의 다른 스크롤러도 보게 두고, 그 뒤에 비운다. 남겨두면 나중에 같은 URL로
    // 앞으로 이동했을 때 이동하지도 않은 복원이 돈다.
    setTimeout(() => {
      pendingUrl = null
      clearScheduled = false
    }, 0)
  }
  return true
}

// 복원 시점에 콘텐츠 높이가 아직 모자랄 수 있다(RSC 페이로드가 붙는 중). 목표에 닿을 때까지 몇 프레임
// 다시 시도하고, 그래도 안 되면 포기한다 — 무한 루프 대신 짧은 재시도.
const RESTORE_FRAMES = 12
// 저장은 스크롤이 멎은 뒤 한 번만 한다. sessionStorage.setItem은 동기라 프레임마다 부르면
// 긴 목록을 튕겨 넘길 때 그 비용이 스크롤에 실린다.
const SAVE_DEBOUNCE_MS = 150

export function useScrollRestore(
  ref: React.RefObject<HTMLElement | null>,
  slot: string,
  enabled = true,
) {
  const pathname = usePathname()
  const search = useSearchParams().toString()

  React.useEffect(() => {
    const el = ref.current
    if (!enabled || !el) return

    const url = pathname + (search ? `?${search}` : "")
    const key = `feature-store:scroll:${slot}:${url}`

    // 복원 중에는 저장하지 않는다. 아직 짧은 컨테이너에 scrollTop을 넣으면 값이 잘려 들어가고,
    // 그 잘린 값을 저장하면 다음 뒤로가기가 더 위에서 멈추며 점점 깎인다.
    let restoring = false
    let saveTimer: ReturnType<typeof setTimeout> | undefined
    const save = () => {
      saveTimer = undefined
      if (!restoring) sessionStorage.setItem(key, String(el.scrollTop))
    }
    const onScroll = () => {
      if (restoring) return
      if (saveTimer) clearTimeout(saveTimer)
      saveTimer = setTimeout(save, SAVE_DEBOUNCE_MS)
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    // 탭을 닫거나 숨길 때 대기 중인 저장을 흘리지 않는다.
    window.addEventListener("pagehide", save)

    let restoreFrame = 0
    if (consumePending(url)) {
      const want = Number(sessionStorage.getItem(key) ?? 0)
      if (want > 0) {
        restoring = true
        let tries = 0
        const restore = () => {
          el.scrollTop = want
          if (Math.abs(el.scrollTop - want) > 1 && tries++ < RESTORE_FRAMES) {
            restoreFrame = requestAnimationFrame(restore)
          } else {
            restoreFrame = 0
            restoring = false
          }
        }
        restoreFrame = requestAnimationFrame(restore)
      }
    }

    return () => {
      if (saveTimer) {
        clearTimeout(saveTimer)
        save()
      }
      if (restoreFrame) cancelAnimationFrame(restoreFrame)
      el.removeEventListener("scroll", onScroll)
      window.removeEventListener("pagehide", save)
    }
  }, [pathname, search, ref, slot, enabled])
}
