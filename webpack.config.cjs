const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin").default;

const common = {
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
	mode: "production",
	entry: require("path").resolve(process.cwd(), "source/index.ts"),
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
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
		plugins: [new ResolveTypeScriptPlugin()],
		fallback: {
			fs: false,
		},
	},
};

module.exports = [
	{
		...common,
		output: {
			clean: true,
			path: require("path").resolve(process.cwd(), "distribution"),
			filename: "index.js",
			library: {
				type: "module",
			},
		},
	},
	{
		...common,
		output: {
			clean: true,
			path: require("path").resolve(process.cwd(), "distribution"),
			filename: "index.cjs.js",
			library: {
				type: "commonjs",
			},
		},
	},
	{
		...common,
		output: {
			clean: true,
			path: require("path").resolve(process.cwd(), "distribution"),
			filename: "index.umd.js",
			library: {
				type: "umd",
			},
		},
	}
]
