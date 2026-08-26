import { BookTextIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  href: string
  label?: string
  className?: string
}

// 서버 /docs (Redoc HTML)로 연결하는 외부 링크.
// GrafanaIconLink와 동일한 스타일 — 테두리 있는 작은 아이콘 버튼.
export function ApiDocsIconLink({ href, label = "API docs", className }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-md border bg-background/80 backdrop-blur transition-colors hover:bg-background",
        className,
      )}
    >
      <BookTextIcon className="size-4" aria-hidden="true" />
    </a>
  )
}
