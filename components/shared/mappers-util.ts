// server(number) → view(string) 공용 헬퍼. null/undefined는 undefined로 보존한다.
export const numStr = (n?: number | null) => (n != null ? String(n) : undefined)
