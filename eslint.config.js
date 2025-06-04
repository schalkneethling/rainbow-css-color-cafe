import js from "@eslint/js";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier";
import html from "@html-eslint/eslint-plugin";

export default [
  js.configs.recommended,
  eslintConfigPrettier,
  {
    ...html.configs["flat/recommended"],
    files: ["**/*.html"],
    rules: {
      "@html-eslint/indent": "off",
      "@html-eslint/use-baseline": "warn",
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.nodeBuiltin,
      },
    },
    rules: {
      "no-console": ["error", { allow: ["clear", "info"] }],
    },
  },
];
