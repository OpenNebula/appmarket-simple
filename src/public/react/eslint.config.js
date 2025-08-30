const babelParser = require("@babel/eslint-parser")
const globals = require("globals")
const unusedImports = require("eslint-plugin-unused-imports")
const react = require("eslint-plugin-react")
const reactHooks = require("eslint-plugin-react-hooks")
const jsxA11y = require("eslint-plugin-jsx-a11y")
const importPlugin = require("eslint-plugin-import")
const prettier = require("eslint-plugin-prettier")
const js = require("@eslint/js")

module.exports = [
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

      "prettier/prettier": ["warn", { semi: false }],
    },
  },
]
