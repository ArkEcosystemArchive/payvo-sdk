import { Coins, Exceptions, Services } from "@payvo/sdk";
import { Wallet, Account } from "@zilliqa-js/account";
import { bytes, units, BN, Zilliqa } from "@zilliqa-js/zilliqa";

export const getZilliqaVersion = (config: Coins.ConfigRepository) => {
	const id = config.get<string>("network.id");

	let chainId: number | undefined;

	if (id === "zil.testnet") {
		chainId = 333;
	}

	if (id === "zil.mainnet") {
		chainId = 1;
	}

	if (!chainId) {
		throw new Exceptions.Exception(`Add chainId for network ${id}`);
	}

	return bytes.pack(chainId, 1);
};

export const accountFromMnemonic = async (
	zilliqa: Zilliqa,
	mnemonic: string,
	options?: Services.IdentityOptions,
): Promise<Account> => {
	const index = options?.bip44?.addressIndex;
	const address = zilliqa.wallet.addByMnemonic(mnemonic, index); // TODO: is second argument correct?
	return zilliqa.wallet.accounts[address];
};

export const accountFromPrivateKey = async (zilliqa: Zilliqa, privateKey: string): Promise<Account> => {
	const address = zilliqa.wallet.addByPrivateKey(privateKey);
	return zilliqa.wallet.accounts[address];
};

export const convertQaToZil = (qa: string): string => units.fromQa(new BN(qa), units.Units.Zil);

export const convertZilToQa = (zil: string | number): string => units.toQa(zil, units.Units.Zil).toString();
