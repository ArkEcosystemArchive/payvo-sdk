import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
	coin: "Solana",
	constants: {
		slip44: 501,
	},
	currency: {
		decimals: 9,
		symbol: "SOL",
		ticker: "SOL",
	},
	explorer,
	featureFlags,
	hosts: [
		{
			host: "https://testnet.solana.com",
			type: "full",
		},
		{
			host: "https://explorer.solana.com",
			query: { cluster: "testnet" },
			type: "explorer",
		},
	],
	id: "sol.testnet",
	importMethods,
	name: "Testnet",
	transactions,
	type: "test",
};

export default network;
