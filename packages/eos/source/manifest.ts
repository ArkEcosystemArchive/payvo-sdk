import BosMainnet from "./networks/bos.mainnet.js";
import EosMainnet from "./networks/eos.mainnet.js";
import EosTestnet from "./networks/eos.testnet.js";
import MeetoneMainnet from "./networks/meetone.mainnet.js";
import TelosMainnet from "./networks/telos.mainnet.js";
import TelosTestnet from "./networks/telos.testnet.js";
import WaxMainnet from "./networks/wax.mainnet.js";
import WorbliMainnet from "./networks/worbli.mainnet.js";
import WorbliTestnet from "./networks/worbli.testnet.js";

export const manifest = {
	name: "EOS",
	networks: {
		"eos.mainnet": EosMainnet,
		"eos.testnet": EosTestnet,
		"telos.mainnet": TelosMainnet,
		"telos.testnet": TelosTestnet,
		"wax.mainnet": WaxMainnet,
		"worbli.mainnet": WorbliMainnet,
		"worbli.testnet": WorbliTestnet,
		"meetone.mainnet": MeetoneMainnet,
		"bos.mainnet": BosMainnet,
	},
};
