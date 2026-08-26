import {
  ActivityIcon,
  BoxesIcon,
  CalendarClockIcon,
  CheckIcon,
  HardDriveUploadIcon,
  MapPinIcon,
  type LucideIcon,
} from "lucide-react"
import { SectionCard } from "@/components/shared/detail-section"
import { DocTable, Facts, Figure, Stage } from "@/components/shared/explain"
import { GUIDE_SECTIONS, type GuideSectionId } from "@/components/guide/guide-sections"
import { GuideToc } from "@/components/guide/guide-toc"
import { LifecycleGraph } from "@/components/guide/lifecycle-graph"
import { PartitionFlowGraph } from "@/components/guide/partition-flow-graph"
import { ActionBadge } from "@/components/guide/action-badge"
import { EnumBadge } from "@/components/shared/enum-badges"
import { IconBadge } from "@/components/shared/icon-badge"
import { RoleBadge } from "@/components/shared/role-badge"
import { ApiDocsIconLink } from "@/components/shared/api-docs-icon-link"
import { apiDocsOperationHref } from "@/lib/api-docs"
import { navItem } from "@/lib/nav"
import featureStoreArchitecture from "@/public/guide/feature-store-architecture.webp"
import mlFeatureStore from "@/public/guide/ml-feature-store.webp"

// 처음 콘솔에 들어온 사용자를 위한 안내 문서. 톤과 렌더 프리미티브는 stream spec의 Pipeline
// 카드와 같다 — 줄글은 Facts 불릿, 값에 따라 갈리는 것만 CondTable, 데이터 형태는 CodeBlock.
// 설명의 근거는 코드/계약이며(파일 주석, enum SSOT, client 모듈), 여기서만 사는 사실은 두지 않는다.
// 화면 문구가 아니라 개념, 순서를 설명하는 자리라 본문은 한국어, 식별자는 원문 그대로 쓴다.
// "식별자는 원문"은 화면에 라벨로 뜨는 필드 전부를 뜻한다(entity_name, segment, owner,
// event_kind, cron_expression …). 한국어로 바꿔 부르면(구분값, 대상 종류 같은 코이닝) 읽은
// 문장을 화면에서 찾을 수 없다 — 이 콘솔은 모든 필드를 raw 식별자로 라벨링한다. 반대로 라벨이
// 없는 개념은 한국어로 쓴다(직전 반영본, 라이프사이클). 외래어는 음차한다(프리픽스).

// 카드 헤더 아이콘. Record<GuideSectionId, …>라 섹션을 추가하고 아이콘을 빼먹으면 타입 에러가 난다.
// overview는 시스템 자체를 소개하는 카드라 사이드바 헤더, ToC 레일과 같은 아이콘을 쓴다 —
// 세 자리가 같은 것을 가리키므로 아이콘도 같아야 한다.
// 세 이벤트 카드 모두 같은 활동 아이콘이다: 사이드바 · 목록 · 상세가 이미 그것으로 이벤트를 가리키므로
// 여기만 다른 글리프를 쓰면 같은 화면을 설명하는 카드가 그 화면과 달라 보인다.
const SECTION_ICONS: Record<GuideSectionId, LucideIcon> = {
  overview: ActivityIcon,
  "feature-view-lifecycle": BoxesIcon,
  "feature-view-event": ActivityIcon,
  "partition-events": ActivityIcon,
  "store-event": ActivityIcon,
  "event-schedule": CalendarClockIcon,
}

const SECTION_TITLES = new Map(GUIDE_SECTIONS.map((s) => [s.id, s.title]))

function GuideSection({ id, children }: { id: GuideSectionId; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6">
      <SectionCard title={SECTION_TITLES.get(id) ?? id} icon={SECTION_ICONS[id]}>
        {children}
      </SectionCard>
    </section>
  )
}

// 문장 안에서 서버 Redoc의 특정 오퍼레이션을 가리키는 참조. 사이드바 푸터의 API docs 항목과
// 같은 아이콘(ApiDocsIconLink)을 그대로 써서 두 자리가 같은 문서임을 눈으로 잇는다. META_SERVER_URL이
// 없으면 링크를 만들 수 없으므로 텍스트만 남긴다 — 없는 것을 숨기지 않고 문장은 그대로 읽히게.
function ApiDocsRef({ href }: { href?: string }) {
  if (!href) return <span>API docs</span>
  return <ApiDocsIconLink href={href} className="align-middle" />
}

