import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	coin: "Bitcoin",
	constants: {
		bip32: {
			private: 76_066_276,
			public: 76_067_358,
		},
		slip44: 0,
		wif: 128,
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
			host: "https://btc-live.payvo.com/api",
			type: "full",
		},
		{
			host: "https://blockstream.info",
			type: "explorer",
		},
		{
			host: "https://btc-live-musig.payvo.com",
			type: "musig",
		},
	],
	id: "btc.livenet",
	importMethods,
	meta: {
		extendedPublicKey: true,
	},
	name: "Livenet",
	transactions,
	type: "live",
};

export default network;
