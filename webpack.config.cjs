const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin").default;

module.exports = {
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
		filename: "index.js",
		path: path.resolve(process.cwd(), "distribution"),
		library: {
			type: "module",
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
