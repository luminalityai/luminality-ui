import js from "@eslint/js"
import tseslint from "typescript-eslint"
import eslintReact from "@eslint-react/eslint-plugin"
import globals from "globals"

export default [
  { ignores: ["node_modules/", "dist/"] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // React configuration (eslint-react recommended preset)
  eslintReact.configs.recommended,

  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
    },
    rules: {
      // Disable eslint-react rules that flag existing patterns not caught by the
      // previous eslint-plugin-react config. These are valid React 19 migration
      // targets (forwardRef, createRef) and can be re-enabled in a follow-up.
      "@eslint-react/no-forward-ref": "off",
      "@eslint-react/no-create-ref": "off",
      "@eslint-react/no-array-index-key": "off",

      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
]
