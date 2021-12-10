import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  moduleNameMapper: {
    "@framework/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["./jest.setup.ts"],
};

export default config;
