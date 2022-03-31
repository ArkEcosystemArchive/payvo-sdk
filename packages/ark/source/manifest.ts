import ArkDevnet from "./networks/ark.devnet.js";
import ArkMainnet from "./networks/ark.mainnet.js";
import BindMainnet from "./networks/bind.mainnet.js";
import BindTestnet from "./networks/bind.testnet.js";
import BplMainnet from "./networks/bpl.mainnet.js";
import SxpMainnet from "./networks/sxp.mainnet.js";
import SxpTestnet from "./networks/sxp.testnet.js";
import XqrMainnet from "./networks/xqr.mainnet.js";
import XqrTestnet from "./networks/xqr.testnet.js";

export const manifest = {
	name: "ARK",
	networks: {
		"ark.devnet": ArkDevnet,
		"ark.mainnet": ArkMainnet,
		"bind.mainnet": BindMainnet,
		"bind.testnet": BindTestnet,
		"bpl.mainnet": BplMainnet,
		"sxp.mainnet": SxpMainnet,
		"sxp.testnet": SxpTestnet,
		"xqr.mainnet": XqrMainnet,
		"xqr.testnet": XqrTestnet,
	},
};
