import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	id: "bind.testnet",
	type: "test",
	name: "Testnet",
	coin: "Compendia",
	currency: {
		ticker: "TBIND",
		symbol: "Tß",
		decimals: 8,
	},
	constants: {
		slip44: 1,
	},
	hosts: [
		{
			type: "full",
			host: "https://apis-testnet.compendia.org/api",
		},
		{
			type: "musig",
			host: "https://ark-test-musig.payvo.com",
		},
		{
			type: "explorer",
			host: "https://testnet.bindscan.io",
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
			type: "dynamic",
			ticker: "TBIND",
		},
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
