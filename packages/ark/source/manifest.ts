import ArkDevnet from "./networks/ark.devnet";
import ArkMainnet from "./networks/ark.mainnet";
import BindMainnet from "./networks/bind.mainnet";
import BindTestnet from "./networks/bind.testnet";
import BplMainnet from "./networks/bpl.mainnet";
import XqrMainnet from "./networks/xqr.mainnet";
import XqrTestnet from "./networks/xqr.testnet";

export const manifest = {
	name: "ARK",
	networks: {
		"ark.devnet": ArkDevnet,
		"ark.mainnet": ArkMainnet,
		"bind.mainnet": BindMainnet,
		"bind.testnet": BindTestnet,
		"bpl.mainnet": BplMainnet,
		"xqr.mainnet": XqrMainnet,
		"xqr.testnet": XqrTestnet,
	},
};
