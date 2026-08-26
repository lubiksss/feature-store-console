// "진행 중" 신호: submitted 계열 상태는 콜백이 오기 전까지 실제로 실행 중인데, 정적 뱃지로는
// 멈춘 상태(succeeded/failed)와 구분되지 않는다. 뱃지의 원래 아이콘은 그대로 두고(partition
// status의 materialization/consistency 구분이 아이콘에 실려 있다) 오른쪽에 ping 점만 덧붙인다 —
// 움직임이 뱃지 한 구석에 갇혀 목록에 submitted 행이 여러 개여도 화면 전체가 깜빡이지 않는다.
//
// bg-current: 뱃지의 전경색을 그대로 물려받아 tone이 바뀌어도 따라간다.
// motion-reduce: OS "동작 줄이기"를 켠 사용자에게 계속 움직이는 UI는 접근성 문제다.
export function LiveDot() {
  return (
    <span className="relative flex size-1.5" aria-hidden>
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-75 motion-reduce:animate-none" />
      <span className="relative inline-flex size-1.5 rounded-full bg-current" />
    </span>
  )
}
