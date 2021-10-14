import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	id: "btc.livenet",
	type: "live",
	name: "Livenet",
	coin: "Bitcoin",
	currency: {
		ticker: "BTC",
		symbol: "Ƀ",
		decimals: 8,
	},
	constants: {
		bip32: {
			private: 76066276,
			public: 76067358,
		},
		slip44: 0,
		wif: 128,
	},
	hosts: [
		{
			type: "full",
			host: "https://btc-live.payvo.com/api",
		},
		{
			type: "explorer",
			host: "https://blockstream.info",
		},
		{
			type: "musig",
			host: "https://btc-live-musig.payvo.com",
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
