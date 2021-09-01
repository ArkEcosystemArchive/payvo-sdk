module.exports = {
	bail: false,
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
