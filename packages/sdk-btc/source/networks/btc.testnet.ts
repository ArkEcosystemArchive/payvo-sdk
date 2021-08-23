import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	id: "btc.testnet",
	type: "test",
	name: "Testnet",
	coin: "Bitcoin",
	currency: {
		ticker: "BTC",
		symbol: "Ƀ",
		decimals: 8,
	},
	constants: {
		bip32: {
			private: 70615956,
			public: 70617039,
		},
		slip44: 1,
		wif: 239,
	},
	hosts: [
		{
			type: "full",
			host: "https://btc-test.payvo.com/api",
		},
		{
			type: "explorer",
			host: "https://blockstream.info/testnet",
		},
	],
	transactions,
	importMethods,
	featureFlags,
	explorer,
	meta: {
		extendedPublicKey: true,
	},
};

export default network;
