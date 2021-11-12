export interface MultiSignatureAsset {
	numberOfSignatures: number;
	mandatoryKeys: string[];
	optionalKeys: string[];
}

export type MultiSignatureTransaction = Record<string, any> & {
	multiSignature: MultiSignatureAsset;
};
