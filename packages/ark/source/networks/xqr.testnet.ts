import { Networks } from "@payvo/sdk";

import { featureFlags, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	coin: "Qredit",
	constants: {
		slip44: 1,
	},
	currency: {
		decimals: 8,
		symbol: "dQ",
		ticker: "dXQR",
	},
	explorer: {
		block: "qredit-testnet/block/{0}",
		transaction: "qredit-testnet/transaction/{0}",
		wallet: "qredit-testnet/wallet/{0}",
	},
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
		delegateCount: 51,
		method: "split",
		votesPerTransaction: 1,
		votesPerWallet: 1,
	},
	hosts: [
		{
			host: "https://qredit.dev/api",
			type: "full",
		},
		{
			host: "https://explorer.sh/",
			type: "explorer",
		},
	],
	id: "xqr.testnet",
	importMethods,
	meta: {
		fastDelegateSync: true,
	},
	name: "Testnet",
	transactions: {
		...transactions,
		fees: {
			ticker: "dXQR",
			type: "dynamic",
		},
		multiPaymentRecipients: 128,
	},
	type: "test",
};

export default network;