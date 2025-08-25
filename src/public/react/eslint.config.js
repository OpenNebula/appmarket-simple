import babelParser from "@babel/eslint-parser"
import globals from "globals"
import unusedImports from "eslint-plugin-unused-imports"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import jsxA11y from "eslint-plugin-jsx-a11y"
import importPlugin from "eslint-plugin-import"
import prettier from "eslint-plugin-prettier"
import js from "@eslint/js"

export default [
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,           // don’t require a babel config
        babelOptions: {
          presets: ["@babel/preset-react"], // enables JSX parsing
        },
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },        // explicitly enable JSX
      },
      globals: globals.browser,
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
      "unused-imports": unusedImports,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,

      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      "import/order": "off",
      "import/no-duplicates": "error",

      "no-unused-vars": "off",                  // disable ESLint core
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", args: "after-used", argsIgnorePattern: "^_" },
      ],

      "react/jsx-uses-vars": "warn", 

      "prettier/prettier": ["warn", { "semi": false }],
    },
  },
]
