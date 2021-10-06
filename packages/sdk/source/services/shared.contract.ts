import { MultiSignatureAsset } from "./multi-signature.contract";

export interface IdentityLevels {
	account: number;
	change?: number;
	addressIndex?: number;
}

export interface IdentityOptions {
	bip39?: boolean;
	bip39Locale?: string;
	bip44?: IdentityLevels;
	bip44Legacy?: IdentityLevels;
	bip49?: IdentityLevels;
	bip84?: IdentityLevels;
	multiSignature?: MultiSignatureAsset;
}
