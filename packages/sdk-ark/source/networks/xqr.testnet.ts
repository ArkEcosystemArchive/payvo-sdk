import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	id: "xqr.testnet",
	type: "live",
	name: "Testnet",
	coin: "Qredit",
	currency: {
		ticker: "dXQR",
		symbol: "dQ",
		decimals: 8,
	},
	constants: {
		slip44: 1,
	},
	hosts: [
		{
			type: "full",
			host: "https://qredit.dev/api",
		},
		{
			type: "explorer",
			host: "https://explorer.sh/qredit-testnet",
		},
	],
	governance: {
		delegateCount: 51,
		votesPerWallet: 1,
		votesPerTransaction: 1,
	},
	transactions: {
		...transactions,
		fees: {
			type: "dynamic",
			ticker: "dXQR",
		},
		multiPaymentRecipients: 128,
	},
	importMethods,
	featureFlags: {
		...featureFlags,
		Transaction: [
			"delegateRegistration",
			"secondSignature",
			"transfer",
			"vote",
		],
	},
	explorer,
	meta: {
		fastDelegateSync: true,
	},
};

export default network;
