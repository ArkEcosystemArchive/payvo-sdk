const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin").default;

const package = path.resolve(process.cwd(), "source/index.ts")

const common = {
	target: ["web", "es2022"],
	mode: "production",
	entry: path.resolve(process.cwd(), "source/index.ts"),
	devtool: "source-map",
	experiments: {
		asyncWebAssembly: false,
		outputModule: true,
		topLevelAwait: true,
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	plugins: [new NodePolyfillPlugin()],
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
		plugins: [new ResolveTypeScriptPlugin()],
		fallback: {
			fs: false,
		},
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

const commonOutput = {
	clean: true,
	path: path.resolve(process.cwd(), "distribution"),
};

module.exports = [
	{
		...common,
		experiments: {
			outputModule: true,
		},
		output: {
			...commonOutput,
			filename: "index.esm.js",
			library: {
				type: "module",
			},
		},
	},
	{
		...common,
		output: {
			...commonOutput,
			filename: "index.umd.js",
			library: {
				type: "umd",
			},
		},
	},
	{
		...common,
		output: {
			...commonOutput,
			filename: "index.js",
			library: {
				type: "commonjs",
			},
		},
	},
];

module.exports.parallelism = 4;
