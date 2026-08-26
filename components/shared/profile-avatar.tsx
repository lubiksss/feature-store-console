import { UserRoundIcon, type LucideIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Props {
  accountId: string
  // 사진이 없을 때 자리를 지키는 아이콘. 사진 연동 전과 화면이 같아지도록 원래 쓰던 아이콘을 넘긴다.
  fallbackIcon?: LucideIcon
  className?: string
}

// 뱃지(h-5) 안에 들어가는 크기. 아이콘(size-3) 자리를 대신하지만 뱃지 높이는 그대로다.
// Avatar 기본 테두리(after:border)는 끈다 — 뱃지가 이미 테두리를 두르고 있어 1px 링 두 개가
// 2px 간격으로 겹친다.
export function ProfileAvatar({ accountId, fallbackIcon: Icon = UserRoundIcon, className }: Props) {
  return (
    <Avatar className={cn("size-4 after:hidden", className)}>
      {/* 프록시 라우트가 404를 주면(키 미설정·미동의·만료) Avatar가 fallback으로 되돌린다. */}
      <AvatarImage src={`/api/profile-image/${encodeURIComponent(accountId)}`} alt="" />
      <AvatarFallback className="bg-transparent">
        <Icon className="size-3" />
      </AvatarFallback>
    </Avatar>
  )
}
