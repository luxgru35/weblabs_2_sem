import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: {
        ...globals.browser, // Глобальные переменные для браузера
        ...globals.node, // Глобальные переменные для Node.js
      },
      parser: "@typescript-eslint/parser", // Парсер для TypeScript
    },
    plugins: {
      prettier: prettierPlugin, // Подключаем плагин Prettier
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off", // Отключаем правило
      "@typescript-eslint/no-unused-vars": ["error"], // Включаем правило
      "prettier/prettier": "error", // Правило для Prettier
    },
  },
  pluginJs.configs.recommended, // Базовая конфигурация ESLint
  ...tseslint.configs.recommended, // Рекомендуемая конфигурация для TypeScript
];