const vitest = require("eslint-plugin-vitest");

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        paths: ["src"],
      },
    },
    react: { version: "18.2" },
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:vitest/recommended",
    "plugin:testing-library/react",
    "plugin:@tanstack/eslint-plugin-query/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["react-refresh", "simple-import-sort"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/prop-types": "off",
    "react/display-name": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "import/prefer-default-export": 0,
    "import/no-anonymous-default-export": 0,
    "simple-import-sort/imports": [
      "warn",
      {
        groups: [["^\\u0000"], ["^@?\\w"], ["^@src", "^@shared"], ["^\\."]],
      },
    ],
    "simple-import-sort/exports": "warn",
    "sort-imports": "off",
    "import/order": "off",
    "vitest/expect-expect": "off",
  },
  globals: {
    ...vitest.environments.env.globals,
  },
};
