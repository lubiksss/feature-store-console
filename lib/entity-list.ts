import { listEntities, PAGE_SIZE, MAX_PAGE_SIZE } from "@/lib/meta-client"
import type { Entity, Query } from "@/lib/meta-client"
import { readList } from "@/lib/read-failure"

// 필터 이름과 값 타입은 계약의 listEntities 쿼리에서 뽑는다 — 손으로 다시 적으면 서버가
// 필터를 더할 때 조용히 낡는다.
type EntityFilters = Pick<NonNullable<Query<"listEntities">>, "entity_name" | "owner">

interface LoadParams {
  offset: number
  filters?: EntityFilters
}

// 대상 어휘 전체. entity_name 을 고르는 화면(피처 뷰 생성, 목록 필터)은 이 목록에서 선택지를
// 얻는다 — 콘솔 안에 어휘를 다시 적으면 대상을 추가할 때마다 콘솔을 배포해야 하고, 그것을
// 없애는 것이 fs_entity 를 테이블로 만든 이유다.
export async function fetchAllEntities(): Promise<Entity[]> {
  const all: Entity[] = []
  const limit = MAX_PAGE_SIZE
  for (let offset = 0; ; offset += limit) {
    const r = await listEntities({ limit, offset }).catch(() => null)
    if (!r || r.items.length === 0) break
    all.push(...r.items)
    if (offset + limit >= r.pagination.total) break
  }
  return all
}

export async function entityNameOptions(): Promise<string[]> {
  return (await fetchAllEntities()).map((e) => e.entity_name).sort()
}

export async function loadEntityList(params: LoadParams) {
  const { offset, filters = {} } = params
  const [listed, options] = await Promise.all([
    readList(listEntities({ limit: PAGE_SIZE, offset, ...filters })),
    fetchAllEntities(),
  ])
  const result = listed.data ?? null
  return {
    entities: result?.items ?? [],
    entityOptions: options.map((e) => e.entity_name).sort(),
    failure: listed.failure,
    limit: result?.pagination.limit ?? PAGE_SIZE,
    offset: result?.pagination.offset ?? offset,
    total: result?.pagination.total ?? 0,
  }
}
