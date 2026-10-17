import { createDefaultEsmPreset } from "ts-jest";

export default {
    ...createDefaultEsmPreset({ tsconfig: "tsconfig.jest.json" }),
    testEnvironment: "node",
    testMatch: ["<rootDir>/testing/**/*.test.ts"]
};
