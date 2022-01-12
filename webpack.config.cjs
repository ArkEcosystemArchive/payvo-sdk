const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin").default;

module.exports = {
	devtool: "source-map",
	entry: path.resolve(process.cwd(), "source/index.ts"),
	experiments: {
		asyncWebAssembly: false,
		outputModule: true,
		topLevelAwait: true,
	},
	mode: "production",
	module: {
		rules: [
			{
				exclude: /node_modules/,
				test: /\.tsx?$/,
				use: {
					loader: "babel-loader",
					options: {
						babelrc: false,
						plugins: ["@babel/plugin-transform-runtime", "@babel/plugin-proposal-class-properties"],
						presets: ["@babel/preset-env", "@babel/preset-typescript"],
					},
				},
			},
		],
	},
	optimization: {
		minimize: false, // process.env.NODE_ENV === "production",
		sideEffects: false,
	},
	output: {
		clean: true,
		filename: "index.js",
		library: {
			type: "module",
		},
		path: path.resolve(process.cwd(), "distribution/browser"),
	},
	performance: {
		hints: "warning",
		maxAssetSize: 10_485_760,
		maxEntrypointSize: 10_485_760,
	},
	plugins: [new NodePolyfillPlugin()],
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
		fallback: {
			fs: false,
		},
		plugins: [new ResolveTypeScriptPlugin()],
	},
	stats: {
		errorDetails: true,
	},
	target: ["web", "es2022"],
};
