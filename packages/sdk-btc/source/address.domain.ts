import * as bitcoin from "bitcoinjs-lib";

export const addressGenerator = function*(
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
			chunk.push(
				bitcoin.payments.p2pkh({
					pubkey: node.derive(index++).publicKey,
					network: network,
				}).address!,
			);
		}
		yield chunk;
	}
};
