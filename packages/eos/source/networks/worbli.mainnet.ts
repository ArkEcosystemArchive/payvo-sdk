import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	coin: "Worbli",
	constants: {
		bech32: "WBI",
		slip44: 194,
	},
	currency: {
		decimals: 4,
		symbol: "WBI",
		ticker: "WBI",
	},
	explorer,
	featureFlags,
	hosts: [
		{
			host: "https://api.worbli.io",
			type: "full",
		},
		{
			host: "https://worbli-mainnet.eosblocksmith.io",
			type: "full",
		},
		{
			host: "https://worbli.bloks.io",
			type: "explorer",
		},
	],
	id: "worbli.mainnet",
	importMethods,
	meta: {
		// @TODO
		networkId: "73647cde120091e0a4b85bced2f3cfdb3041e266cbbe95cee59b73235a1b3b6f",
	},
	name: "Mainnet",
	transactions: {
		...transactions,
		fees: {
			ticker: "WBI",
			type: "free",
		},
	},
	type: "live",
};

export default network;
