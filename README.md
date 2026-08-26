# feature-store-console

ML 피처 스토어 운영 콘솔의 **정적 데모**.

- 실제 서비스가 아니다. 백엔드가 없고, 화면의 모든 값은 저장소에 포함된 합성 샘플 데이터다.
- 읽기 전용이다. 등록·수정·삭제 평면은 제공하지 않는다.
- 피처 스토어 도메인(엔티티 · 소스 · 서빙 스토어 · 스펙 · 이벤트 · 파티션)이 화면에서
  어떻게 읽히는지 보이기 위한 것이다.

Next.js App Router + TypeScript + shadcn/ui. `pnpm dev`로 실행, `pnpm build`로 정적 export.
