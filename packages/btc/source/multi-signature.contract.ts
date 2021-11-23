export interface MultiSignatureAsset {
	min: number;
	numberOfSignatures: number;
	publicKeys: string[];
}

export interface MultiSignatureTransaction {
	id: string;
	senderPublicKey: string;
	multiSignature: MultiSignatureAsset;
	psbt?: string;
	signatures: string[];
}
