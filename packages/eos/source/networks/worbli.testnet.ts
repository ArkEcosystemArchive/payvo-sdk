import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
	coin: "Worbli",
	constants: {
		bech32: "WBI",
		slip44: 194,
	},
	currency: {
		decimals: 4,
		symbol: "WBI",
		ticker: "WBI",
	},
	explorer,
	featureFlags,
	hosts: [
		{
			host: "https://worbli-testnet.eosblocksmith.io",
			type: "full",
		},
		{
			host: "https://worbli-testnet.eosphere.io",
			type: "full",
		},
		{
			host: "https://worbli-test.bloks.io",
			type: "explorer",
		},
	],
	id: "worbli.testnet",
	importMethods,
	meta: {
		// @TODO
		networkId: "0d1ba39b44e70e9c36b74d60677ef3b686bd4347ade092b816886a6a35ddb6f7",
	},
	name: "Testnet",
	transactions: {
		...transactions,
		fees: {
			ticker: "WBI",
			type: "free",
		},
	},
	type: "test",
};

export default network;
