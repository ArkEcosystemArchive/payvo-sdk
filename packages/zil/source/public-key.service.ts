import { IoC, Services } from "@payvo/sdk";
import { Zilliqa } from "@zilliqa-js/zilliqa";

import { BindingType } from "./constants.js";
import { accountFromMnemonic } from "./zilliqa.js";

@IoC.injectable()
export class PublicKeyService extends Services.AbstractPublicKeyService {
	@IoC.inject(BindingType.Zilliqa)
	private readonly zilliqa!: Zilliqa;

	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PublicKeyDataTransferObject> {
		return {
			publicKey: (await accountFromMnemonic(this.zilliqa, mnemonic, options)).publicKey,
		};
	}
}
