import XlmMainnet from "./networks/xlm.mainnet.js";
import XlmTestnet from "./networks/xlm.testnet.js";

export const manifest = {
	name: "XLM",
	networks: {
		"xlm.mainnet": XlmMainnet,
		"xlm.testnet": XlmTestnet,
	},
};
