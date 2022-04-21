import { Coins, Networks } from "@payvo/sdk";
import { ApiPromise } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";
import { HttpProvider } from "@polkadot/rpc-provider";

export const createApiPromise = async (
	config: Coins.ConfigRepository,
	hostSelector: Networks.NetworkHostSelector,
): Promise<ApiPromise> => {
	const provider = new HttpProvider(hostSelector(config).host);

	const api = await ApiPromise.create({ provider });
	await api.isReady;

	return api;
};

export const createKeyring = (config: Coins.ConfigRepository): Keyring => {
	const keyring = new Keyring({ type: "sr25519" });
	keyring.setSS58Format(config.get("network.meta.networkId"));

	return keyring;
};
