// 정적 데모 빌드. 쓰기 평면(등록/수정/삭제)이 없으므로 편집 권한은 항상 없다.
// 페이지는 이 값으로 Add/Edit 어피던스를 감춘다 — 호출부를 고치지 않기 위해 시그니처를 유지한다.
export async function canEdit(): Promise<boolean> {
  return false
}
