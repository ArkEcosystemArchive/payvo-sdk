import { IoC, Services } from "@payvo/sdk";
import { Zilliqa } from "@zilliqa-js/zilliqa";

import { BindingType } from "./constants.js";
import { accountFromMnemonic, accountFromPrivateKey } from "./zilliqa.js";

export class KeyPairService extends Services.AbstractKeyPairService {
	readonly #zilliqa: Zilliqa;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#zilliqa = container.get(BindingType.Zilliqa);
	}

	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.KeyPairDataTransferObject> {
		const { publicKey, privateKey } = await accountFromMnemonic(this.#zilliqa, mnemonic, options);

		return { publicKey, privateKey };
	}

	public override async fromPrivateKey(privateKey: string): Promise<Services.KeyPairDataTransferObject> {
		const { publicKey } = await accountFromPrivateKey(this.#zilliqa, privateKey);

		return { publicKey, privateKey };
	}
}
