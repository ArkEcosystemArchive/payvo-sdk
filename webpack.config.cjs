const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin").default;

module.exports = {
	...require("./webpack.base.cjs"),
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
		filename: "index.esm.js",
		path: require("path").resolve(process.cwd(), "distribution"),
		library: {
			type: "module",
		},
	},
};
