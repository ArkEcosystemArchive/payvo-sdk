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
