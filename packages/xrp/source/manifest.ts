import XrpMainnet from "./networks/xrp.mainnet.js";
import XrpTestnet from "./networks/xrp.testnet.js";

export const manifest = {
	name: "XRP",
	networks: {
		"xrp.mainnet": XrpMainnet,
		"xrp.testnet": XrpTestnet,
	},
};
