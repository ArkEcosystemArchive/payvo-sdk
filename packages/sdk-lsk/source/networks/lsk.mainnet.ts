import { Networks } from "@payvo/sdk";

import { featureFlags, importMethods, transactions } from "./shared";

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
			host: "https://lsk-live.payvo.com",
		},
		{
			type: "musig",
			host: "https://lsk-live-musig.payvo.com",
		},
		{
			type: "explorer",
			host: "https://liskscan.com/",
		},
	],
	governance: {
		delegateCount: 101,
		votesPerWallet: 101,
		votesPerTransaction: 33,
	},
	transactions,
	importMethods,
	featureFlags,
	explorer: {
		block: "block/{0}",
		transaction: "transaction/{0}",
		wallet: "account/{0}",
	},
	meta: {
		networkId: "01e47ba4e3e57981642150f4b45f64c2160c10bac9434339888210a4fa5df097",
	},
};

export default network;
