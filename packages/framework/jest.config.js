/** @type {import("@jest/types").Config.InitialOptions} */
const config = {
  preset: "ts-jest/presets/default-esm", // or other ESM presets
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    "@framework/(.*)$": "<rootDir>/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {},
  setupFilesAfterEnv: ["./jest.setup.ts"],
};

export default config;
