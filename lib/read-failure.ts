import "server-only"
import { MetaServerError } from "@/lib/meta-client"

// 목록 읽기가 실패한 방식. 지금까지 목록 페이지는 이것을 boolean 으로 뭉갰고, 그래서 어떤
// 실패든 화면이 "Cannot connect to 서버" 라고 말했다 — 서버가 무엇이 틀렸는지 정확히
// 답하고 request_id 까지 줬는데도 셋 다 버려졌다(연결은 멀쩡한데 연결 문제라고 말하는 것).
//
// message 가 없는 실패도 있다: 네트워크·DNS 처럼 서버가 아무 말도 하지 못한 경우다. 그때는
// 연결 문구가 참이므로 그것을 쓴다 — 문구를 없애는 것이 아니라, 참일 때만 쓰게 만드는 것이다.
export interface ReadFailure {
  /**
   * 서버가 사람에게 쓴 문구. 없을 수 있고, 그게 흔한 경우다: 파드가 죽었거나 롤링 중이면
   * ingress 가 problem+json 이 아닌 502 를 답하므로 서버는 아무 말도 하지 못한다. 그때는
   * 연결 문구가 참이다 — MetaServerError.message 는 그런 응답에도 `서버 502` 를
   * 합성하므로, 그것을 쓰면 이 구분이 사라진다.
   */
  message?: string
  /** 응답이 있었다면 그 상태 코드. 서버가 문구를 못 줬을 때 남는 유일한 사실이다. */
  status?: number
  /** 분기용 기계 식별자(code). 화면은 쓰지 않지만 신고에 붙으면 원인 대조가 빨라진다. */
  code?: string
  /** 로그와 대조할 수 있는 요청 식별자. 서버는 헤더와 본문 양쪽에 싣는다. */
  requestId?: string
}

// 읽기 실패를 화면에 넘길 수 있는 모양으로 바꾼다. 던져진 것을 삼키는 자리이므로, 서버가 말한
// 것은 남기고 말하지 않은 것은 없는 채로 둔다(없는 문구를 만들어 채우지 않는다).
export function toReadFailure(e: unknown): ReadFailure {
  if (e instanceof MetaServerError) {
    return {
      message: e.serverMessage,
      status: e.status,
      code: e.code,
      requestId: e.requestId,
    }
  }
  return {}
}

// 목록 읽기 하나를 "데이터 아니면 실패"로 감싼다. 페이지마다 catch 안에서 지역 변수를 바꾸는
// 대신 결과를 값으로 다루게 해서, 실패를 넘기는 것을 잊으면 타입이 걸리게 한다.
export async function readList<T>(
  p: Promise<T>,
): Promise<{ data: T; failure?: undefined } | { data?: undefined; failure: ReadFailure }> {
  try {
    return { data: await p }
  } catch (e) {
    return { failure: toReadFailure(e) }
  }
}
