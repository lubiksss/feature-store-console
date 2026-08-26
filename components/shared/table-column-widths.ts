export const SOURCE_NAME_COLUMN = "w-80"
export const UPDATED_AT_COLUMN = "w-60"
export const EVENT_ID_COLUMN = "w-28"

// 이름 칼럼은 카탈로그 종류와 무관하게 한 폭이다. feature_view_name 이든 store_name 이든 목록을
// 훑을 때 같은 자리에서 읽혀야 하고, 폭이 다르면 화면을 옮길 때마다 눈이 다시 자리를 찾는다.
export const STORE_NAME_COLUMN = SOURCE_NAME_COLUMN

const SOURCE_NAME_WIDTH_REM = 20
// Keep in sync with UPDATED_AT_COLUMN (w-60 = 15rem) — class + colgroup width must agree.
const UPDATED_AT_WIDTH_REM = 15
export const EVENT_ID_COLUMN_WIDTH_REM = 7

export const SOURCE_NAME_COLUMN_WIDTH = `${SOURCE_NAME_WIDTH_REM}rem`
export const STORE_NAME_COLUMN_WIDTH = `${SOURCE_NAME_WIDTH_REM}rem`
// 고정 이름 칼럼을 하나 더 갖는 표(store profile: field_name + store_name)가
// remainingColumnWidth 에 넘길 값.
export const SOURCE_NAME_COLUMN_WIDTH_REM = SOURCE_NAME_WIDTH_REM
export const UPDATED_AT_COLUMN_WIDTH = `${UPDATED_AT_WIDTH_REM}rem`
export const EVENT_ID_COLUMN_WIDTH = `${EVENT_ID_COLUMN_WIDTH_REM}rem`

// The two fixed columns present on every summary table (feature_view_name + created/updated_at).
const COMMON_COLUMNS_WIDTH_REM = SOURCE_NAME_WIDTH_REM + UPDATED_AT_WIDTH_REM

// Width for a flexible middle column: `ratio` of the space left after the fixed columns.
// Event tables carry an extra fixed event-id column, so pass its rem via `extraFixedRem`
// (EVENT_ID_COLUMN_WIDTH_REM) so the remaining space is computed correctly.
export function remainingColumnWidth(ratio: number, extraFixedRem = 0) {
  const percent = Number((ratio * 100).toFixed(4))
  const rem = Number(((COMMON_COLUMNS_WIDTH_REM + extraFixedRem) * ratio).toFixed(4))
  return `calc(${percent}% - ${rem}rem)`
}
