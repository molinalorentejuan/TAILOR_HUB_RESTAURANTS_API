import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",

  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },

  testMatch: ["**/src/tests/**/*.ts"],

  moduleFileExtensions: ["ts", "js", "json"],

  roots: ["<rootDir>/src"],

  clearMocks: true,
};

export default config;