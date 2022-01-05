import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
	coin: "Nano",
	constants: {
		slip44: 165,
	},
	currency: {
		decimals: 30,
		symbol: "NANO",
		ticker: "NANO",
	},
	explorer,
	featureFlags,
	hosts: [
		{
			host: "https://proxy.nanos.cc/proxy",
			type: "full",
		},
		{
			host: "https://nanocrawler.cc",
			type: "explorer",
		},
	],
	id: "nano.mainnet",
	importMethods,
	name: "Mainnet",
	transactions,
	type: "live",
};

export default network;
