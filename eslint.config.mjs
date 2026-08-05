import nextPlugin from "@next/eslint-plugin-next"

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [".next/*", "node_modules/*", "out/*", "public/*"],
  },
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@typescript-eslint/no-unused-vars": "off",
      "react/display-name": "off",
      "react/no-unescaped-entities": "off",
    },
  },
]

export default eslintConfig
