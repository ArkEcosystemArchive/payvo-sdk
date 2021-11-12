import { Networks } from "@payvo/sdk";

import { explorer, featureFlags, importMethods, transactions } from "./shared";

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
	explorer,
	featureFlags,
	hosts: [
		{
			host: "https://luna-lcd.terra.dev/",
			type: "full",
		},
		{
			host: "https://finder.terra.money/tequila-0004",
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
