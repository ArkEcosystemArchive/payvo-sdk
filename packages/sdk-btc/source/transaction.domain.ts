import { BIP44 } from "@payvo/cryptography";
import { BIP32Interface } from "bitcoinjs-lib";

export type SigningKeys = {
	path: string;
	address: string;
	publicKey: string;
	privateKey?: string;
};

export const addressesAndSigningKeysGenerator = function* (
	bip: (publicKey, network) => string,
	accountKey: BIP32Interface,
): Generator<SigningKeys> {
	let index = 0;
	const spendAddress = accountKey.derive(0);
	const changeAdress = accountKey.derive(1);

	while (true) {
		let spendPair = {
			path: `0/${index}`,
			address: bip(spendAddress.derive(index).publicKey, accountKey.network),
			publicKey: spendAddress.derive(index).publicKey!.toString("hex"),
			privateKey: spendAddress.derive(index).privateKey?.toString("hex"),
		};
		let changePair = {
			path: `1/${index}`,
			address: bip(changeAdress.derive(index).publicKey, accountKey.network),
			publicKey: changeAdress.derive(index).publicKey!.toString("hex"),
			privateKey: changeAdress.derive(index).privateKey?.toString("hex"),
		};
		yield spendPair;
		yield changePair;
		index++;
	}
};
