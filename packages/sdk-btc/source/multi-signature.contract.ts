export interface MultiSignatureAsset {
	min: number;
	numberOfSignatures: number;
	publicKeys: string[];
}

export interface MultiSignatureRegistrationTransaction {
	id: string;
	senderPublicKey: string;
	multiSignature: MultiSignatureAsset;
	signatures: string[];
}

export interface MultiSignaturePsbtTransaction {
	multiSignature: MultiSignatureAsset;
	psbt: string;
}

export type MultiSignatureTransaction = MultiSignatureRegistrationTransaction | MultiSignaturePsbtTransaction;
