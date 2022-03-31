import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
	coin: "Solar",
	constants: {
		slip44: 3333,
	},
	currency: {
		decimals: 8,
		symbol: "SXP",
		ticker: "SXP",
	},
	explorer,
	featureFlags: {
		...featureFlags,
		Transaction: [
			"delegateRegistration",
			"delegateResignation",
			"estimateExpiration",
			"multiPayment",
			"secondSignature",
			"transfer",
			"vote",
		],
	},
	governance: {
		delegateCount: 53,
		method: "split",
		votesPerTransaction: 1,
		votesPerWallet: 1,
	},
	hosts: [
		{
			host: "https://sxp.mainnet.sh/api",
			type: "full",
		},
		{
			host: "https://explorer.solar.org",
			type: "explorer",
		},
	],
	id: "sxp.mainnet",
	importMethods,
	meta: {
		fastDelegateSync: true,
	},
	name: "Mainnet",
	transactions: {
		...transactions,
		fees: {
			ticker: "SXP",
			type: "dynamic",
		},
		multiPaymentRecipients: 128,
	},
	type: "live",
};

export default network;
