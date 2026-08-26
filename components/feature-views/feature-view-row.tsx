import { EnumBadge } from "@/components/shared/enum-badges"
import { EntityNameLink } from "@/components/shared/entity-name"
import { OwnerBadges } from "@/components/shared/owner-badge"
import { TextCell } from "@/components/shared/text-cell"
import { TableCell, TableRow } from "@/components/ui/table"

export interface FeatureViewRowData {
  featureViewName: string
  entityName: string
  producer: string
  owner: string
  lifecycleStatus: string
  updatedAt: string
}

interface Props {
  data: FeatureViewRowData
  onClick?: () => void
}

export function FeatureViewRow({ data, onClick }: Props) {
  return (
    <TableRow className={onClick ? "cursor-pointer" : undefined} onClick={onClick}>
      <TextCell>{data.featureViewName}</TextCell>
      <TableCell>
        <EntityNameLink
          entityName={data.entityName}
          href={`/feature-views?entity_name=${encodeURIComponent(data.entityName)}`}
        />
      </TableCell>
      <TableCell>
        <EnumBadge set="producer" value={data.producer} />
      </TableCell>
      <TableCell>
        <OwnerBadges owner={data.owner} listPath="/feature-views" collapse />
      </TableCell>
      <TableCell>
        <EnumBadge set="featureViewLifecycle" value={data.lifecycleStatus} />
      </TableCell>
      <TextCell className="tabular-nums">{data.updatedAt}</TextCell>
    </TableRow>
  )
}
