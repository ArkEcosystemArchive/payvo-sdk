import { MultiSignatureAsset } from "./multi-signature.contract.js";

export interface IdentityLevels {
	account: number;
	change?: number;
	addressIndex?: number;
}

export interface IdentityOptions {
	bip39?: boolean;
	bip44?: IdentityLevels;
	bip44Legacy?: IdentityLevels;
	bip49?: IdentityLevels;
	bip84?: IdentityLevels;
	multiSignature?: MultiSignatureAsset;
	senderPublicKey?: string;
}

export interface MultisignatureAddressInput {
	min?: number;
	publicKeys?: string[];
	senderPublicKey?: string;
}
