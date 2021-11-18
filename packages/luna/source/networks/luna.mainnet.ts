import { Networks } from "@payvo/sdk";

import { featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
	coin: "Luna",
	constants: {
		slip44: 330,
	},
	currency: {
		decimals: 6,
		symbol: "LUNA",
		ticker: "LUNA",
	},
	explorer: {
		block: "tequila-0004/blocks/{0}",
		transaction: "tequila-0004/txs/{0}",
		wallet: "tequila-0004/address/{0}",
	},
	featureFlags,
	hosts: [
		{
			host: "https://luna-lcd.terra.dev/",
			type: "full",
		},
		{
			host: "https://finder.terra.money",
			type: "explorer",
		},
	],
	id: "luna.mainnet",
	importMethods,
	name: "Mainnet",
	transactions,
	type: "live",
};

export default network;
