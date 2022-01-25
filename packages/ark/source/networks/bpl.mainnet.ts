import { Networks } from "@payvo/sdk";

import { featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
	coin: "Blockpool",
	constants: {
		slip44: 111,
	},
	currency: {
		decimals: 8,
		symbol: "β",
		ticker: "BPL",
	},
	explorer: {
		block: "#/block/{0}",
		transaction: "#/transaction/{0}",
		wallet: "#/wallets/{0}",
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
		delegateCount: 201,
		method: "split",
		votesPerTransaction: 1,
		votesPerWallet: 1,
	},
	hosts: [
		{
			host: "https://explorer.blockpool.io:19031/api",
			type: "full",
		},
		{
			host: "https://explorer.blockpool.io/",
			type: "explorer",
		},
	],
	id: "bpl.mainnet",
	importMethods,
	meta: {
		fastDelegateSync: true,
	},
	name: "Mainnet",
	transactions: {
		...transactions,
		fees: {
			ticker: "BPL",
			type: "dynamic",
		},
		multiPaymentRecipients: 128,
	},
	type: "live",
};

export default network;
