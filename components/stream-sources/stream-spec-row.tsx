import { TableCell, TableRow } from "@/components/ui/table"
import { TopicLink } from "@/components/shared/topic-link"
import { TextCell } from "@/components/shared/text-cell"

export interface StreamSpecRowData {
  featureViewName: string
  inputTopic: string
  inputBroker?: string
  keyPath: string
  valuePath: string
  eventTsPath: string
  updatedAt: string
}

interface Props {
  data: StreamSpecRowData
  onClick?: () => void
}

export function StreamSpecRow({ data, onClick }: Props) {
  return (
    <TableRow className={onClick ? "cursor-pointer" : undefined} onClick={onClick}>
      <TextCell>{data.featureViewName}</TextCell>
      <TableCell>
        <TopicLink topic={data.inputTopic} broker={data.inputBroker} />
      </TableCell>
      <TextCell>{data.keyPath}</TextCell>
      <TextCell>{data.valuePath}</TextCell>
      <TextCell>{data.eventTsPath}</TextCell>
      <TextCell className="tabular-nums">{data.updatedAt}</TextCell>
    </TableRow>
  )
}
