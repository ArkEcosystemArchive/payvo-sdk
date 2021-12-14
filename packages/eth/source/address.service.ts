import { Coins, Services } from "@payvo/sdk";
import { Hash } from "@payvo/sdk-cryptography";
import { ethers } from "ethers";

import { createWallet } from "./utils.js";

export class AddressService extends Services.AbstractAddressService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return {
			address: await createWallet(
				mnemonic,
				this.configRepository.get(Coins.ConfigKey.Slip44),
				options?.bip44?.account || 0,
				options?.bip44?.change || 0,
				options?.bip44?.addressIndex || 0,
			).getAddress(),
			type: "bip44",
		};
	}

	public override async fromPrivateKey(
		privateKey: string,
		options?: Services.IdentityOptions,
	): Promise<Services.AddressDataTransferObject> {
		return {
			address: await new ethers.Wallet(privateKey).getAddress(),
			type: "bip44",
		};
	}

	public override async validate(address: string): Promise<boolean> {
		if (!/^(0x)?[\da-f]{40}$/i.test(address)) {
			return false;
		}

		if (/^(0x|0X)?[\da-f]{40}$/.test(address) || /^(0x|0X)?[\dA-F]{40}$/.test(address)) {
			return true;
		}

		address = address.replace(/^0x/i, "");

		const addressHash = Hash.sha3(address.toLowerCase()).toString("hex").replace(/^0x/i, "");

		for (let index = 0; index < 40; index++) {
			if (
				(Number.parseInt(addressHash[index], 16) > 7 && address[index].toUpperCase() !== address[index]) ||
				(Number.parseInt(addressHash[index], 16) <= 7 && address[index].toLowerCase() !== address[index])
			) {
				return false;
			}
		}

		return true;
	}
}
