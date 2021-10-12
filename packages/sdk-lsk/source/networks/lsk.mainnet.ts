import { Networks } from "@payvo/sdk";

import { assets, explorer, featureFlags, governance, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	id: "lsk.mainnet",
	type: "live",
	name: "Mainnet",
	coin: "Lisk",
	currency: {
		ticker: "LSK",
		symbol: "LSK",
		decimals: 8,
	},
	constants: {
		slip44: 134,
	},
	hosts: [
		{
			type: "full",
			host: "https://lsk-live.payvo.com/api/v2",
		},
		{
			type: "musig",
			host: "https://lsk-live-musig.payvo.com",
		},
		{
			type: "explorer",
			host: "https://lisk.observer",
		},
	],
	governance,
	transactions,
	importMethods,
	featureFlags,
	explorer,
	meta: {
		networkId: "4c09e6a781fc4c7bdb936ee815de8f94190f8a7519becd9de2081832be309a99",
		assets,
	},
};

export default network;
