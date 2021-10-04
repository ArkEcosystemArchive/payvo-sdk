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
	rootKeys: bitcoin.BIP32Interface[],
	derivationFn: (rootKey: bitcoin.BIP32Interface) => bitcoin.BIP32Interface,
) => rootKeys.map(derivationFn);

export const rootKeyToAccountKey = (rootKey: bitcoin.BIP32Interface, path: string): bitcoin.BIP32Interface =>
	rootKey.derivePath(path);

export const defaultLegacyMusigAccountKey = (rootKey: bitcoin.BIP32Interface): bitcoin.BIP32Interface =>
	rootKeyToAccountKey(rootKey, "45'/0");

export const defaultP2SHSegwitMusigAccountKey = (rootKey: bitcoin.BIP32Interface): bitcoin.BIP32Interface =>
	rootKeyToAccountKey(rootKey, "48'/1'/0'/1'");

export const defaultNativeSegwitMusigAccountKey = (rootKey: bitcoin.BIP32Interface): bitcoin.BIP32Interface =>
	rootKeyToAccountKey(rootKey, "48'/1'/0'/2'");

const sort = (a: Buffer, b: Buffer) => Buffer.compare(a, b);

const createMusigPayment = (m: number, pubkeys: Buffer[], network: bitcoin.Network) =>
	bitcoin.payments.p2ms({
		m,
		pubkeys: pubkeys.sort(sort),
		network,
	});

export const legacyMusig = (m: number, pubkeys: Buffer[], network: bitcoin.Network): string =>
	bitcoin.payments.p2sh({
		redeem: createMusigPayment(m, pubkeys, network),
		network,
	}).address!;

export const p2SHSegwitMusig = (m: number, pubkeys: Buffer[], network: bitcoin.Network): string =>
	bitcoin.payments.p2sh({
		redeem: bitcoin.payments.p2wsh({
			redeem: createMusigPayment(m, pubkeys, network),
			network,
		}),
		network,
	}).address!;

export const nativeSegwitMusig = (m: number, pubkeys: Buffer[], network: bitcoin.Network): string =>
	bitcoin.payments.p2wsh({
		redeem: createMusigPayment(m, pubkeys, network),
		network,
	}).address!;

export const addressGenerator = function* (
	bip: (publicKey, network) => string,
	network: bitcoin.Network,
	extendedPublicKey: string,
	isSpend: boolean,
	chunkSize: number,
	max: number = Number.MAX_VALUE,
): Generator<string[]> {
	let index = 0;
	const node = bitcoin.bip32.fromBase58(extendedPublicKey, network).derive(isSpend ? 0 : 1);

	while (index < max) {
		const chunk: string[] = [];
		for (let i = 0; i < chunkSize; i++) {
			chunk.push(bip(node.derive(index++).publicKey, network));
		}
		yield chunk;
	}
};
