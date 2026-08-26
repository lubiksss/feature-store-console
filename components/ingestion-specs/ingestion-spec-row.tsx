import { TableCell, TableRow } from "@/components/ui/table"
import { HdfsPathLink } from "@/components/shared/hdfs-path-link"
import { TextCell } from "@/components/shared/text-cell"

export interface IngestionSpecRowData {
  featureViewName: string
  sourcePathPattern: string
  outputHdfsPathPattern: string
  updatedAt: string
}

interface Props {
  data: IngestionSpecRowData
  onClick?: () => void
}

export function IngestionSpecRow({ data, onClick }: Props) {
  return (
    <TableRow className={onClick ? "cursor-pointer" : undefined} onClick={onClick}>
      <TextCell>{data.featureViewName}</TextCell>
      <TableCell>
        <HdfsPathLink path={data.sourcePathPattern} />
      </TableCell>
      <TableCell>
        <HdfsPathLink path={data.outputHdfsPathPattern} />
      </TableCell>
      <TextCell className="tabular-nums">{data.updatedAt}</TextCell>
    </TableRow>
  )
}
