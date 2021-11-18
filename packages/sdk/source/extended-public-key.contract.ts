import { IdentityOptions } from "./shared.contract.js";

export interface ExtendedPublicKeyService {
	fromMnemonic(mnemonic: string, options?: IdentityOptions): Promise<string>;
}
