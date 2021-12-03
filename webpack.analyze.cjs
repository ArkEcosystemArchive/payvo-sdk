const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
	...require("./webpack.config.cjs"),
	plugins: [
		new BundleAnalyzerPlugin(),
		new NodePolyfillPlugin(),
	],
};
