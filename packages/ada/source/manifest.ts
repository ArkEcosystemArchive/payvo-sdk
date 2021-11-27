import AdaMainnet from "./networks/ada.mainnet.js";
import AdaTestnet from "./networks/ada.testnet.js";

export const manifest = {
	name: "ADA",
	networks: {
		"ada.mainnet": AdaMainnet,
		"ada.testnet": AdaTestnet,
	},
};
