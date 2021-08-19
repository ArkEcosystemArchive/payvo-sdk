import { MultiSignatureAsset } from "./multi-signature.contract";

export interface IdentityLevel {
	account: number;
	change?: number;
	addressIndex?: number;
};

export interface IdentityOptions {
	bip39?: boolean;
	bip44?: IdentityLevel;
	bip49?: IdentityLevel;
	bip84?: IdentityLevel;
	multiSignature?: MultiSignatureAsset;
}
