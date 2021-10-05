import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	id: "bind.mainnet",
	type: "live",
	name: "Mainnet",
	coin: "Compendia",
	currency: {
		ticker: "BIND",
		symbol: "ß",
		decimals: 8,
	},
	constants: {
		slip44: 543,
	},
	hosts: [
		{
			type: "full",
			host: "https://apis.compendia.org/api",
		},
		{
			type: "musig",
			host: "https://bind-live-musig.payvo.com",
		},
		{
			type: "explorer",
			host: "https://bindscan.io",
		},
	],
	governance: {
		delegateCount: 47,
		votesPerWallet: 1,
		votesPerTransaction: 1,
	},
	transactions: {
		...transactions,
		fees: {
			type: "static",
			ticker: "BIND",
		},
		multiPaymentRecipients: 128,
	},
	importMethods,
	featureFlags: {
		...featureFlags,
		Transaction: [
			"delegateRegistration",
			"delegateResignation",
			"estimateExpiration",
			"multiPayment.musig",
			"multiPayment",
			"multiSignature.musig",
			"multiSignature",
			"secondSignature",
			"transfer.musig",
			"transfer",
			"vote.musig",
			"vote",
		],
	},
	explorer,
	meta: {
		fastDelegateSync: true,
	},
};

export default network;
