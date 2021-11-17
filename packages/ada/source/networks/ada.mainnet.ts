import { Networks } from "@payvo/sdk";

import { constants, explorer, featureFlags, importMethods, transactions } from "./shared.js";

const network: Networks.NetworkManifest = {
	coin: "Cardano",
	constants,
	currency: {
		decimals: 6,
		symbol: "ADA",
		ticker: "ADA",
	},
	explorer,
	featureFlags,
	hosts: [
		{
			host: "https://explorer.cardano.org",
			type: "explorer",
		},
	],
	id: "ada.mainnet",
	importMethods,
	meta: {
		extendedPublicKey: true,
		keyDeposit: 2_000_000,
		minFeeA: 44,
		minFeeB: 155_381,
		minUTxOValue: 1_000_000,

		// @TODO
		networkId: "1",

		poolDeposit: 500_000_000,
	},
	name: "Mainnet",
	transactions,
	type: "live",
};

export default network;
