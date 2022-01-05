import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
	coin: "WAX",
	constants: {
		bech32: "WAX",
		slip44: 194,
	},
	currency: {
		decimals: 4,
		symbol: "WAX",
		ticker: "WAX",
	},
	explorer,
	featureFlags,
	hosts: [
		{
			host: "https://wax.eosphere.io",
			type: "full",
		},
		{
			host: "https://wax.bloks.io",
			type: "explorer",
		},
	],
	id: "wax.mainnet",
	importMethods,
	meta: {
		// @TODO
		networkId: "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4",
	},
	name: "Mainnet",
	transactions: {
		...transactions,
		fees: {
			ticker: "WAX",
			type: "free",
		},
	},
	type: "live",
};

export default network;
