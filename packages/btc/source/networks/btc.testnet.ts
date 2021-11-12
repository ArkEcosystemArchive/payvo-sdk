import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	coin: "Bitcoin",
	constants: {
		bip32: {
			private: 70_615_956,
			public: 70_617_039,
		},
		slip44: 1,
		wif: 239,
	},
	currency: {
		decimals: 8,
		symbol: "Ƀ",
		ticker: "BTC",
	},
	explorer,
	featureFlags,
	hosts: [
		{
			host: "https://btc-test.payvo.com/api",
			type: "full",
		},
		{
			host: "https://blockstream.info/testnet",
			type: "explorer",
		},
	],
	id: "btc.testnet",
	importMethods,
	meta: {
		extendedPublicKey: true,
	},
	name: "Testnet",
	transactions,
	type: "test",
};

export default network;
