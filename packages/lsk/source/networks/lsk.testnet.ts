import { Networks } from "@payvo/sdk";

import { assets, explorer, featureFlags, governance, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
	coin: "Lisk",
	constants: {
		slip44: 134,
	},
	currency: {
		decimals: 8,
		symbol: "LSK",
		ticker: "LSK",
	},
	explorer,
	featureFlags,
	governance,
	hosts: [
		{
			host: "https://lsk-test.payvo.com/api/v2",
			type: "full",
		},
		{
			host: "https://lsk-test-musig.payvo.com",
			type: "musig",
		},
		{
			host: "https://testnet.lisk.observer",
			type: "explorer",
		},
	],
	id: "lsk.testnet",
	importMethods,
	meta: {
		assets,
		networkId: "15f0dacc1060e91818224a94286b13aa04279c640bd5d6f193182031d133df7c",
	},
	name: "Testnet",
	transactions,
	type: "test",
};

export default network;
