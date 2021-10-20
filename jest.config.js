module.exports = {
	bail: false,
	collectCoverage: false,
	collectCoverageFrom: [
		"source/**/*.ts",
		"!source/**/index.ts",
		"!**/node_modules/**",
		"!source/(container|contracts|manifest|schema|service-provider|dto|repositories).ts",
		"!source/coin.provider.ts",
		"!source/coin.schema.ts",
		"!source/coin.services.ts",
	],
	coverageDirectory: "<rootDir>/.coverage",
	coverageReporters: ["json", "lcov", "text", "clover", "html"],
	// coverageThreshold: {
	// 	global: {
	// 		branches: 100,
	// 		functions: 100,
	// 		lines: 100,
	// 		statements: 100,
	// 	},
	// },
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	setupFilesAfterEnv: ["jest-extended", "jest-localstorage-mock"],
	testEnvironment: "node",
	testMatch: ["**/*.test.ts"],
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	verbose: true,
	preset: "ts-jest/presets/default-esm",
	globals: {
		"ts-jest": {
			useESM: true,
		},
	},
	extensionsToTreatAsEsm: [".ts"],
};
