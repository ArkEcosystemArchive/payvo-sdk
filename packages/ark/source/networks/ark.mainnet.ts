import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
	coin: "ARK",
	constants: {
		slip44: 111,
	},
	currency: {
		decimals: 8,
		symbol: "Ѧ",
		ticker: "ARK",
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
			host: "https://ark-live.payvo.com/api",
			type: "full",
		},
		{
			host: "https://ark-live-musig.payvo.com",
			type: "musig",
		},
		{
			host: "https://explorer.ark.io",
			type: "explorer",
		},
	],
	id: "ark.mainnet",
	importMethods,
	knownWallets: "https://raw.githubusercontent.com/ArkEcosystem/common/master/mainnet/known-wallets-extended.json",
	meta: {
		fastDelegateSync: true,
	},
	name: "Mainnet",
	transactions,
	type: "live",
};

export default network;
