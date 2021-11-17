import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
	coin: "TRON",
	constants: {
		slip44: 195,
	},
	currency: {
		decimals: 6,
		symbol: "TRX",
		ticker: "TRX",
	},
	explorer,
	featureFlags,
	hosts: [
		{
			host: "https://api.trongrid.io",
			type: "full",
		},
		{
			host: "https://tronscan.org/#",
			type: "explorer",
		},
	],
	id: "trx.mainnet",
	importMethods,
	name: "Mainnet",
	transactions,
	type: "live",
};

export default network;
