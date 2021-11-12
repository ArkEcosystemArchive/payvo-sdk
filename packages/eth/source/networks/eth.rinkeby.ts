import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared";

const network: Networks.NetworkManifest = {
	coin: "Ethereum",
	constants: {
		slip44: 60,
	},
	currency: {
		decimals: 18,
		symbol: "Ξ",
		ticker: "ETH",
	},
	explorer,
	featureFlags,
	hosts: [
		{
			host: "https://platform.ark.io/api/eth",
			type: "full",
		},
		{
			host: "https://rinkeby.etherscan.io",
			type: "explorer",
		},
	],
	id: "eth.rinkeby",
	importMethods,
	meta: {
		// @TODO
		networkId: "4",
	},
	name: "Rinkeby",
	transactions,
	type: "test",
};

export default network;
