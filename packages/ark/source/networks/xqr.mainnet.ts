import { Networks } from "@payvo/sdk";

import { featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
	coin: "Qredit",
	constants: {
		slip44: 111,
	},
	currency: {
		decimals: 8,
		symbol: "Q",
		ticker: "XQR",
	},
	explorer: {
		block: "xqr/block/{0}",
		transaction: "xqr/transaction/{0}",
		wallet: "xqr/wallet/{0}",
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
			host: "https://qredit.cloud/api",
			type: "full",
		},
		{
			host: "https://explorer.sh/",
			type: "explorer",
		},
	],
	id: "xqr.mainnet",
	importMethods,
	knownWallets: "https://raw.githubusercontent.com/qredit/common/master/mainnet/known-wallets-extended.json",
	meta: {
		fastDelegateSync: true,
	},
	name: "Mainnet",
	transactions: {
		...transactions,
		fees: {
			ticker: "XQR",
			type: "dynamic",
		},
		multiPaymentRecipients: 128,
	},
	type: "live",
};

export default network;
