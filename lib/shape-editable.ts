import "server-only"
import { getFeatureViewActions } from "@/lib/meta-client"

// 피처 뷰의 형상(satellite: location / ingestion_spec / stream_spec)을 지금 쓸 수 있는가.
// 서버가 오퍼에 실어 주는 사실이므로(shape_editable) 화면이 lifecycle_status 로 추론하지 않는다
// — 추론하면 그것이 또 하나의 규칙 사본이고, 서버는 생성·수정·삭제 셋 다 같은 게이트로 막는다.
//
// 조회 실패는 전부 "잠김"이다. 잠금은 "지금은 쓸 수 없다"는 뜻이고 서버가 답하지 못하는 동안
// 그것은 참이다 — 반대로 열어 두면 폼을 다 채운 뒤 저장에서 409 를 만난다. 이 판단은 피처 뷰
// 상세와 다르다: 거기서는 오퍼가 화면의 주제라서 조회 실패를 삼키지 않고 크게 실패시킨다.
export async function isShapeEditable(featureViewName: string): Promise<boolean> {
  return getFeatureViewActions(featureViewName)
    .then((offer) => offer.shape_editable)
    .catch(() => false)
}
