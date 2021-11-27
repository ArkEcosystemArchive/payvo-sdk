import ZilliqaMainnet from "./networks/zil.mainnet.js";
import ZilliqaTestnet from "./networks/zil.testnet.js";

export const manifest = {
	name: "ZIL",
	networks: {
		"zil.mainnet": ZilliqaMainnet,
		"zil.testnet": ZilliqaTestnet,
	},
};
