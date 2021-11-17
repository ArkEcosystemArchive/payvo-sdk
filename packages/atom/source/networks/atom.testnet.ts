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
		symbol: "MUON",
		ticker: "MUON",
	},
	explorer,
	featureFlags,
	hosts: [
		{
			host: "https://stargate.cosmos.network",
			type: "full",
		},
		{
			host: "https://gaia.stake.id",
			type: "explorer",
		},
	],
	id: "atom.testnet",
	importMethods,
	meta: {
		// @TODO
		networkId: "gaia-13007",
	},
	name: "Testnet",
	transactions: {
		...transactions,
		fees: {
			ticker: "MUON",
			type: "static",
		},
	},
	type: "test",
};

export default network;
