import { SettingsIcon } from "lucide-react"
import { IconBadge } from "@/components/shared/icon-badge"
import { ProfileAvatar } from "@/components/shared/profile-avatar"

interface Props {
  actor: string
  className?: string
}

// Service identities (e.g. "system", "cron", "batch-pipeline-service"); human actors are operator ids.
function isService(actor: string): boolean {
  return actor === "system" || actor === "cron" || actor.endsWith("-service")
}

export function ActorBadge({ actor, className }: Props) {
  // 서비스 계정은 프로필 이미지를 찾을 대상이 아니다 — 톱니 아이콘을 그대로 둔다.
  return (
    <IconBadge
      icon={isService(actor) ? SettingsIcon : undefined}
      leading={isService(actor) ? undefined : <ProfileAvatar accountId={actor} />}
      className={className}
    >
      {actor}
    </IconBadge>
  )
}
