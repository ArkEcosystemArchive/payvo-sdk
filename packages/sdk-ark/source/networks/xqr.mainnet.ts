import { Networks } from "@payvo/sdk";

import { featureFlags, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	id: "xqr.mainnet",
	type: "live",
	name: "Mainnet",
	coin: "Qredit",
	currency: {
		ticker: "XQR",
		symbol: "Q",
		decimals: 8,
	},
	constants: {
		slip44: 111,
	},
	hosts: [
		{
			type: "full",
			host: "https://qredit.cloud/api",
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
			ticker: "XQR",
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
		block: "qredit/block/{0}",
		transaction: "qredit/transaction/{0}",
		wallet: "qredit/wallets/{0}",
	},
	knownWallets: "https://raw.githubusercontent.com/qredit/common/master/mainnet/known-wallets-extended.json",
	meta: {
		fastDelegateSync: true,
	},
};

export default network;
