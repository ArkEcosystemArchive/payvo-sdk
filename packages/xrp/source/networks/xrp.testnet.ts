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
			host: "https://s.altnet.rippletest.net:51234/",
			type: "full",
		},
		{
			host: "https://testnet.xrpl.org",
			type: "explorer",
		},
	],
	id: "xrp.testnet",
	importMethods,
	name: "Testnet",
	transactions,
	type: "test",
};

export default network;
