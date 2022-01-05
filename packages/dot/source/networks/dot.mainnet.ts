import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
	coin: "Polkadot",
	constants: {
		slip44: 354,
	},
	currency: {
		decimals: 10,
		symbol: "DOT",
		ticker: "DOT",
	},
	explorer,
	featureFlags,
	hosts: [
		{
			host: "https://rpc.polkadot.io/",
			type: "full",
		},
		{
			host: "https://polkascan.io/polkadot",
			type: "explorer",
		},
	],
	id: "dot.mainnet",
	importMethods,
	meta: {
		networkId: "0",
	},
	name: "Mainnet",
	transactions,
	type: "live",
};

export default network;
