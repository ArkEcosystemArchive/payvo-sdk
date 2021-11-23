import { Exceptions, Services } from "@payvo/sdk";
import { BIP32Interface } from "@payvo/sdk-cryptography";
import * as bitcoin from "bitcoinjs-lib";
import changeVersionBytes from "xpub-converter";

import { MultiSignatureTransaction } from "./multi-signature.contract";

// https://github.com/satoshilabs/slips/blob/master/slip-0132.md#registered-hd-version-bytes
const mainnetPrefixes = { xpub: "legacyMusig", Ypub: "p2SHSegwitMusig", Zpub: "nativeSegwitMusig" };
const testnetPrefixes = { tpub: "legacyMusig", Upub: "p2SHSegwitMusig", Vpub: "nativeSegwitMusig" };

export const keysAndMethod = (
	multiSignatureAsset: Services.MultiSignatureAsset,
	network: bitcoin.networks.Network,
): { accountExtendedPublicKeys: string[]; method: Services.MusigDerivationMethod } => {
	const prefixes = multiSignatureAsset.publicKeys.map((publicKey) => publicKey.slice(0, 4));

	if (new Set(prefixes).size > 1) {
		throw new Exceptions.Exception(`Cannot mix extended public key prefixes.`);
	}

	let method: Services.MusigDerivationMethod;

	if (network === bitcoin.networks.bitcoin) {
		if (prefixes.some((prefix) => !mainnetPrefixes[prefix])) {
			throw new Exceptions.Exception(
				`Extended public key must start with any of ${Object.keys(mainnetPrefixes)}.`,
			);
		}
		method = mainnetPrefixes[prefixes[0]];
	} else if (network === bitcoin.networks.testnet) {
		if (prefixes.some((prefix) => !testnetPrefixes[prefix])) {
			throw new Exceptions.Exception(
				`Extended public key must start with any of ${Object.keys(testnetPrefixes)}.`,
			);
		}
		method = testnetPrefixes[prefixes[0]];
	} else {
		throw new Exceptions.Exception(`Invalid network.`);
	}
	const accountPublicKeys = multiSignatureAsset.publicKeys.map((publicKey) =>
		changeVersionBytes(publicKey, network === bitcoin.networks.bitcoin ? "xpub" : "tpub"),
	);
	return {
		accountExtendedPublicKeys: accountPublicKeys,
		method,
	};
};

export const toExtPubKey = (
	accountPrivateKey: BIP32Interface,
	method: Services.MusigDerivationMethod,
	network: bitcoin.networks.Network,
): string => {
	let prefixes;
	if (network === bitcoin.networks.bitcoin) {
		prefixes = mainnetPrefixes;
	} else if (network === bitcoin.networks.testnet) {
		prefixes = testnetPrefixes;
	} else {
		throw new Exceptions.Exception(`Invalid network.`);
	}
	const prefix = Object.entries(prefixes).find((entry) => entry[1] === method);
	return changeVersionBytes(accountPrivateKey.neutered().toBase58(), prefix![0]);
};

export const isMultiSignatureRegistration = (transaction: MultiSignatureTransaction): boolean =>
	transaction.psbt === undefined;
