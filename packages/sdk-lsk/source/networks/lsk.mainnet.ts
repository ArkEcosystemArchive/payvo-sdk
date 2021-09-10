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
		networkId: "01e47ba4e3e57981642150f4b45f64c2160c10bac9434339888210a4fa5df097",
		assets,
	},
};

export default network;
