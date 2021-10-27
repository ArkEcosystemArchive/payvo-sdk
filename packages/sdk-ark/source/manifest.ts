import ArkDevnet from "./networks/ark.devnet";
import ArkMainnet from "./networks/ark.mainnet";
import BindMainnet from "./networks/bind.mainnet";
import BindTestnet from "./networks/bind.testnet";
import XqrMainnet from "./networks/xqr.mainnet";
import XqrTestnet from "./networks/xqr.testnet";

export const manifest = {
	name: "ARK",
	networks: {
		"ark.mainnet": ArkMainnet,
		"ark.devnet": ArkDevnet,
		"bind.mainnet": BindMainnet,
		"bind.testnet": BindTestnet,
		"xqr.mainnet": XqrMainnet,
		"xqr.testnet": XqrTestnet,
	},
};
