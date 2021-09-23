import { BIP44 } from "@payvo/cryptography";
import * as bitcoin from "bitcoinjs-lib";
import { Levels } from "./address.factory";
import { Bip44Address } from "./contracts";

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
	bipLevel: Levels | undefined,
	bip: (publicKey, network) => string,
	network: bitcoin.Network,
	extendedPublicKey: string,
	isSpend: boolean,
	chunkSize: number,
	max: number = Number.MAX_VALUE,
): Generator<Bip44Address[]> {
	let index = 0;
	const chain = isSpend ? 0 : 1;
	const node = bitcoin.bip32.fromBase58(extendedPublicKey, network).derive(chain);
	while (index < max) {
		const chunk: Bip44Address[] = [];
		for (let i = 0; i < chunkSize; i++) {
			chunk.push({
				path: bipLevel ? BIP44.stringify({
					...bipLevel,
					change: chain,
					index,
				}) : chain + "/" + index,
				address: bip(node.derive(index++).publicKey, network),
				status: "unknown",
			});
		}
		yield chunk;
	}
};
