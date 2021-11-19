module.exports = {
  testEnvironment: "jsdom",
  coverageDirectory: "./coverage/",
  coverageReporters: ["json"],
  collectCoverage: true,
  collectCoverageFrom: ["packages/**/*.{ts,tsx}","!packages/**/*.stories.{ts,tsx}"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  extensionsToTreatAsEsm: [".ts"],
  modulePathIgnorePatterns: [
    "<rootDir>/examples",
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
}