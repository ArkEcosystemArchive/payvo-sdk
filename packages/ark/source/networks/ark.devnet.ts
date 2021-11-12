import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	coin: "ARK",
	constants: {
		slip44: 1,
	},
	currency: {
		decimals: 8,
		symbol: "DѦ",
		ticker: "DARK",
	},
	explorer,
	featureFlags,
	governance: {
		delegateCount: 51,
		votesPerTransaction: 1,
		votesPerWallet: 1,
	},
	hosts: [
		{
			host: "https://ark-test.payvo.com/api",
			type: "full",
		},
		{
			host: "https://ark-test-musig.payvo.com",
			type: "musig",
		},
		{
			host: "https://dexplorer.ark.io",
			type: "explorer",
		},
	],
	id: "ark.devnet",
	importMethods,
	knownWallets: "https://raw.githubusercontent.com/ArkEcosystem/common/master/devnet/known-wallets-extended.json",
	meta: {
		fastDelegateSync: true,
	},
	name: "Devnet",
	transactions: {
		...transactions,
		fees: {
			ticker: "DARK",
			type: "dynamic",
		},
		multiPaymentRecipients: 128,
	},
	type: "test",
};

export default network;
