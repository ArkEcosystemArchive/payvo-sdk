import { Exceptions, IoC, Services } from "@payvo/sdk";

import { KeyPairService } from "./key-pair.service.js";

@IoC.injectable()
export class PublicKeyService extends Services.AbstractPublicKeyService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PublicKeyDataTransferObject> {
		return {
			publicKey: (await new KeyPairService().fromMnemonic(mnemonic, options)).publicKey,
		};
	}
}
