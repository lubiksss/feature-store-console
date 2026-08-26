// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook"

import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "storybook-static/**",
    "next-env.d.ts",
    // stories 파일 — tsc 제외와 동일하게 처리
    "**/*.stories.tsx",
    "**/*.stories.ts",
    // shadcn 설치 파일 — 직접 수정하지 않는다
    "hooks/use-mobile.ts",
  ]),
  ...storybook.configs["flat/recommended"],
])

export default eslintConfig
