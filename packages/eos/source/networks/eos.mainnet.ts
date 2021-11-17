import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
	coin: "EOS",
	constants: {
		bech32: "EOS",
		slip44: 194,
	},
	currency: {
		decimals: 4,
		symbol: "EOS",
		ticker: "EOS",
	},
	explorer,
	featureFlags,
	hosts: [
		{
			host: "https://eos.greymass.com",
			type: "full",
		},
		{
			host: "https://api.eosn.io",
			type: "full",
		},
		{
			host: "https://mainnet.genereos.io",
			type: "full",
		},
		{
			host: "https://eos.bloks.io",
			type: "explorer",
		},
	],
	id: "eos.mainnet",
	importMethods,
	meta: {
		// @TODO
		networkId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
	},
	name: "Mainnet",
	transactions,
	type: "live",
};

export default network;
