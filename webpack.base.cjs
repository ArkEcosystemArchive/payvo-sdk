module.exports = {
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