// 문장 안에서 화면·카드를 가리키는 참조. 평문으로 두면 일반 명사로 읽히는데 화면에는 이름과
// 아이콘을 단 항목·카드로 떠 있으므로, 같은 아이콘의 뱃지로 세워 같은 것임을 잇는다(enum 값을
// EnumBadge로, 액션을 ActionBadge로 세우는 것과 같은 이유).
//
// 뱃지를 쓰는 대상은 화면에서 객체인 것뿐이다: enum 값, 액션, 화면·카드, role. 필드 이름은
// 평문이다 — 값이 붙는 자리에서만 Val("컬럼(값)") 뱃지가 되고, 이름만 가리킬 때 뱃지로 만들면
// 값과 구분이 사라진다. 인프라 이름(Redis, Hive)과 콘솔 밖의 주체도 평문이다.

// 사이드바 항목을 가리키는 참조. 이름·아이콘은 nav SSOT에서 끌어오므로 사이드바에서 이름을
// 고치면 문장도 따라온다.
function ScreenRef({ url }: { url: string }) {
  const item = navItem(url)
  return (
    <IconBadge icon={item.icon} className="align-middle">
      {item.title}
    </IconBadge>
  )
}

// 피처 뷰 상세 안의 Location 카드. nav에 없는(리소스가 아닌 위성 카드) 자리라 여기서 세운다 —
// 아이콘은 feature-view-detail의 SectionCard와 같은 것을 쓴다.
function LocationRef() {
  return (
    <IconBadge icon={MapPinIcon} className="align-middle">
      Location
    </IconBadge>
  )
}

