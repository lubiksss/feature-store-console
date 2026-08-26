import { FieldTable, SectionCard } from "@/components/shared/detail-section"
import { CpuIcon, HardDriveUploadIcon, ShieldCheckIcon, type LucideIcon } from "lucide-react"
import { EventIdBadge } from "@/components/shared/event-id-badge"
import { EnumBadge } from "@/components/shared/enum-badges"
import { YarnLink } from "@/components/shared/yarn-link"
import { display } from "@/lib/display"
import type { Execution } from "@/lib/meta-client"

// Shared per-field cell renderers (via `F`), so every execution card draws a field the same
// way. Both ExecutionSection (single-run) and PartitionRunCard compose these into their own
// explicit 4-column-pair layouts; a new field goes here AND into those layouts.
// `cluster` is the featureView location's hadoop_cluster: an execution ran on that cluster's YARN,
// so the RM proxy host follows it. Only the yarn cell uses it; it is threaded to every cell so
// a future cluster-dependent field needs no signature change.
type ExecField = {
  label: string
  cell: (ex: Execution, cluster?: string) => React.ReactNode
}

const EXECUTION_FIELDS: ExecField[] = [
  { label: "event_kind", cell: (ex) => <EnumBadge set="eventKind" value={ex.event_kind} /> },
  { label: "execution_id", cell: (ex) => <EventIdBadge eventId={ex.execution_id} /> },
  { label: "spark_started_at", cell: (ex) => display(ex.spark_started_at) },
  {
    label: "yarn_application_id",
    cell: (ex, cluster) =>
      ex.yarn_application_id ? (
        <YarnLink applicationId={ex.yarn_application_id} cluster={cluster} />
      ) : (
        display(undefined)
      ),
  },
  { label: "spark_succeeded_at", cell: (ex) => display(ex.spark_succeeded_at) },
  { label: "spark_failed_at", cell: (ex) => display(ex.spark_failed_at) },
  { label: "updated_at", cell: (ex) => ex.updated_at },
  { label: "created_at", cell: (ex) => ex.created_at },
]
type ExecLabel = (typeof EXECUTION_FIELDS)[number]["label"]
const F = Object.fromEntries(EXECUTION_FIELDS.map((f) => [f.label, f.cell])) as Record<
  ExecLabel,
  (ex: Execution, cluster?: string) => React.ReactNode
>

// Single-run card (featureView/ingestion events): one run, so the right value column is free — the
// succeeded|failed and updated|created siblings pack into one 4-column row each. Always renders
// at least one card — empty ("-") when there's no run yet — so the user sees the card that will
// fill in over time rather than it appearing out of nowhere.
export function ExecutionSection({
  executions,
  cluster,
}: {
  executions: Execution[]
  cluster?: string
}) {
  const list: (Execution | undefined)[] = executions.length ? executions : [undefined]
  const v = (label: ExecLabel, ex?: Execution) => (ex ? F[label](ex, cluster) : display(undefined))
  return (
    <>
      {list.map((ex, i) => (
        <SectionCard key={ex?.execution_id ?? i} title="Execution" icon={CpuIcon}>
          <FieldTable
            rows={[
              { label: "event_kind", value: v("event_kind", ex) },
              { label: "execution_id", value: v("execution_id", ex) },
              { label: "spark_started_at", value: v("spark_started_at", ex) },
              { label: "yarn_application_id", value: v("yarn_application_id", ex) },
              {
                label: "spark_succeeded_at",
                value: v("spark_succeeded_at", ex),
                label2: "spark_failed_at",
                value2: v("spark_failed_at", ex),
              },
              {
                label: "updated_at",
                value: v("updated_at", ex),
                label2: "created_at",
                value2: v("created_at", ex),
              },
            ]}
          />
        </SectionCard>
      ))}
    </>
  )
}

// One run's card (materialization or consistency) for the partition detail. Keeps the
// succeeded|failed and updated|created sibling pairs (4-col within the card); labels are
// narrowed so the pairs fit the half-width card. Empty ("-") until the run reports.
function PartitionRunCard({
  title,
  icon,
  execution,
  cluster,
}: {
  title: string
  icon: LucideIcon
  execution?: Execution
  cluster?: string
}) {
  const v = (label: ExecLabel) => (execution ? F[label](execution, cluster) : display(undefined))
  return (
    <SectionCard title={title} icon={icon}>
      <FieldTable
        labels="narrow"
        rows={[
          { label: "event_kind", value: v("event_kind") },
          { label: "execution_id", value: v("execution_id") },
          { label: "spark_started_at", value: v("spark_started_at") },
          { label: "yarn_application_id", value: v("yarn_application_id") },
          {
            label: "spark_succeeded_at",
            value: v("spark_succeeded_at"),
            label2: "spark_failed_at",
            value2: v("spark_failed_at"),
          },
          {
            label: "updated_at",
            value: v("updated_at"),
            label2: "created_at",
            value2: v("created_at"),
          },
        ]}
      />
    </SectionCard>
  )
}

// Partition twin: materialization then consistency, one full-width card each. Stacked like
// the result cards above them so a run reads across the page instead of down a narrow column.
export function PartitionExecutionCards({
  executions,
  cluster,
}: {
  executions: Execution[]
  cluster?: string
}) {
  const materialization = executions.find((e) => e.event_kind === "materialization")
  const consistency = executions.find((e) => e.event_kind === "consistency")
  return (
    <div className="grid gap-4">
      <PartitionRunCard
        title="Materialization Execution"
        icon={HardDriveUploadIcon}
        execution={materialization}
        cluster={cluster}
      />
      <PartitionRunCard
        title="Consistency Execution"
        icon={ShieldCheckIcon}
        execution={consistency}
        cluster={cluster}
      />
    </div>
  )
}
