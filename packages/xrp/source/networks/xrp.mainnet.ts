import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	coin: "XRP",
	constants: {
		slip44: 144,
	},
	currency: {
		decimals: 6,
		symbol: "XRP",
		ticker: "XRP",
	},
	explorer,
	featureFlags,
	hosts: [
		{
			host: "https://s2.ripple.com:51234/",
			type: "full",
		},
		{
			host: "https://livenet.xrpl.org",
			type: "explorer",
		},
	],
	id: "xrp.mainnet",
	importMethods,
	name: "Mainnet",
	transactions,
	type: "live",
};

export default network;
