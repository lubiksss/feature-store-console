import { TableCell, TableHead } from "@/components/ui/table"
import { TruncateTip } from "@/components/shared/truncate-tip"

// A cell's text content: truncates on overflow (tables are table-fixed) and shows
// the full value in a tooltip when clipped. Rich children (badges/links) manage
// their own truncation, so only wrap bare string/number content.
function content(children: React.ReactNode) {
  return typeof children === "string" || typeof children === "number" ? (
    <TruncateTip>{children}</TruncateTip>
  ) : (
    children
  )
}

// Free-text / value table cell. The base <TableCell> only sets whitespace-nowrap;
// TextCell adds the truncate-with-tooltip policy in one place. Badge/link cells
// stay as <TableCell>; their atoms (FeatureViewNameLink, YarnLink, …) truncate their own.
export function TextCell({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TableCell>) {
  return (
    <TableCell className={className} {...props}>
      {content(children)}
    </TableCell>
  )
}

// Header cell with the same policy — a long field-name header (e.g.
// source_status_event_id) in a narrow column truncates and reveals in a tooltip
// instead of overflowing into the next header.
export function TextHead({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TableHead>) {
  return (
    <TableHead className={className} {...props}>
      {content(children)}
    </TableHead>
  )
}
