import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
	coin: "Luna",
	constants: {
		slip44: 330,
	},
	currency: {
		decimals: 6,
		symbol: "SOJU",
		ticker: "SOJU",
	},
	explorer: {
		block: "columbus-4/blocks/{0}",
		transaction: "columbus-4/txs/{0}",
		wallet: "columbus-4/address/{0}",
	},
	featureFlags,
	hosts: [
		{
			host: "https://soju-lcd.terra.dev",
			type: "full",
		},
		{
			host: "https://finder.terra.money",
			type: "explorer",
		},
	],
	id: "luna.testnet",
	importMethods,
	name: "Testnet",
	transactions: {
		...transactions,
		fees: {
			ticker: "SOJU",
			type: "dynamic",
		},
	},
	type: "test",
};

export default network;
