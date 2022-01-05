import { Networks } from "@payvo/sdk";

import { featureFlags, importMethods, transactions } from "./shared.js";

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
	explorer: {
		block: "testnet/block/{0}",
		transaction: "testnet/tx/{0}",
		wallet: "testnet/address/{0}",
	},
	featureFlags,
	hosts: [
		{
			host: "https://btc-test.payvo.com/api",
			type: "full",
		},
		{
			host: "https://blockstream.info",
			type: "explorer",
		},
		{
			host: "https://btc-test-musig.payvo.com",
			type: "musig",
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
