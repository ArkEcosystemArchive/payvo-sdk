import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
	coin: "Binance",
	constants: {
		slip44: 714,
	},
	currency: {
		decimals: 18,
		symbol: "BNB",
		ticker: "BNB",
	},
	explorer,
	featureFlags,
	hosts: [
		{
			host: "https://bsc-dataseed1.binance.org:443",
			type: "full",
		},
		{
			host: "https://binance.mintscan.io",
			type: "explorer",
		},
	],
	id: "bnb.mainnet",
	importMethods,
	name: "Mainnet",
	transactions,
	type: "live",
};

export default network;
