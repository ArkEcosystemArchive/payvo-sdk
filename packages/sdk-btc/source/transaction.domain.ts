import { BIP32Interface } from "bitcoinjs-lib";

export const addressesAndSigningKeysGenerator = function* (
	bip: (publicKey, network) => string,
	accountKey: BIP32Interface,
): Generator<{ address: string, privateKey: string }> {
	let index = 0;
	const spendAddress = accountKey.derive(0);
	const changeAdress = accountKey.derive(1);

	while (true) {
		let spendPair = {
			address: bip(spendAddress.derive(index).publicKey, accountKey.network),
			privateKey: spendAddress.derive(index).privateKey!.toString('hex'),
		};
		let changePair = {
			address: bip(changeAdress.derive(index).publicKey, accountKey.network),
			privateKey: changeAdress.derive(index).privateKey!.toString('hex'),
		};
		yield spendPair;
		yield changePair;
		index++;
	}
};
