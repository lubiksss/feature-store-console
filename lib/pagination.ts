// 목록의 "지금 어디를 보고 있는가"를 말하는 규칙. 서버가 준 pagination(limit/offset/total)을
// 문장과 빈 상태 문구로 옮기는 일만 한다 — offset 을 고치거나 다른 쪽으로 보내지 않는다.
// 끝을 지난 offset 에 서버는 클램프 없이 빈 쪽을 준다. 그 응답이 사실이므로 그대로 그리되,
// 화면의 두 자리(푸터, 빈 상태)가 같은 판단에서 갈리도록 여기 한 곳에 둔다.

const n = (v: number) => v.toLocaleString("en-US")

// 요청한 자리가 결과 끝을 지났다 = 이 쪽에는 행이 없다. offset 0 은 목록이 비었을 뿐이라
// 제외한다 — 그 둘은 사용자에게 다른 사실이다("아직 없다" vs "이 쪽에 없다").
export function isPastEnd(offset: number, total: number): boolean {
  return offset > 0 && offset >= total
}

// "보고 있는 구간 of 조건에 걸린 수". total 은 지금 걸린 필터까지 반영해 서버가 센 값이고,
// 응답(Pagination: limit/offset/total)에 무필터 전체 크기를 담는 자리는 없다 — 그래서 이
// 문장은 "전체 중 몇 건이 걸렸나"가 아니라 "걸린 것 중 어디를 보고 있나"를 말한다.
// 한 쪽뿐이라 구간과 그 수가 같아도 형식을 줄이지 않는다: 자리에 따라 문장이 바뀌면 읽는
// 사람이 매번 어느 형식인지부터 판단해야 한다.
// 끝 번호는 total 로 자른다(마지막 쪽은 limit 보다 짧다). 끝을 지난 쪽은 0건이지만 총량은
// 여전히 말해준다 — 그래야 표가 비어 있는 이유가 "없어서"가 아님이 푸터에서 읽힌다.
// 총량이 0 일 때만 "of" 를 뗀다: 관계지을 전체가 없는데 "0 of 0" 은 아무것도 더 말하지 않는다.
export function rangeLabel(limit: number, offset: number, total: number): string {
  if (total === 0) return n(0)
  const start = offset + 1
  const end = Math.min(offset + limit, total)
  if (start > end) return `0 of ${n(total)}`
  return `${n(start)}–${n(end)} of ${n(total)}`
}
