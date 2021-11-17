import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
	coin: "Stellar",
	constants: {
		slip44: 148,
	},
	currency: {
		decimals: 7,
		symbol: "XLM",
		ticker: "XLM",
	},
	explorer,
	featureFlags,
	hosts: [
		{
			host: "https://horizon-testnet.stellar.org",
			type: "full",
		},
		{
			host: "https://testnet.steexp.com",
			type: "explorer",
		},
	],
	id: "xlm.testnet",
	importMethods,
	name: "Testnet",
	transactions,
	type: "test",
};

export default network;
