import commonjs from "@rollup/plugin-commonjs";
import inject from "@rollup/plugin-inject";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import ts from "rollup-plugin-ts";
import builtinModules from "builtin-modules";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { terser } from "rollup-plugin-terser";

const pkg = require(`${process.cwd()}/package.json`);

const dependencies = Object.keys(pkg.dependencies);
const allModules = [...dependencies, ...builtinModules];

const polyfillsPlugins = [
	inject({
		modules: {
			BigInt: require.resolve("big-integer"),
			process: "process-es6",
			Buffer: ["buffer-es6", "Buffer"],
		},
		include: undefined,
	}),
	{
		...nodePolyfills({
			// Pass in null to transform all files.
			include: null,
			sourceMap: true
		}),
		transform: null,
	},
];

const baseConfig = {
	onwarn(warning, warn) {
		if (warning.code === "CIRCULAR_DEPENDENCY") {
			return;
		}

		warn(warning);
	},
};

/** Compatible code for bundlers (webpack, rollup) */
const moduleConfig = {
	...baseConfig,
	input: "source/index.ts",
	output: {
		file: pkg.module,
		format: "esm",
	},
	plugins: [
		json(),
		commonjs({ include: /node_modules/ }),
		ts({
			transpileOnly: true,
			tsconfig: {
				target: "es2022",
				module: "esnext",
				allowSyntheticDefaultImports: true,
				resolveJsonModule: true,
			},
		}),
	],
	external: allModules,
};

/** Full version with all polyfills and dependencies attached to the file */
const browserConfig = {
	...baseConfig,
	input: "source/index.ts",
	output: [
		{
			file: pkg.unpkg,
			format: "esm",
			plugins: [terser()],
		},
		{
			file: pkg.browser,
			format: "esm",
		},
	],
	external: [...Object.keys(pkg.dependencies || {})],
	plugins: [
		json(),
		resolve({ preferBuiltins: false, browser: true }),
		commonjs({ include: /node_modules/ }),
		ts({
			transpiler: "babel",
			transpileOnly: true,
			tsconfig: {
				declaration: false,
			},
			babelConfig: {
				presets: [["@babel/preset-env", { loose: false, modules: false, targets: { esmodules: true } }]],
			},
		}),
		...polyfillsPlugins,
	],
};

/** Universal code to be used as a standalone package */
const umdConfig = {
	...baseConfig,
	input: "source/index.ts",
	output: {
		file: pkg["umd:main"],
		format: "iife",
		name: "sdk",
	},
	plugins: [
		json(),
		resolve({ preferBuiltins: false, browser: true }),
		commonjs({ include: /node_modules/ }),
		ts({
			transpiler: "babel",
			transpileOnly: true,
			tsconfig: {
				declaration: false,
			},
			babelConfig: {
				presets: [
					[
						"@babel/preset-env",
						{ loose: false, modules: false, targets: { browsers: [">0.25%", "not op_mini all"] } },
					],
				],
			},
		}),
		...polyfillsPlugins,
	],
};

export default [moduleConfig, browserConfig, umdConfig];
