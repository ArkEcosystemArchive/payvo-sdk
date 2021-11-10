import { ethers } from "ethers";

export const createWallet = (
	mnemonic: string,
	coinType: number,
	account: number,
	change: number,
	addressIndex: number,
): ethers.Wallet => ethers.Wallet.fromMnemonic(mnemonic, `m/44'/${coinType}'/${account}'/${change}/${addressIndex}`);
