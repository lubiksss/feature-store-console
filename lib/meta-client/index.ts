// feature-store-api REST API 래퍼. 타입과 경로는 OpenAPI 스펙에서
// 생성되고(lib/meta-client/schema.ts), 도메인별 모듈이 그 위에 얇은 호출을 얹는다.
// client/unwrap transport는 내부 전용 — 도메인 모듈만 사용한다.
export {
  PAGE_SIZE,
  MAX_PAGE_SIZE,
  isNotFound,
  isConflict,
  MetaServerError,
  type Pagination,
  type Query,
} from "./transport"
export * from "./entities"
export * from "./online-stores"
export * from "./feature-views"
export * from "./batch-sources"
export * from "./feature-view-stores"
export * from "./ingestion-specs"
export * from "./stream-sources"
export * from "./events"
export * from "./event-schedules"
export * from "./operation-policy"
export * from "./feature-view-profiles"
export * from "./online-store-profiles"
export * from "./client-workflow"
