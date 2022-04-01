import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
	coin: "Solar",
	constants: {
		slip44: 1,
	},
	currency: {
		decimals: 8,
		symbol: "tSXP",
		ticker: "tSXP",
	},
	explorer,
	featureFlags: {
		...featureFlags,
		Transaction: [
			"delegateRegistration",
			"delegateResignation",
			"estimateExpiration",
			"ipfs",
			"multiPayment",
			"secondSignature",
			"transfer",
			"vote",
		],
	},
	governance: {
		delegateCount: 53,
		votesPerTransaction: 1,
		votesPerWallet: 1,
	},
	hosts: [
		{
			host: "https://sxp1.testnet.sh/api",
			type: "full",
		},
		{
			host: "https://texplorer.solar.org",
			type: "explorer",
		},
	],
	id: "sxp.testnet",
	importMethods,
	meta: {
		fastDelegateSync: true,
	},
	name: "Testnet",
	transactions: {
		...transactions,
		fees: {
			ticker: "tSXP",
			type: "dynamic",
		},
		multiPaymentRecipients: 256,
	},
	type: "test",
};

export default network;
