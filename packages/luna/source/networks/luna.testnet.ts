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
	explorer,
	featureFlags,
	hosts: [
		{
			host: "https://soju-lcd.terra.dev",
			type: "full",
		},
		{
			host: "https://finder.terra.money/columbus-4",
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
