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
        ...globals.browser, 
        ...globals.node, 
      },
      parser: "@typescript-eslint/parser", 
    },
    plugins: {
      prettier: prettierPlugin, 
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
      "prettier/prettier": "error", 
    },
  },
  pluginJs.configs.recommended, 
  ...tseslint.configs.recommended, 
];