import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // React Three Fiber scenes mutate three.js objects imperatively (useFrame,
    // effects) — the documented R3F pattern. The React Compiler is not enabled
    // in this project, so its immutability rule does not apply to these files.
    files: ["src/components/three/**/*.{ts,tsx}"],
    rules: { "react-hooks/immutability": "off" },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "public/**",
    "docs/**",
    "assets-src/**",
    "test-results/**",
    "playwright-report/**",
  ]),
]);
