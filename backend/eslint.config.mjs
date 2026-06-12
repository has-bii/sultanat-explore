import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"

export default defineConfig(
  {
    ignores: ["node_modules/**", "src/generated/**", "dist/**"],
  },
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
)
