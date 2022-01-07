import { Services } from "@payvo/sdk";

import { deriveAccountKey, deriveRootKey } from "./shelley.js";

export class ExtendedPublicKeyService extends Services.AbstractExtendedPublicKeyService {
	public override async fromMnemonic(mnemonic: string, options?: Services.IdentityOptions): Promise<string> {
		return deriveAccountKey(deriveRootKey(mnemonic), options?.bip44?.account || 0)
			.to_public()
			.to_bech32();
	}
}
