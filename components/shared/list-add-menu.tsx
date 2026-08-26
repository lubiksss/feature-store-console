// 정적 데모: 쓰기 평면이 없어 어피던스를 렌더하지 않는다.
// 상세·목록 컴포넌트를 원본 그대로 두기 위해 이름과 호출 형태만 유지한 스텁이다.
// props를 받되 쓰지 않으므로 FC 타입으로 선언한다 — 이름 붙은 미사용 파라미터를 남기지 않는다.
import type { FC } from "react"

export const ListAddMenu: FC<Record<string, unknown>> = () => null
