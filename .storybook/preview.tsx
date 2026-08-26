import React from "react"
import type { Preview } from "@storybook/nextjs-vite"
import "../app/globals.css"

const withFullHeight = (
  Story: React.ComponentType,
  context: { parameters: { layout?: string } },
) => {
  const root = document.getElementById("storybook-root")
  if (context.parameters.layout === "fullscreen") {
    document.documentElement.style.height = "100%"
    document.body.style.height = "100%"
    document.body.style.margin = "0"
    if (root) {
      root.style.height = "100%"
      root.style.display = "flex"
      root.style.flexDirection = "column"
    }
  } else {
    document.documentElement.style.height = ""
    document.body.style.height = ""
    if (root) {
      root.style.height = ""
      root.style.display = ""
      root.style.flexDirection = ""
    }
  }
  return <Story />
}

const preview: Preview = {
  decorators: [withFullHeight],
  parameters: {
    nextjs: {
      appDirectory: true,
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
}

export default preview
