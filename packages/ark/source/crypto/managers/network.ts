import { NetworkConfig } from "../interfaces/networks.js";
import * as networks from "../networks/index.js";
import { NetworkName } from "../types.js";

export class NetworkManager {
	public static all(): Record<NetworkName, NetworkConfig> {
		// @ts-ignore - the newly generated unitnet doesn't match the old configs because it has things like a nonce field
		return networks as unknown as Record<NetworkName, NetworkConfig>;
	}

	public static findByName(name: NetworkName): NetworkConfig {
		return networks[name.toLowerCase()];
	}
}
