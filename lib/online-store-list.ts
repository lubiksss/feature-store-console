import { listStores, PAGE_SIZE, MAX_PAGE_SIZE } from "@/lib/meta-client"
import type { Store, Query } from "@/lib/meta-client"
import { readList } from "@/lib/read-failure"

type StoreFilters = Pick<NonNullable<Query<"listStores">>, "store_name" | "store_kind" | "owner">

interface LoadParams {
  offset: number
  filters?: StoreFilters
}

// 온라인 스토어 카탈로그 전체. store_kind 를 고르는 화면(스케줄, 목록 필터)의 선택지가 여기서
// 나온다 — 종류의 어휘도 이 테이블의 행이라, 콘솔에 사본을 두면 새 종류를 다룰 수 없다.
export async function fetchAllStores(): Promise<Store[]> {
  const all: Store[] = []
  const limit = MAX_PAGE_SIZE
  for (let offset = 0; ; offset += limit) {
    const r = await listStores({ limit, offset }).catch(() => null)
    if (!r || r.items.length === 0) break
    all.push(...r.items)
    if (offset + limit >= r.pagination.total) break
  }
  return all
}

export async function storeNameOptions(): Promise<string[]> {
  return [...new Set((await fetchAllStores()).map((s) => s.store_name))].sort()
}

export async function storeKindOptions(): Promise<string[]> {
  return [...new Set((await fetchAllStores()).map((s) => s.store_kind))].sort()
}

export async function loadStoreList(params: LoadParams) {
  const { offset, filters = {} } = params
  const [listed, all] = await Promise.all([
    readList(listStores({ limit: PAGE_SIZE, offset, ...filters })),
    fetchAllStores(),
  ])
  const result = listed.data ?? null
  return {
    stores: result?.items ?? [],
    storeNameOptions: [...new Set(all.map((s) => s.store_name))].sort(),
    storeKindOptions: [...new Set(all.map((s) => s.store_kind))].sort(),
    failure: listed.failure,
    limit: result?.pagination.limit ?? PAGE_SIZE,
    offset: result?.pagination.offset ?? offset,
    total: result?.pagination.total ?? 0,
  }
}

// 종류 → 그 종류의 인스턴스 이름들. 멤버십 폼이 쓴다: store_kind 는 정체성의 절반이라 다른
// 종류의 인스턴스를 고르면 서버가 거절하므로, 고를 수 있는 목록 자체를 종류로 좁힌다.
export async function storeNamesByKind(): Promise<Record<string, string[]>> {
  const byKind: Record<string, string[]> = {}
  for (const s of await fetchAllStores()) {
    ;(byKind[s.store_kind] ??= []).push(s.store_name)
  }
  for (const kind of Object.keys(byKind)) byKind[kind].sort()
  return byKind
}
