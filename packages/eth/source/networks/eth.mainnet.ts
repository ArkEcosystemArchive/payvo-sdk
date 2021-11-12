import { Networks } from "@payvo/sdk";

import tokens from "./eth.mainnet.tokens.json";
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
			host: "https://etherscan.io",
			type: "explorer",
		},
	],
	id: "eth.mainnet",
	importMethods,
	meta: {
		// @TODO
		networkId: "1",
	},
	name: "Mainnet",
	tokens,
	transactions,
	type: "live",
};

export default network;
