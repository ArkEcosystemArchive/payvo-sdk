const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin").default;
const path = require("node:path");

const base = {
	mode: "production",
	entry: path.resolve(process.cwd(), "source/index.ts"),
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	optimization: {
		minimize: process.env.NODE_ENV === "production",
		sideEffects: false,
	},
	performance: {
		hints: "warning",
		maxAssetSize: 10485760,
		maxEntrypointSize: 10485760,
	},
	stats: {
		errorDetails: true,
	},
};

const esm = {
	...base,
	target: ["web", "es2022"],
	devtool: "source-map",
	experiments: {
		asyncWebAssembly: false,
		outputModule: true,
		topLevelAwait: true,
	},
	plugins: [
		new NodePolyfillPlugin(),
	],
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
		plugins: [new ResolveTypeScriptPlugin()],
		fallback: {
			fs: false,
		},
	},
	output: {
		clean: true,
		path: path.resolve(process.cwd(), "distribution"),
		filename: "index.js",
		library: { type: "module" },
	},
};

const cjs = {
	...base,
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
				exclude: /node_modules/,
				options: {
					compilerOptions: {
						module: "commonjs",
						target: "esnext"
					}
				},
			},
		],
	},
	target: ["node16", "es2022"],
	devtool: "source-map",
	experiments: {
		asyncWebAssembly: false,
		outputModule: true,
		topLevelAwait: true,
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
		plugins: [new ResolveTypeScriptPlugin()],
		alias: {
			"@payvo/sdk-test": path.resolve("../test"),
			"@payvo/sdk-helpers": path.resolve("../helpers"),
			"@payvo/sdk-intl": path.resolve("../intl"),
			"@payvo/sdk-cryptography": path.resolve("../cryptography"),
			"@payvo/sdk": path.resolve("../sdk"),
			"@payvo/sdk-news": path.resolve("../news"),
			"@payvo/sdk-http-fetch": path.resolve("../http-fetch"),
			"@payvo/sdk-markets": path.resolve("../markets"),
		},
	},
	output: {
		clean: true,
		path: path.resolve(process.cwd(), "distribution"),
		filename: "index.cjs.js",
		library: { type: "commonjs" },
	},
};

const umd = {
	...base,
	target: ["web", "es2022"],
	devtool: "source-map",
	experiments: {
		asyncWebAssembly: false,
		outputModule: true,
		topLevelAwait: true,
	},
	plugins: [
		new NodePolyfillPlugin(),
	],
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
		plugins: [new ResolveTypeScriptPlugin()],
		fallback: {
			fs: false,
		},
	},
	output: {
		clean: true,
		path: path.resolve(process.cwd(), "distribution"),
		filename: "index.umd.js",
		library: { type: "umd" },
	},
};

module.exports = [
	esm,
	// cjs,
	// umd,
];
