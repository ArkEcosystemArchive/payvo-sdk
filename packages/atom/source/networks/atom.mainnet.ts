import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
	coin: "Cosmos",
	constants: {
		bech32: "cosmos",
		slip44: 118,
	},
	currency: {
		decimals: 6,
		symbol: "ATOM",
		ticker: "ATOM",
	},
	explorer,
	featureFlags,
	hosts: [
		{
			host: "https://node.atomscan.com",
			type: "full",
		},
		{
			host: "https://stake.id",
			type: "explorer",
		},
	],
	id: "atom.mainnet",
	importMethods,
	meta: {
		// @TODO
		networkId: "cosmoshub-3",
	},
	name: "Mainnet",
	transactions,
	type: "live",
};

export default network;
