import { BIP32, BIP32Interface, Buffer } from "@payvo/sdk-cryptography";
import * as bitcoin from "bitcoinjs-lib";

export const bip44 = (publicKey, network): string =>
	bitcoin.payments.p2pkh({
		pubkey: publicKey,
		network: network,
	}).address!;

export const bip49 = (publicKey, network): string =>
	bitcoin.payments.p2sh({
		redeem: bitcoin.payments.p2wpkh({
			pubkey: publicKey,
			network: network,
		}),
		network: network,
	}).address!;

export const bip84 = (publicKey, network): string =>
	bitcoin.payments.p2wpkh({
		pubkey: publicKey,
		network: network,
	}).address!;

export const rootToAccountKeys = (
	rootKeys: BIP32Interface[],
	derivationFn: (rootKey: BIP32Interface) => BIP32Interface,
) => rootKeys.map(derivationFn);

export const rootKeyToAccountKey = (rootKey: BIP32Interface, path: string): BIP32Interface => rootKey.derivePath(path);

export const defaultLegacyMusigAccountKey = (rootKey: BIP32Interface): BIP32Interface =>
	rootKeyToAccountKey(rootKey, "m/45'/0");

export const defaultP2SHSegwitMusigAccountKey = (rootKey: BIP32Interface): BIP32Interface =>
	rootKeyToAccountKey(rootKey, "m/48'/1'/0'/1'");

export const defaultNativeSegwitMusigAccountKey = (rootKey: BIP32Interface): BIP32Interface =>
	rootKeyToAccountKey(rootKey, "m/48'/1'/0'/2'");

const createMusigPayment = (minSignatures: number, pubkeys: Buffer[], network: bitcoin.Network) =>
	bitcoin.payments.p2ms({
		m: minSignatures,
		pubkeys: pubkeys.sort((a: Buffer, b: Buffer) => a.compare(b)) as any,
		network,
	});

export const legacyMusig = (minSignatures: number, pubkeys: Buffer[], network: bitcoin.Network): bitcoin.Payment =>
	bitcoin.payments.p2sh({
		redeem: createMusigPayment(minSignatures, pubkeys, network),
		network,
	});

export const p2SHSegwitMusig = (minSignatures: number, pubkeys: Buffer[], network: bitcoin.Network): bitcoin.Payment =>
	bitcoin.payments.p2sh({
		redeem: bitcoin.payments.p2wsh({
			redeem: createMusigPayment(minSignatures, pubkeys, network),
			network,
		}),
		network,
	});

export const nativeSegwitMusig = (
	minSignatures: number,
	pubkeys: Buffer[],
	network: bitcoin.Network,
): bitcoin.Payment =>
	bitcoin.payments.p2wsh({
		redeem: createMusigPayment(minSignatures, pubkeys, network),
		network,
	});

export const addressGenerator = function* (
	bip: (publicKey, network) => string,
	network: bitcoin.Network,
	extendedPublicKey: string,
	isSpend: boolean,
	chunkSize: number,
	max: number = Number.MAX_VALUE,
): Generator<string[]> {
	let index = 0;
	const node = BIP32.fromBase58(extendedPublicKey, network).derive(isSpend ? 0 : 1);

	while (index < max) {
		const chunk: string[] = [];
		for (let i = 0; i < chunkSize; i++) {
			chunk.push(bip(node.derive(index++).publicKey, network));
		}
		yield chunk;
	}
};
