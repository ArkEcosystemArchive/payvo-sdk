import { BIP32Interface } from "bitcoinjs-lib";
import { SigningKeys } from "./contracts";

export const addressesAndSigningKeysGenerator = function* (
	bip: (publicKey, network) => string,
	accountKey: BIP32Interface,
): Generator<SigningKeys> {
	let index = 0;
	const spendAddress = accountKey.derive(0);
	const changeAdress = accountKey.derive(1);

	while (true) {
		let spendPair: SigningKeys = {
			path: `0/${index}`,
			address: bip(spendAddress.derive(index).publicKey, accountKey.network),
			publicKey: spendAddress.derive(index).publicKey!.toString("hex"),
			privateKey: spendAddress.derive(index).privateKey?.toString("hex"),
			status: "unknown",
		};
		let changePair: SigningKeys = {
			path: `1/${index}`,
			address: bip(changeAdress.derive(index).publicKey, accountKey.network),
			publicKey: changeAdress.derive(index).publicKey!.toString("hex"),
			privateKey: changeAdress.derive(index).privateKey?.toString("hex"),
			status: "unknown",
		};
		yield spendPair;
		yield changePair;
		index++;
	}
};
