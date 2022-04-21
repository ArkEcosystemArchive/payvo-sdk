import { Coins, Contracts, Exceptions, Http, Networks, Services } from "@payvo/sdk";
import { BIP32Interface, BIP44 } from "@payvo/sdk-cryptography";
import * as bitcoin from "bitcoinjs-lib";
import { ECPair } from "ecpair";

import { addressGenerator, bip44, bip49, bip84 } from "./address.domain.js";
import { getNetworkConfig } from "./config.js";
import { BipLevel } from "./contracts.js";

// export const prettyBufferSerializer = (k, v) => {
// 	if (v !== null && v.type === "Buffer") {
// 		return convertBuffer(v.data);
// 	}
// 	if (v !== null && typeof v === "string") {
// 		try {
// 			return bitcoin.Psbt.fromBase64(v);
// 		} catch (_) {}
// 	}
// 	return v;
// };
//
// export const prettySerialize = (obj) => {
// 	return JSON.stringify(obj, prettyBufferSerializer, 2);
// };

export const post = async (
	path: string,
	body: Contracts.KeyValuePair,
	httpClient: Http.HttpClient,
	hostSelector: Networks.NetworkHostSelector,
	configRepository: Coins.ConfigRepository,
): Promise<Contracts.KeyValuePair> =>
	(await httpClient.post(`${hostSelector(configRepository).host}/${path}`, body)).json();

export const walletUsedAddresses = async (
	addresses: string[],
	httpClient: Http.HttpClient,
	hostSelector: Networks.NetworkHostSelector,
	configRepository: Coins.ConfigRepository,
): Promise<{ string: boolean }[]> => {
	const response = await post(
		`wallets/addresses`,
		{ addresses: addresses },
		httpClient,
		hostSelector,
		configRepository,
	);
	return response.data;
};

export const usedAddresses = async (
	addressesGenerator: Generator<string[]>,
	httpClient: Http.HttpClient,
	hostSelector: Networks.NetworkHostSelector,
	configRepository: Coins.ConfigRepository,
): Promise<string[]> => {
	const usedAddresses: string[] = [];

	let exhausted = false;
	do {
		const addressChunk: string[] = addressesGenerator.next().value;
		const used: { string: boolean }[] = await walletUsedAddresses(
			addressChunk,
			httpClient,
			hostSelector,
			configRepository,
		);

		const items = addressChunk.filter((address) => used[address]);
		usedAddresses.push(...items);

		exhausted = Object.values(used)
			.slice(-20)
			.every((x) => !x);
	} while (!exhausted);

	return usedAddresses;
};

export const getDerivationMethod = (id: Services.WalletIdentifier): ((publicKey: string, network: string) => string) =>
	({ bip44, bip49, bip84 }[id.method!]);

export const getDerivationFunction = (bipLevel: BipLevel): ((publicKey: string, network: string) => string) =>
	({ bip44, bip49, bip84 }[bipLevel]);

export const getAddresses = async (
	id: Services.WalletIdentifier,
	httpClient: Http.HttpClient,
	hostSelector: Networks.NetworkHostSelector,
	configRepository: Coins.ConfigRepository,
): Promise<string[]> => {
	switch (id.type) {
		case "extendedPublicKey": {
			const network = getNetworkConfig(configRepository);

			const usedSpendAddresses = await usedAddresses(
				addressGenerator(getDerivationMethod(id), network, id.value, true, 100),
				httpClient,
				hostSelector,
				configRepository,
			);

			const usedChangeAddresses = await usedAddresses(
				addressGenerator(getDerivationMethod(id), network, id.value, false, 100),
				httpClient,
				hostSelector,
				configRepository,
			);

			return usedSpendAddresses.concat(usedChangeAddresses);
		}
		case "address": {
			return [id.value];
		}
		case "publicKey": {
			return [id.value];
		}
		// No default
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

export const signWith = (psbt: bitcoin.Psbt, rootKey: BIP32Interface, path: string): bitcoin.Psbt => {
	for (const [index, input] of psbt.txInputs.entries()) {
		for (const derivation of psbt.data.inputs[index].bip32Derivation || []) {
			const [internal, addressIndex] = derivation.path.split("/").slice(-2);
			const child = rootKey.derivePath(`${path}/${internal}/${addressIndex}`);
			if (psbt.inputHasPubkey(index, child.publicKey)) {
				psbt.signInput(index, child);
				break;
			}
		}
	}
	return psbt;
};

export const signatureValidator = (pubkey: Buffer, msghash: Buffer, signature: Buffer): boolean =>
	ECPair.fromPublicKey(pubkey).verify(msghash, signature);
