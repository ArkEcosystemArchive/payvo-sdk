export interface MultiSignatureAsset {
	min: number;
	publicKeys: string[];
}

export interface MultiSignatureRegistrationTransaction {
	multiSignature: MultiSignatureAsset;
	signatures: string[];
}

export interface MultiSignaturePsbtTransaction {
	multiSignature: MultiSignatureAsset;
	psbt: string;
}

export type MultiSignatureTransaction = MultiSignatureRegistrationTransaction | MultiSignaturePsbtTransaction;
