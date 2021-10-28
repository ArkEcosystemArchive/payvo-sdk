import { Networks } from "@payvo/sdk";

import { featureFlags, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	id: "xqr.testnet",
	type: "test",
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
			host: "https://explorer.sh/",
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
			"delegateResignation",
			"estimateExpiration",
			"multiPayment",
			"secondSignature",
			"transfer",
			"vote",
		],
	},
	explorer: {
		block: "qredit-testnet/block/{0}",
		transaction: "qredit-testnet/transaction/{0}",
		wallet: "qredit-testnet/wallet/{0}",
	},
	meta: {
		fastDelegateSync: true,
	},
};

export default network;
