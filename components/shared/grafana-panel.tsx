import { cn } from "@/lib/utils"

interface Props {
  title: string
  src: string
  className?: string
}

export function GrafanaPanel({ title, src, className }: Props) {
  return (
    <iframe
      title={title}
      src={src}
      className={cn("h-64 min-h-64 w-full border-0 lg:h-72 lg:min-h-72", className)}
      loading="lazy"
      allowFullScreen
    />
  )
}
