import Link from "next/link"

// 정적 export에서는 서버 리다이렉트가 없다. next/navigation의 redirect()는 basePath를
// 붙이지 않아 GitHub Pages 서브패스에서 레포명이 빠진 경로로 나가 404가 된다.
// meta refresh + Link 둘 다 두는 이유: refresh가 즉시 옮겨 주고, 그것이 막힌 환경에서도
// 사용자가 눌러서 들어갈 수 있어야 한다. basePath는 Link와 BASE_PATH가 함께 처리한다.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

export default function Root() {
  return (
    <html lang="ko">
      <head>
        <meta httpEquiv="refresh" content={`0; url=${BASE_PATH}/dashboard/`} />
        <title>Feature Store Console</title>
      </head>
      <body>
        <p style={{ fontFamily: "system-ui", padding: "2rem" }}>
          <Link href="/dashboard">Dashboard로 이동</Link>
        </p>
      </body>
    </html>
  )
}
