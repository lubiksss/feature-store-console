import type { NextConfig } from "next"

// GitHub Pages 배포. 서버 런타임(라우트 핸들러·서버 액션·쿠키·쿼리 필터)이 없고,
// 모든 화면이 빌드 시점에 픽스처로 렌더된다.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
}

export default nextConfig