export function GuideCards({ metaServerUrl }: { metaServerUrl?: string }) {
  const submitDocsHref = metaServerUrl
    ? apiDocsOperationHref(metaServerUrl, "client-workflow", "createSubmission")
    : undefined
  return (
    // 본문 + 우측 sticky ToC 레일. items-start가 있어야 aside가 형제 높이만큼 늘어나지 않고
    // sticky가 동작한다. 본문은 min-w-0 — 코드블록의 가로 스크롤이 레일을 밀지 않게.
    <div className="flex items-start gap-6">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <GuideSection id="overview">
          <ol className="space-y-4">
            {/* ①은 업계 일반의 피처 스토어 개념만 둔다 — 저장소 구성이나 실행 방식처럼
                구현마다 갈리는 것은 전부 ②로. 여기 문장은 이 시스템을 몰라도 읽힌다.
                정의 → 연결 → 하는 일 둘 순서로, 네 불릿 모두 명사형으로 끝낸다. */}
            <Stage index={1} title="Feature Store">
              {/* 그림을 불릿 아래가 아니라 오른쪽에 붙인다 — 세로 공간을 새로 쓰지 않고,
                  불릿이 말한 순서를 같은 높이에서 되짚게 된다. 좁은 화면에서는 1/4 폭이
                  읽히지 않으므로 그때만 아래로 쌓는다.
                  ①에 두는 이유는 그림이 업계 일반의 구성만 담고 있어서다 — Feature Store 의
                  구현(Hadoop, Redis, 피처 뷰 단위)은 ②의 몫이다. */}
              <div className="flex flex-col items-start gap-3 sm:flex-row">
                <div className="min-w-0 flex-1">
                  <Facts
                    items={[
                      "피처는 예측에 쓰이는 관측 속성 하나. 엔티티(유저, 상품 등)마다 값을 가지며, 머신러닝 모델이 학습과 추론에서 입력으로 사용",
                      "추론 시점에 매번 계산하면 지연과 비용이 증가, 미리 계산해 두면 갱신 관리가 필요",
                      "피처를 한 곳에서 정의하고 관리하는 것이 피처 스토어",
                      "원본 로그, 테이블에서 속성을 계산해 피처 형태로 적재",
                      "적재한 피처를 학습과 추론 양쪽에서 같은 정의로 꺼내 쓰게 제공",
                    ]}
                  />
                </div>
                <Figure
                  src={mlFeatureStore}
                  alt="피처 스토어의 일반 구성: 실시간 데이터와 배치 데이터가 원본으로 들어와 변환, 저장을 거치고, 제공 단계에서 온라인·오프라인 추론과 모델 학습 양쪽으로 같은 피처가 나간다"
                  caption="참조용 인용 도판 — 출처: ProjectPro"
                  className="shrink-0"
                />
              </div>
            </Stage>

            {/* ②의 앞 다섯 줄은 ①의 줄을 같은 순서로 받는다: 온라인 스토어 정체 → 적재 → 제공 →
                갱신 방식 → 저장소 구분. 마지막 줄은 그 대응 밖으로, 지금까지 말한 전부가 어떤
                단위로 다뤄지는지를 세워 다음 카드(Feature View Lifecycle)로 넘기는 다리다 — 피처 뷰는
                화면 어휘가 아니라 시스템 전반의 개념이라 개요에 들여도 된다(필드명 feature_view_name
                같은 화면 어휘는 여전히 여기 두지 않는다). Feast의 어휘를 그대로 쓴다 — feature view가
                피처 묶음의 단위이고, source는 그것이 읽는 상류 원본이다. */}
            <Stage index={2} title="Feature Store">
              {/* ①의 일반 구성이 Feature Store 에서 어떤 모듈로 놓이는지를 한 장으로 보여준다.
                  배치와 스트림 두 경로가 Meta Server 를 축으로 갈리고, 서빙까지 이어지는
                  모양이라 불릿의 순서와 같은 방향으로 읽힌다. */}
              <div className="flex flex-col items-start gap-3 sm:flex-row">
                <div className="min-w-0 flex-1">
                  <Facts
                    items={[
                      "ML 추론·학습이 쓰는 피처를 중앙에서 생성·적재·서빙하는 시스템",
                      "원천 로그와 상류 데이터를 가공해 피처를 생성하고 HDFS에 저장, Hive 테이블로 노출",
                      "파일 형태의 피처를 실시간 추론에서 조회할 수 있도록, 서빙 DB인 Redis에 반영",
                      "이전 반영분과 달라진 부분만 계산해 반영하여 Redis 쓰기를 최소화",
                      "피처를 만들고 서빙하는 데 필요한 선언을 묶은 단위가 피처 뷰. 등록, 검증, 반영, 폐기가 모두 피처 뷰 단위로 진행",
                    ]}
                  />
                </div>
                <Figure
                  src={featureStoreArchitecture}
                  alt="시스템 모듈 구성: 피처 원천은 배치 잡이, 스트림 원천은 스트림 잡이 읽는다. 두 잡 모두 컨트롤 플레인을 축으로 돈다. 배치 잡의 산출은 싱커가 스토리지에 적재하고, 서버가 그것을 읽어 추론기와 학습기에 제공한다"
                  className="shrink-0"
                />
              </div>
            </Stage>
          </ol>
        </GuideSection>

        <GuideSection id="feature-view-lifecycle">
          <ol className="space-y-4">
            {/* 시스템 개념을 말할 때 주체는 "시스템"이다 — 화면 조작을 가리킬 때만 화면 이름을 쓴다.
                순서: 이름 규칙 → 그 이름이 Redis에서 쓰이는 방식 → producer → 누가 무엇까지
                맡는지 → 권한. 피처 뷰가 무엇인지는 개요 카드 마지막 줄이 이미 세웠으므로 여기서 다시
                정의하지 않는다(같은 사실이 두 군데로 갈라진다). 어떤 필드에 무엇을 적는지는 등록
                폼의 필드별 툴팁이 맡는다.

                두 번째 줄의 근거는 서버다: fs_feature_view의 UNIQUE(feature_name, entity_name),
                그리고 서빙 쓰기가 HSET {prefix}:{키} {feature_name} 꼴이라는 것. 프리픽스는
                feature_name이 아니라 entity_name이 가리키는 엔티티의 것이므로(fs_entity의
                entity_prefix, 생성 후 불변) "두 값이 프리픽스를 만든다"고 쓰면 틀린다 — 둘이
                정하는 것은 키의 프리픽스와 그 키 안의 필드 이름이다. 프리픽스 값 자체(u, k 등)는
                열거하지 않는다: 그것은 Entities 화면이 보여주는 행의 값이다. */}
            <Stage index={1} title="피처 뷰 등록">
              <Facts
                items={[
                  "feature_name과 entity_name을 정하면 피처 뷰 이름이 결정. 같은 조합은 시스템에 하나만 존재",
                  "Redis에 올라갈 때 entity_name은 키의 프리픽스, feature_name은 그 키 안의 필드 이름",
                  <>
                    producer 필드는 무엇이 피처 뷰를 생성하는지를 나타냄. 시스템이 직접 만드는
                    피처는 <EnumBadge className="align-middle" set="producer" value="batch" />{" "}
                    <EnumBadge className="align-middle" set="producer" value="stream" />을 쓰고,
                    사용자가 직접 만든 피처는{" "}
                    <EnumBadge className="align-middle" set="producer" value="external" />
                  </>,
                  <>
                    <EnumBadge className="align-middle" set="producer" value="external" /> 피처 뷰는
                    피처 데이터를 직접 만들어 <LocationRef />만 작성
                  </>,
                  <>
                    피처 뷰의 owner가 권한 기준. <RoleBadge role="user" />는 자신이 owner인 피처
                    뷰와 그에 연결된 리소스만 수정 가능, <RoleBadge role="admin" />은 owner와
                    무관하게 전부 수정 가능
                  </>,
                ]}
              />
            </Stage>

            {/* 표는 도식이 말할 수 없는 축만 담는다 — 상태가 정하는 것(edit / submit /
                trigger)과 상태마다 다른 설명. 전이(어디서 어디로)는 전부 도식 소관이라 표에서 걷어냈다:
                두 표로 나눠 상태의 뜻과 액션이 하는 일을 각각 적던 때는 액션 다섯 행 중 셋이
                도식의 화살표를 문장으로 옮긴 것뿐이었다.
                근거는 서버의 상태기계 선언이다(
                permits) — 콘솔 액션 메뉴가 활성/비활성을 정하는 오퍼도 같은 선언에서 나온다.
                edit / submit 은 되는지 안 되는지뿐이라 체크 한 칸이고, trigger 는 어떤 것이
                되는지가 갈려 event kind 뱃지다. 그래서 폭을 열마다 직접 주고, 길이가 내용에 따라
                달라지는 trigger 와 설명만 남는 폭을 나눠 가진다. */}
            <Stage index={2} title="라이프사이클">
              <Facts
                items={[
                  <>
                    라이프사이클은 피처 뷰가{" "}
                    <EnumBadge className="align-middle" set="featureViewLifecycle" value="draft" />
                    에서 시작해{" "}
                    <EnumBadge
                      className="align-middle"
                      set="featureViewLifecycle"
                      value="retired"
                    />
                    로 끝나는 단계. 각 상태가 할 수 있는 일을 규정
                  </>,
                ]}
              />
              <LifecycleGraph />
              <DocTable
                head={["상태", "edit", "submit", "trigger", "설명"]}
                widths={["w-40", "w-16", "w-16", undefined, undefined]}
                rows={[
                  [
                    <EnumBadge key="s" set="featureViewLifecycle" value="draft" />,
                    <CheckIcon key="e" className="size-4" />,
                    "-",
                    <>
                      <EnumBadge
                        className="align-middle"
                        set="sourceOfferableEventKind"
                        value="profiling"
                      />
                      <EnumBadge
                        className="align-middle"
                        set="sourceOfferableEventKind"
                        value="ingestion"
                      />
                    </>,
                    "등록 직후 시작 지점",
                  ],
                  [
                    <EnumBadge key="s" set="featureViewLifecycle" value="active" />,
                    "-",
                    <CheckIcon key="b" className="size-4" />,
                    <>
                      <EnumBadge
                        className="align-middle"
                        set="sourceOfferableEventKind"
                        value="profiling"
                      />
                      <EnumBadge
                        className="align-middle"
                        set="sourceOfferableEventKind"
                        value="ingestion"
                      />
                    </>,
                    "진입할 때 서빙 세대가 새로 시작",
                  ],
                  [
                    <EnumBadge key="s" set="featureViewLifecycle" value="suspended" />,
                    "-",
                    "-",
                    "-",
                    "Redis는 그대로",
                  ],
                  [
                    <EnumBadge key="s" set="featureViewLifecycle" value="retired" />,
                    "-",
                    "-",
                    "-",
                    "Redis 정리 완료",
                  ],
                  [
                    <EnumBadge key="s" set="featureViewLifecycle" value="validation_failed" />,
                    "-",
                    "-",
                    "-",
                    "Validate 실패 기록",
                  ],
                  [
                    <EnumBadge key="s" set="featureViewLifecycle" value="retirement_failed" />,
                    "-",
                    "-",
                    "-",
                    "Redis 정리 여부가 확인되지 않은 상태",
                  ],
                ]}
              />
            </Stage>
          </ol>
        </GuideSection>

        <GuideSection id="feature-view-event">
          <ol className="space-y-4">
            <Stage index={1} title="이벤트 종류">
              <DocTable
                head={["이벤트", "설명", "결과"]}
                rows={[
                  [
                    <EnumBadge key="k" set="featureViewEventKind" value="profiling" />,
                    "피처 뷰의 필드별 통계를 계산",
                    <ScreenRef key="r" url="/feature-view-profiles" />,
                  ],
                  [
                    <EnumBadge key="k" set="featureViewEventKind" value="ingestion" />,
                    "원본을 읽어 스펙대로 피처를 생성",
                    "-",
                  ],
                ]}
              />
              {/* 표가 이 꼭지의 답이라 가장 위에 둔다. 리드와 문의는 표를 읽은 뒤의 보충이고,
                  문의는 표에 없는 작업이 필요할 때의 출구다. */}
              <Facts
                items={[
                  "피처 뷰 단위로 실행되는 잡은 종류별로 이벤트 행으로 기록",
                  "프로파일링은 파티션을 지정하면 그 파티션만, 지정하지 않으면 최신 파티션이 대상",
                  "표에 없는 작업이 필요하면 시스템 운영 담당에게 문의",
                ]}
              />
            </Stage>

            <Stage index={2} title="상태 진행">
              <Facts
                items={[
                  <>
                    상태는{" "}
                    <EnumBadge className="align-middle" set="eventStatus" value="submitted" />
                    에서 시작해{" "}
                    <EnumBadge
                      className="align-middle"
                      set="eventStatus"
                      value="succeeded"
                    /> 또는 <EnumBadge className="align-middle" set="eventStatus" value="failed" />
                    로 끝남
                  </>,
                  "이벤트 하나가 실행 한 번. 다시 실행하면 새 행으로 기록",
                ]}
              />
            </Stage>
          </ol>
        </GuideSection>

        <GuideSection id="partition-events">
          <ol className="space-y-4">
            <Stage index={1} title="이벤트 종류">
              {/* 피처 뷰 이벤트 카드와 같은 3열이다 — 파티션 이벤트 한 행이 품는 두 이벤트 종류를
                  같은 열 이름, 같은 뱃지로 세워, 두 카드가 같은 질문에 같은 모양으로 답하게 한다. */}
              <DocTable
                head={["이벤트", "설명", "결과"]}
                rows={[
                  [
                    <EnumBadge key="k" set="eventKind" value="materialization" />,
                    "Hive 파티션의 피처를 Redis에 반영",
                    <ScreenRef key="r" url="/partition-events" />,
                  ],
                  [
                    <EnumBadge key="k" set="eventKind" value="consistency" />,
                    "Redis에 반영된 값을 Hive 파티션과 대조",
                    <ScreenRef key="r" url="/partition-events" />,
                  ],
                ]}
              />
              <Facts
                items={[
                  <>
                    <EnumBadge className="align-middle" set="featureViewLifecycle" value="active" />
                    인 피처 뷰에서만 요청 가능
                  </>,
                  <>
                    dt, hr, min, segment로 파티션을 지정. segment은 <LocationRef />의
                    partition_columns에 선언한 값만 허용
                  </>,
                  "진행 중인 반영이 있거나 이미 반영된 파티션은 거절",
                  <>
                    자동화된 파이프라인에서 반영을 요청할 때는 화면의{" "}
                    <ActionBadge icon={HardDriveUploadIcon} text="Submit" /> 대신 API를 호출. 요청
                    형식은 <ApiDocsRef href={submitDocsHref} /> 참조
                  </>,
                ]}
              />
            </Stage>

            <Stage index={2} title="상태 진행">
              <PartitionFlowGraph />
              <Facts
                items={["이벤트 하나가 파티션 하나. 같은 피처 뷰의 다른 파티션은 각자 행으로 기록"]}
              />
            </Stage>
          </ol>
        </GuideSection>

        <GuideSection id="store-event">
          <ol className="space-y-4">
            {/* 피처 뷰 · 파티션 이벤트 카드와 같은 3열이다. 세 카드가 같은 질문(무엇이 도는가,
                무엇을 하는가, 무엇이 그것을 시작하는가)에 같은 모양으로 답해야 읽는 사람이
                카드마다 형식을 다시 배우지 않는다. */}
            <Stage index={1} title="이벤트 종류">
              <DocTable
                head={["이벤트", "설명", "결과"]}
                rows={[
                  [
                    <EnumBadge key="k" set="storeEventKind" value="store_profiling" />,
                    "온라인 스토어의 필드별 통계를 계산",
                    <ScreenRef key="r" url="/online-store-profiles" />,
                  ],
                ]}
              />
              <Facts
                items={[
                  "피처 뷰가 아니라 온라인 스토어가 대상",
                  "대상은 (온라인 스토어, 엔티티) 쌍",
                  "전수가 아니라 표본. 키 집합에서 뽑은 키만 스캔",
                ]}
              />
            </Stage>

            <Stage index={2} title="상태 진행">
              <Facts
                items={[
                  <>
                    상태는{" "}
                    <EnumBadge className="align-middle" set="eventStatus" value="submitted" />
                    에서 시작해{" "}
                    <EnumBadge
                      className="align-middle"
                      set="eventStatus"
                      value="succeeded"
                    /> 또는 <EnumBadge className="align-middle" set="eventStatus" value="failed" />
                    로 끝남
                  </>,
                  "이벤트 하나가 실행 한 번. 다시 실행하면 새 행으로 기록",
                ]}
              />
            </Stage>
          </ol>
        </GuideSection>

        {/* 예약은 이벤트를 남기는 실행이 아니라 그 실행을 부르는 설정이라, 꼭지가 등록과 자동 실행
            둘이다. 실행 기록은 kind에 따라 Feature View Event 또는 Store Event로 남으므로 그 카드로 넘긴다. cron을 실제로 돌리는
            주체는 서버 밖이라 이름을 적지 않는다. */}
        <GuideSection id="event-schedule">
          <ol className="space-y-4">
            <Stage index={1} title="예약 등록">
              <Facts
                items={[
                  <>
                    현재 예약할 수 있는 이벤트는{" "}
                    <EnumBadge
                      className="align-middle"
                      set="schedulableEventKind"
                      value="ingestion"
                    />{" "}
                    <EnumBadge
                      className="align-middle"
                      set="schedulableEventKind"
                      value="profiling"
                    />{" "}
                    <EnumBadge
                      className="align-middle"
                      set="schedulableEventKind"
                      value="store_profiling"
                    />
                  </>,
                  <>
                    <EnumBadge
                      className="align-middle"
                      set="schedulableEventKind"
                      value="ingestion"
                    />{" "}
                    <EnumBadge
                      className="align-middle"
                      set="schedulableEventKind"
                      value="profiling"
                    />{" "}
                    예약의 대상은 피처 뷰 하나,{" "}
                    <EnumBadge
                      className="align-middle"
                      set="schedulableEventKind"
                      value="store_profiling"
                    />{" "}
                    예약의 대상은 (온라인 스토어, 엔티티) 쌍
                  </>,
                  "대상과 이벤트가 같은 예약은 하나뿐",
                  <>
                    <EnumBadge
                      className="align-middle"
                      set="schedulableEventKind"
                      value="profiling"
                    />{" "}
                    예약은 파티션을 함께 지정할 수 있고, 지정하지 않으면 최신 파티션
                  </>,
                ]}
              />
            </Stage>

            <Stage index={2} title="자동 실행">
              <Facts
                items={[
                  <>
                    예약이 켜져 있으면 cron에 맞춰 요청되고, 실행 기록은 피처 뷰 범위 kind면{" "}
                    <ScreenRef url="/feature-view-events" />, store_profiling이면{" "}
                    <ScreenRef url="/online-store-events" />에 기록
                  </>,
                  <>
                    라이프사이클 전이와{" "}
                    <ActionBadge
                      className="align-middle"
                      icon={HardDriveUploadIcon}
                      text="Submit"
                    />
                    은 예약 대상이 아니고 액션으로만 요청
                  </>,
                ]}
              />
            </Stage>
          </ol>
        </GuideSection>
      </div>

      <GuideToc />
    </div>
  )
}
