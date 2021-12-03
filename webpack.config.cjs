const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin").default;

const common = {
	...require("./webpack.base"),
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
};

module.exports = [
	{
		...common,
		output: {
			clean: true,
			path: require("path").resolve(process.cwd(), "distribution"),
			filename: "index.esm.js",
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
			filename: "index.js",
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
