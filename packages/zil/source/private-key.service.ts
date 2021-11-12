import { IoC, Services } from "@payvo/sdk";
import { Zilliqa } from "@zilliqa-js/zilliqa";

import { BindingType } from "./constants";
import { accountFromMnemonic } from "./zilliqa";

@IoC.injectable()
export class PrivateKeyService extends Services.AbstractPrivateKeyService {
	@IoC.inject(BindingType.Zilliqa)
	private readonly zilliqa!: Zilliqa;

	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PrivateKeyDataTransferObject> {
		return {
			privateKey: (await accountFromMnemonic(this.zilliqa, mnemonic, options)).privateKey,
		};
	}
}
