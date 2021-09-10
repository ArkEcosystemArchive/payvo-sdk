import { Networks } from "@payvo/sdk";

import { assets, explorer, featureFlags, governance, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	id: "lsk.testnet",
	type: "test",
	name: "Testnet",
	coin: "Lisk",
	currency: {
		ticker: "LSK",
		symbol: "LSK",
		decimals: 8,
	},
	constants: {
		slip44: 134,
	},
	hosts: [
		{
			type: "full",
			host: "https://lsk-test.payvo.com/api/v2",
		},
		{
			type: "musig",
			host: "https://lsk-test-musig.payvo.com",
		},
		{
			type: "explorer",
			host: "https://testnet.lisk.observer",
		},
	],
	governance,
	transactions,
	importMethods,
	featureFlags,
	explorer,
	meta: {
		networkId: "15f0dacc1060e91818224a94286b13aa04279c640bd5d6f193182031d133df7c",
		assets,
	},
};

export default network;
