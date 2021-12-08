import { IoC, Services } from "@payvo/sdk";
import { Zilliqa } from "@zilliqa-js/zilliqa";

import { BindingType } from "./constants.js";
import { accountFromMnemonic } from "./zilliqa.js";

export class PublicKeyService extends Services.AbstractPublicKeyService {
	readonly #zilliqa: Zilliqa;

	public constructor(container: IoC.IContainer) {
		super(container);

		this.#zilliqa = container.get(BindingType.Zilliqa);
	}

	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PublicKeyDataTransferObject> {
		return {
			publicKey: (await accountFromMnemonic(this.#zilliqa, mnemonic, options)).publicKey,
		};
	}
}
