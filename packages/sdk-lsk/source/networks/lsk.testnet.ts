import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	id: "lsk.testnet",
	type: "test",
	name: "Testnet",
	coin: "Lisk",
	currency: {
		ticker: "LSK",
		symbol: "LSK",
		decimals: 8,
	},
	constants: {
		slip44: 134,
	},
	hosts: [
		{
			type: "full",
			host: "https://testnet.lisk.io",
		},
		{
			type: "explorer",
			host: "https://ams1-testnet-explorer-001.lisk.io/",
		},
	],
	governance: {
		delegateCount: 101,
		votesPerWallet: 101,
		votesPerTransaction: 33,
	},
	transactions,
	importMethods,
	featureFlags,
	explorer: {
		block: "block/{0}",
		transaction: "tx/{0}",
		wallet: "address/{0}",
	},
	meta: {
		// @TODO
		networkId: "da3ed6a45429278bac2666961289ca17ad86595d33b31037615d4b8e8f158bba",
	},
};

export default network;
