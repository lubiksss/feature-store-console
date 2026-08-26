// 정적 이미지 import(`import x from "@/public/…webp"`)의 모듈 타입은 Next 가 제공하지만, 그
// 선언을 끌어오는 next-env.d.ts 는 gitignore 대상이고 `next build`/`next dev` 가 만든다.
// 빌드 전에 타입체크를 돌리는 CI 에서는 그 파일이 없어 TS2307 로 실패한다.
//
// 이 파일은 추적되므로 빌드 순서와 무관하게 그 선언을 세운다. next-env.d.ts 를 대신하는 것이
// 아니라, 그중 이미지 모듈 부분만 빌드 산출물에 의존하지 않게 만든다.
/// <reference types="next/image-types/global" />
