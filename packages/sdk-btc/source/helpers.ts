import { BIP44 } from "@payvo/cryptography";
import { Coins, Contracts, Exceptions, Helpers, Http, Services } from "@payvo/sdk";
import { addressGenerator, bip44, bip49, bip84 } from "./address.domain";
import { getNetworkConfig } from "./config";

export const post = async (
	path: string,
	body: Contracts.KeyValuePair,
	httpClient: Http.HttpClient,
	configRepository: Coins.ConfigRepository,
): Promise<Contracts.KeyValuePair> => {
	return (await httpClient.post(`${Helpers.randomHostFromConfig(configRepository)}/${path}`, body)).json();
};

export const walletUsedTransactions = async (
	addresses: string[],
	httpClient: Http.HttpClient,
	configRepository: Coins.ConfigRepository,
): Promise<{ string: boolean }[]> => {
	const response = await post(`wallets/addresses`, { addresses: addresses }, httpClient, configRepository);
	return response.data;
};

export const usedAddresses = async (
	addressesGenerator: Generator<string[]>,
	httpClient: Http.HttpClient,
	configRepository: Coins.ConfigRepository,
): Promise<string[]> => {
	const usedAddresses: string[] = [];

	let exhausted = false;
	do {
		const addressChunk: string[] = addressesGenerator.next().value;
		const used: { string: boolean }[] = await walletUsedTransactions(addressChunk, httpClient, configRepository);

		const items = addressChunk.filter((address) => used[address]);
		usedAddresses.push(...items);

		exhausted = Object.values(used)
			.slice(-20)
			.every((x) => !x);
	} while (!exhausted);

	return usedAddresses;
};

export const firstUnusedAddresses = async (
	addressesGenerator: Generator<string[]>,
	httpClient: Http.HttpClient,
	configRepository: Coins.ConfigRepository,
): Promise<string> => {
	while (true) {
		const addressChunk: string[] = addressesGenerator.next().value;
		const used: { string: boolean }[] = await walletUsedTransactions(addressChunk, httpClient, configRepository);

		const items = addressChunk.filter((address) => !used[address]);
		if (items.length > 0) {
			return items[0];
		}
	}
};

export const getDerivationMethod = (
	id: Services.WalletIdentifier,
): ((publicKey: string, network: string) => string) => {
	return { bip44, bip49, bip84 }[id.method!];
};

export const getAddresses = async (
	id: Services.WalletIdentifier,
	httpClient: Http.HttpClient,
	configRepository: Coins.ConfigRepository,
): Promise<string[]> => {
	if (id.type === "extendedPublicKey") {
		const network = getNetworkConfig(configRepository);

		const usedSpendAddresses = await usedAddresses(
			addressGenerator(getDerivationMethod(id), network, id.value, true, 100),
			httpClient,
			configRepository,
		);

		const usedChangeAddresses = await usedAddresses(
			addressGenerator(getDerivationMethod(id), network, id.value, false, 100),
			httpClient,
			configRepository,
		);

		return usedSpendAddresses.concat(usedChangeAddresses);
	} else if (id.type === "address") {
		return [id.value];
	} else if (id.type === "publicKey") {
		return [id.value];
	}

	throw new Exceptions.Exception(`Address derivation method still not implemented: ${id.type}`);
};

export const maxLevel = (path: string): number => {
	const bip44Levels = BIP44.parse(path);
	let depth = 0;
	if (bip44Levels.purpose !== undefined) {
		depth++;
	}
	if (bip44Levels.coinType !== undefined) {
		depth++;
	}
	if (bip44Levels.account !== undefined) {
		depth++;
	}
	if (bip44Levels.change !== undefined) {
		depth++;
	}
	if (bip44Levels.addressIndex !== undefined) {
		depth++;
	}
	return depth;
};
