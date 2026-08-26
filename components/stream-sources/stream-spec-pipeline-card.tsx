import {
  BracesIcon,
  BracketsIcon,
  CheckCircle2Icon,
  CircleIcon,
  ClockIcon,
  FilterIcon,
  GitBranchIcon,
  InfoIcon,
} from "lucide-react"
import { SectionCard } from "@/components/shared/detail-section"
import { CodeBlock, CondTable, Facts, Stage, Val } from "@/components/shared/explain"
import type { StreamSpecDetailData } from "@/components/stream-sources/stream-spec-detail"

// 이 스펙이 실제 fs_stream_pipeline에서 어떻게 처리되는지를 보여주는 읽기 전용 카드.
// 줄글로 설명 가능한 건 줄글로, 값에 따라 분기하는 필드는 "…은 아래와 같이 사용됩니다" + 테이블로.
// 필드값은 어디서나 "컬럼(값)" 뱃지로 통일. 필드값은 처리 순서대로 읽힌다.
// 렌더 프리미티브(Stage/Facts/CondTable/CodeBlock/Val)는 components/shared/explain.tsx 공용.

export function StreamSpecPipelineCard({ data }: { data: StreamSpecDetailData }) {
  const agg = data.aggregationType?.toLowerCase()
  const fmt = data.eventTsFormat?.toLowerCase()
  const kt = data.identityFilterType?.toLowerCase()
  const sampling = (data.samplePartition ? Number(data.samplePartition) : 0) > 0
  const isPattern = !!fmt && fmt !== "unix_seconds" && fmt !== "unix_millis"
  const dedup = !!data.dedupOnOutput
  // 발행 봉투의 value — 출력 형태(5스테이지) list 결과. 윈도우의 dedup 상태를 그대로 반영.
  const listOut = dedup ? `["B","A"]` : `["A","B","A"]`
  const mapOut = `{"B":1721600120,"A":1721600300}`
  const envelope = (v: string) => `{
  "prefix": "u",
  "key": "a1b2c3d4",
  "field": "${data.featureName}",
  "value": "${v.replace(/"/g, '\\"')}",
}`
  const windowKey = (
    <>
      <Val col="key_path">{data.keyPath}</Val> : <Val col="feature_name">{data.featureName}</Val>
    </>
  )

  return (
    <SectionCard title="Pipeline" icon={InfoIcon}>
      <ol className="space-y-4">
        <Stage index={1} title="수집">
          <Facts
            items={[
              <>
                <Val col="input_broker">{data.inputBroker}</Val>의{" "}
                <Val col="input_topic">{data.inputTopic}</Val>을{" "}
                <Val col="consumer_group">{data.consumerGroup}</Val>으로 구독
              </>,
              <>
                <Val col="sample_partition">{data.samplePartition}</Val>은 아래와 같이 사용
              </>,
            ]}
          />
          <CondTable
            rows={[
              ["= 0", "토픽의 모든 파티션 구독", !sampling, GitBranchIcon],
              ["> 0", "앞쪽 그 수만큼 파티션만 소비", sampling, GitBranchIcon],
            ]}
          />
        </Stage>

        <Stage index={2} title="파싱, 추출">
          <Facts
            items={[
              <>
                <Val col="key_path">{data.keyPath}</Val>로 key,{" "}
                <Val col="value_path">{data.valuePath}</Val>로 value,{" "}
                <Val col="event_ts_path">{data.eventTsPath}</Val>로 이벤트 시각 추출
              </>,
              <>
                <Val col="event_ts_format">{data.eventTsFormat}</Val>은 아래와 같이 사용
              </>,
            ]}
          />
          <CondTable
            rows={[
              ["unix_seconds", "값을 그대로 초로 사용", fmt === "unix_seconds", ClockIcon],
              ["unix_millis", "1000으로 나눠 초로 변환", fmt === "unix_millis", ClockIcon],
              ["그 외", "지정한 날짜 패턴으로 KST(+09:00) 기준 파싱", isPattern, ClockIcon],
            ]}
          />
        </Stage>

        <Stage index={3} title="필터">
          <Facts
            items={[
              <>
                <Val col="key_path">{data.keyPath}</Val>가 조건에 맞지 않으면 버림
              </>,
              <>
                <Val col="identity_filter_type">{data.identityFilterType}</Val>은 아래와 같이 사용
              </>,
            ]}
          />
          <CondTable
            rows={[
              ["-", "필터 없이 모두 통과", !kt, FilterIcon],
              [
                "reaction",
                <>
                  <Val col="identity_fallback_path">{data.identityFallbackPath}</Val>가 true거나
                  키가 없으면 버림. 남은 이벤트는{" "}
                  <Val col="filter_flags_path">{data.filterFlagsPath}</Val>의 플래그가 통과 조건을
                  만족할 때만 집계 대상
                </>,
                kt === "reaction",
                FilterIcon,
              ],
              [
                "conversion",
                <>
                  <Val col="identity_fallback_path">{data.identityFallbackPath}</Val>가 true거나
                  전환 식별자가 없으면 버림. 남은 이벤트는{" "}
                  <Val col="filter_flags_path">{data.filterFlagsPath}</Val>의 플래그가 통과 조건을
                  만족할 때만 집계 대상
                </>,
                kt === "conversion",
                FilterIcon,
              ],
            ]}
          />
          <Facts
            items={[
              <>
                <Val col="event_ts_path">{data.eventTsPath}</Val>가 미래면 버림
              </>,
            ]}
          />
        </Stage>

        <Stage index={4} title="윈도우 집계">
          <Facts
            items={[
              <>
                {windowKey}마다 <Val col="value_path">{data.valuePath}</Val>의 값과{" "}
                <Val col="event_ts_path">{data.eventTsPath}</Val>의 시각을 담은 항목의 배열로 유지
              </>,
              <>
                새 이벤트 시각 기준{" "}
                <Val col="max_window_seconds">
                  {data.maxWindowSeconds != null ? `${data.maxWindowSeconds}s` : undefined}
                </Val>{" "}
                이내 &amp; 최신 <Val col="max_window_items">{data.maxWindowItems}</Val>개까지만 남김
              </>,
              <>
                값이 <span className="font-mono">A, B, A</span> 순으로 오면{" "}
                <Val col="dedup_on_output">
                  {data.dedupOnOutput == null ? undefined : String(data.dedupOnOutput)}
                </Val>
                에 따라 아래와 같이 저장
              </>,
            ]}
          />
          <CondTable
            rows={[
              [
                "false",
                <>
                  중복도 그대로 쌓음
                  <CodeBlock>{`[
  { "value": "A", "ts": 1721600000 },
  { "value": "B", "ts": 1721600120 },
  { "value": "A", "ts": 1721600300 },
]`}</CodeBlock>
                </>,
                !dedup,
                CircleIcon,
              ],
              [
                "true",
                <>
                  같은 값은 최신 ts 하나로 합침
                  <CodeBlock>{`[
  { "value": "B", "ts": 1721600120 },
  { "value": "A", "ts": 1721600300 },
]`}</CodeBlock>
                </>,
                dedup,
                CheckCircle2Icon,
              ],
            ]}
          />
        </Stage>

        <Stage index={5} title="출력 형태">
          <Facts
            items={[
              <>
                위 윈도우를 <Val col="aggregation_type">{data.aggregationType}</Val> 형태로 직렬화해
                출력
              </>,
            ]}
          />
          <CondTable
            rows={[
              [
                "list",
                <>
                  윈도우의 값들을 순서대로 배열로 출력
                  <CodeBlock>
                    {dedup
                      ? `[
  "B",
  "A",
]`
                      : `[
  "A",
  "B",
  "A",
]`}
                  </CodeBlock>
                </>,
                agg === "list",
                BracketsIcon,
              ],
              [
                "map",
                <>
                  값→최신 ts 맵으로 출력
                  <CodeBlock>{`{
  "B": 1721600120,
  "A": 1721600300,
}`}</CodeBlock>
                </>,
                agg === "map",
                BracesIcon,
              ],
            ]}
          />
        </Stage>

        <Stage index={6} title="발행">
          <Facts
            items={[
              <>
                아래 메시지를 <Val col="output_broker">{data.outputBroker}</Val>의{" "}
                <Val col="output_topic">{data.outputTopic}</Val>에 발행
              </>,
              <>value에는 위 출력 형태 결과가 문자열로 직렬화되어 담김</>,
            ]}
          />
          <CondTable
            rows={[
              [
                "list",
                <>
                  <CodeBlock>{envelope(listOut)}</CodeBlock>
                </>,
                agg === "list",
                BracketsIcon,
              ],
              [
                "map",
                <>
                  <CodeBlock>{envelope(mapOut)}</CodeBlock>
                </>,
                agg === "map",
                BracesIcon,
              ],
            ]}
          />
        </Stage>
      </ol>
    </SectionCard>
  )
}
