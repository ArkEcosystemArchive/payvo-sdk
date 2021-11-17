import { Exceptions, Services } from "@payvo/sdk";

import { deriveKey } from "./helpers.js";

export class PublicKeyService extends Services.AbstractPublicKeyService {
	public override async fromMnemonic(
		mnemonic: string,
		options?: Services.IdentityOptions,
	): Promise<Services.PublicKeyDataTransferObject> {
		return { publicKey: deriveKey(mnemonic).publicKey!.toString("hex") };
	}
}
