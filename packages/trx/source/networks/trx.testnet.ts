import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared";

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
			host: "https://api.shasta.trongrid.io",
			type: "full",
		},
		{
			host: "https://shasta.tronscan.org/#",
			type: "explorer",
		},
	],
	id: "trx.testnet",
	importMethods,
	name: "Testnet",
	transactions,
	type: "test",
};

export default network;
