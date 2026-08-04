import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { jsx: "react-jsx" } }],
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|scss)$": "identity-obj-proxy",
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "!lib/supabase/**",
    "!lib/stripe/**",
    "!lib/plan-quotas.ts",
    "!lib/resend.ts",
    "!lib/webhooks.ts",
    "!**/*.d.ts",
    "!**/index.ts",
  ],
  coverageThreshold: {
    global: { lines: 85, functions: 85, branches: 85, statements: 85 },
  },
  coverageReporters: ["text", "lcov", "html"],
  testMatch: ["**/__tests__/**/*.{ts,tsx}"],
};

export default config;
