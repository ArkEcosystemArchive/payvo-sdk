import { Signatory } from "../signatories";
import { MultiSignatureAsset } from "./multi-signature.contract";
import { IdentityOptions } from "./shared.contract";

export interface SignatoryService {
	mnemonic(mnemonic: string, options?: IdentityOptions): Promise<Signatory>;

	confirmationMnemonic(mnemonic: string, confirmation: string, options?: IdentityOptions): Promise<Signatory>;

	wif(mnemonic: string): Promise<Signatory>;

	confirmationWIF(mnemonic: string, confirmation: string): Promise<Signatory>;

	privateKey(privateKey: string, options?: IdentityOptions): Promise<Signatory>;

	multiSignature(asset: MultiSignatureAsset, options?: IdentityOptions): Promise<Signatory>;

	ledger(path: string): Promise<Signatory>;

	secret(secret: string): Promise<Signatory>;
}
