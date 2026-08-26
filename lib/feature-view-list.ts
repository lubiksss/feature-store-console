import { listFeatureViews, PAGE_SIZE, MAX_PAGE_SIZE } from "@/lib/meta-client"
import type { Query, FeatureView } from "@/lib/meta-client"
import { readList } from "@/lib/read-failure"

// 필터 이름과 값 타입은 계약의 listFeatureViews 쿼리에서 뽑는다 — 손으로 다시 적으면 서버가 필터를
// 더하거나 어휘를 바꿀 때 조용히 낡는다.
type SourceFilters = Pick<
  NonNullable<Query<"listFeatureViews">>,
  "feature_view_name" | "producer" | "entity_name" | "owner" | "lifecycle_status"
>

interface LoadParams {
  offset: number
  scope?: SourceFilters
  filters?: SourceFilters
}

// Fetch every featureView matching scope, looping past the server's 100-row page cap
// so filter dropdowns / pickers list ALL featureViews (not just the first page).
export async function fetchAllSources(scope: SourceFilters = {}): Promise<FeatureView[]> {
  const all: FeatureView[] = []
  const limit = MAX_PAGE_SIZE
  for (let offset = 0; ; offset += limit) {
    const r = await listFeatureViews({ limit, offset, ...scope }).catch(() => null)
    if (!r || r.items.length === 0) break
    all.push(...r.items)
    if (offset + limit >= r.pagination.total) break
  }
  return all
}

export async function eligibleSourceOptions(scope: SourceFilters = {}): Promise<string[]> {
  return (await fetchAllSources(scope)).map((s) => s.feature_view_name).sort()
}

export async function loadFeatureViewList(params: LoadParams) {
  const { offset, scope = {}, filters = {} } = params

  // Page data is server-paginated (20/page). Filter-dropdown options loop the full
  // scoped set so every featureView is selectable regardless of page count.
  const [listed, optionSources] = await Promise.all([
    readList(listFeatureViews({ limit: PAGE_SIZE, offset, ...scope, ...filters })),
    fetchAllSources(scope),
  ])
  const result = listed.data ?? null

  // owner is filtered server-side by exact match on the full comma-set string (owner IN),
  // not per-person membership — so there's no useful catalog to offer; the column uses
  // free-text exact entry instead.
  return {
    featureViews: result?.items ?? [],
    optionSources,
    sourceOptions: optionSources.map((s) => s.feature_view_name).sort(),
    failure: listed.failure,
    limit: result?.pagination.limit ?? PAGE_SIZE,
    offset: result?.pagination.offset ?? offset,
    total: result?.pagination.total ?? 0,
  }
}
