import createClient from "openapi-fetch"
import { fixtureFetch } from "../fixtures/serve"
import type { components, operations, paths } from "./schema"

// 정적 데모. 원본은 여기서 실 서버(META_SERVER_URL)를 호출하지만, 이 빌드는 같은 계약 타입
// 위에서 픽스처가 응답한다 — 경로·쿼리·응답 타입 검사는 그대로 살아 있다.
const BASE_URL = "http://demo.local"

// 계약에서 온 타입들. 손으로 쓴 사본이 아니라 OpenAPI 스펙에서
// 생성된 것이므로(make gen), 서버가 필드를 바꾸면 여기가 아니라 호출부가 컴파일 오류를 낸다.
export type Pagination = components["schemas"]["Pagination"]
export type Problem = components["schemas"]["Problem"]

// 목록 필터의 타입도 계약에서 온다. 손으로 쓴 파라미터 객체는 스펙이 필터를 더하거나 이름을
// 바꿔도 조용했다 — 이제 오퍼레이션 id 로 그 쿼리 타입을 그대로 가리킨다.
export type Query<K extends keyof operations> = operations[K]["parameters"]["query"]

// 상태 코드를 실어 던진다: 부재(404)와 장애(5xx/네트워크)를 호출부가 구분해야 하는 자리가
// 있다 — 예: 피처 뷰 상세의 location 조회는 404면 "아직 없음"(Add 제공)이지만, 5xx를 같은 것으로
// 삼키면 이미 있는 location에 Add를 권해 409를 유발한다.
export class MetaServerError extends Error {
  constructor(
    readonly status: number,
    readonly path: string,
    /** Server-supplied `code`, when the body carried one. */
    readonly code?: Problem["code"],
    /** Server-supplied `request_id`, for correlating a report with the logs. */
    readonly requestId?: string,
    message?: string,
    /**
     * 서버가 본문에 써 보낸 문구. message 와 다르다: message 는 보여줄 것이 없을 때
     * `서버 <status>` 로 합성되므로 항상 값이 있고, 이것은 서버가 실제로 말했을 때만
     * 있다. 둘을 구분해야 "서버가 이유를 말했다"와 "상태 코드밖에 없다"를 화면이 가를 수 있다.
     */
    readonly serverMessage?: string,
  ) {
    super(message ?? `서버 ${status}: ${path}`)
    this.name = "MetaServerError"
  }
}

export function isNotFound(e: unknown): boolean {
  return e instanceof MetaServerError && e.status === 404
}

// 409 는 "그 행으로는 지금 아무것도 할 수 없다"는 서버의 답이다(예: 이 서버가 모델링하지 않는
// producer·상태를 가진 피처 뷰의 오퍼 조회). 부재도 장애도 아니어서 호출부가 빈 결과로 다뤄야 하는
// 자리가 있고, 그것을 5xx 와 같이 삼키면 장애를 정상으로 렌더한다.
export function isConflict(e: unknown): boolean {
  return e instanceof MetaServerError && e.status === 409
}

export const PAGE_SIZE = 100
// 서버 rejects limit > 100 (HTTP 400).
export const MAX_PAGE_SIZE = 100

const client = createClient<paths>({ baseUrl: BASE_URL, fetch: fixtureFetch })

export { client }

// 성공 응답의 data 타입. 조건부 타입으로 union 을 훑어 error 분기의 undefined 를 걷어낸다 —
// 인자에서 직접 추론하면 성공 타입이 `T | undefined` 로 번진다.
type OkData<R> = R extends { data?: infer D } ? Exclude<D, undefined> : never

// openapi-fetch 결과를 예외로 바꾼다. 계약 타입은 파싱 성공을 보장하지 않으므로 본문이
// problem+json 이 아닐 때(HTML 오류 페이지 등)도 상태 코드로 말이 되는 에러가 나가야 한다.
export function unwrap<R extends { response: Response }>(result: R): OkData<R> {
  const { data, error, response } = result as {
    data?: unknown
    error?: unknown
    response: Response
  }
  if (!response.ok) {
    // 401/403 을 "Session expired" / "You do not have permission" 으로 바꿔 쓰던 적이 있다.
    // 그것은 서버를 오역한 것이다 — IdP 도달 불가도 401 로 답하고, 그때 세션이 만료됐다고
    // 말하면 사용자를 같은 방식으로 실패하는 재로그인으로 보낸다. 서버가 말한 것을 전한다.
    const problem = asProblem(error)
    const said = problem?.message?.trim() || undefined
    throw new MetaServerError(
      response.status,
      pathOf(response.url),
      problem?.code,
      problem?.request_id,
      said ?? `서버 ${response.status}`,
      said,
    )
  }
  return data as OkData<R>
}

// 에러 본문은 계약상 Problem(code/message/request_id 필수)이지만, 실제로 온 것이 그 모양인지는
// 런타임 사실이다. 생성 타입은 그것을 보장하지 않으므로 좁혀서 읽는다.
function asProblem(error: unknown): Partial<Problem> | undefined {
  if (error && typeof error === "object") return error as Partial<Problem>
  return undefined
}

function pathOf(url: string): string {
  try {
    return new URL(url).pathname
  } catch {
    return url
  }
}
