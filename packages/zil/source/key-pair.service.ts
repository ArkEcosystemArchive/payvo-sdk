import { IoC, Services } from "@payvo/sdk";
import { Zilliqa } from "@zilliqa-js/zilliqa";

import { BindingType } from "./constants.js";
import { accountFromMnemonic, accountFromPrivateKey } from "./zilliqa.js";

export class KeyPairService extends Services.AbstractKeyPairService {
	@IoC.inject(BindingType.Zilliqa)
	private readonly zilliqa!: Zilliqa;

	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.KeyPairDataTransferObject> {
		const { publicKey, privateKey } = await accountFromMnemonic(this.zilliqa, mnemonic, options);

		return { publicKey, privateKey };
	}

	public override async fromPrivateKey(privateKey: string): Promise<Services.KeyPairDataTransferObject> {
		const { publicKey } = await accountFromPrivateKey(this.zilliqa, privateKey);

		return { publicKey, privateKey };
	}
}
