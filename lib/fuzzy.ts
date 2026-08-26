// 단일 term의 subsequence 점수. 매칭이면 점수(높을수록 우선), 아니면 null.
// 연속 매칭, 앞쪽 매칭에 가점한다.
function scoreTerm(text: string, term: string): number | null {
  let ti = 0
  let score = 0
  let prev = -2
  for (let qi = 0; qi < term.length; qi++) {
    const ch = term[qi]
    let found = -1
    while (ti < text.length) {
      if (text[ti] === ch) {
        found = ti
        ti++
        break
      }
      ti++
    }
    if (found === -1) return null
    if (found === prev + 1) score += 5 // 연속 매칭 가점
    score += Math.max(0, 8 - found) // 앞쪽 매칭 가점
    prev = found
  }
  return score
}

// fzf식 랭킹 점수. 공백을 term 구분자(AND)로 취급 — 모든 term이 subsequence로
// 매칭되어야 하고, 각 term은 텍스트 전체에서 독립적으로 매칭한다 (예: "test feature" → test_feature).
export function fuzzyScore(text: string, query: string): number | null {
  const q = query.trim().toLowerCase()
  if (q === "") return 0
  const t = text.toLowerCase()
  let total = 0
  for (const term of q.split(/\s+/)) {
    const s = scoreTerm(t, term)
    if (s === null) return null
    total += s
  }
  return total
}
