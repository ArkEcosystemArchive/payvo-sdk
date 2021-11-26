import TrxMainnet from "./networks/trx.mainnet.js";
import TrxTestnet from "./networks/trx.testnet.js";

export const manifest = {
	name: "TRX",
	networks: {
		"trx.mainnet": TrxMainnet,
		"trx.testnet": TrxTestnet,
	},
};
