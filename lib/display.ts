const EMPTY = "-"

export function display(value: string | number | null | undefined): string {
  if (value == null || value === "") return EMPTY
  return String(value)
}

export function displayBytes(bytes: number | null | undefined): string {
  if (bytes == null) return EMPTY
  if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(1)} GB`
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`
  if (bytes >= 1_024) return `${(bytes / 1_024).toFixed(1)} KB`
  return `${bytes} B`
}

export function displayScore(score: number | null | undefined): string {
  if (score == null) return EMPTY
  return `${score.toFixed(1)}%`
}
