import { Exceptions, Services } from "@payvo/sdk";

import { deriveKey } from "./helpers.js";

export class PrivateKeyService extends Services.AbstractPrivateKeyService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PrivateKeyDataTransferObject> {
		return { privateKey: deriveKey(mnemonic).privateKey.toString("hex") };
	}
}
