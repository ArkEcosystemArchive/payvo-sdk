const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin").default;

const base = {
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
		path: require("path").resolve(process.cwd(), "distribution"),
		filename: "index.js",
		libraryTarget: "module",
	},
};

const cjs = {
	...base,
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
	},
	output: {
		clean: true,
		path: require("path").resolve(process.cwd(), "distribution"),
		filename: "index.cjs.js",
		libraryTarget: "commonjs",
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
		path: require("path").resolve(process.cwd(), "distribution"),
		filename: "index.umd.js",
		libraryTarget: "umd",
	},
};

module.exports = [
	esm,
	// cjs,
	// umd,
];
