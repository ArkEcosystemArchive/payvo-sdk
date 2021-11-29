import { Coins, Exceptions, Services } from "@payvo/sdk";
import { Account } from "@zilliqa-js/account";
import { BN, bytes, units } from "@zilliqa-js/util";
import { Zilliqa } from "@zilliqa-js/zilliqa";

export const getZilliqaVersion = (config: Coins.ConfigRepository) => {
	const chainId: number | undefined = config.get("network.meta.chainId");

	if (!chainId) {
		throw new Exceptions.Exception(`Add chainId for network ${chainId}`);
	}

	return bytes.pack(chainId, 1);
};

export const accountFromMnemonic = async (
	zilliqa: Zilliqa,
	mnemonic: string,
	options?: Services.IdentityOptions,
): Promise<Account> => {
	const address: string = zilliqa.wallet.addByMnemonic(mnemonic, options?.bip44?.addressIndex);

	return zilliqa.wallet.accounts[address];
};

export const accountFromPrivateKey = async (zilliqa: Zilliqa, privateKey: string): Promise<Account> => {
	const address: string = zilliqa.wallet.addByPrivateKey(privateKey);

	return zilliqa.wallet.accounts[address];
};

export const convertQaToZil = (qa: string): string => units.fromQa(new BN(qa), units.Units.Zil);

export const convertZilToQa = (zil: string | number): string => units.toQa(zil, units.Units.Zil).toString();
