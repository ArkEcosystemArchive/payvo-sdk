import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	coin: "BOSCore",
	constants: {
		bech32: "BOS",
		slip44: 194,
	},
	currency: {
		decimals: 4,
		symbol: "BOS",
		ticker: "BOS",
	},
	explorer,
	featureFlags,
	hosts: [
		{
			host: "https://api.boscore.io",
			type: "full",
		},
		{
			host: "https://bos.bloks.io",
			type: "explorer",
		},
	],
	id: "bos.mainnet",
	importMethods,
	meta: {
		// @TODO
		networkId: "d5a3d18fbb3c084e3b1f3fa98c21014b5f3db536cc15d08f9f6479517c6a3d86",
	},
	name: "Mainnet",
	transactions: {
		...transactions,
		fees: {
			ticker: "BOS",
			type: "free",
		},
	},
	type: "live",
};

export default network;
