import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {languageOptions: {
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
      },
      globals: globals.browser,/* parserOptions: { project: "./tsconfig.json" }*/
  }},
  {files: ["**!/!*.{ts,svelte}"]},
  {ignores: ["dist/**/*", "node_modules/**/*", "eslint.config.js", "assets", "src/api/**/*", "patch"]},
  {rules: {
      "semi": "error",
      "grouped-accessor-pairs": "error",
      "quotes": ["error", "double"],
    }
  }
);
