import { Contracts } from "@payvo/sdk";

export const joinModuleAndAssetIds = ({ moduleID, assetID }) => [moduleID, assetID].join(":");

export const getNumbersOfSignaturesRequired = ({ keys, isMultiSignatureRegistration }) => {
	if (isMultiSignatureRegistration) {
		return keys.mandatoryKeys.length + keys.optionalKeys.length + 1;
	}

	return keys.numberOfSignatures;
};

export const getKeys = ({ senderWallet, transaction, isMultiSignatureRegistration }) => {
	if (isMultiSignatureRegistration) {
		return transaction.asset;
	}

	return senderWallet.multiSignature();
};

export const getNonEmptySignatures = (signatures: Buffer[]): Buffer[] =>
	signatures.filter((signature: Buffer) => signature !== null && signature.length);

export const findNonEmptySignatureIndices = (signatures: string[]): number[] => {
	const indices: number[] = [];

	for (let index = 0; index < signatures.length; index++) {
		const signature = signatures[index];

		if (signature === null || signature.length === 0) {
			indices.push(index);
		}
	}

	return indices;
};

export const isTransactionFullySigned = (senderWallet: Contracts.WalletData, transaction: any) => {
	const moduleAssetId = joinModuleAndAssetIds(transaction);
	const isMultiSignatureRegistration = moduleAssetId === "4:0";
	const keys = getKeys({ senderWallet, transaction, isMultiSignatureRegistration });

	const required = getNumbersOfSignaturesRequired({ keys, isMultiSignatureRegistration });
	const alreadySigned = getNonEmptySignatures(transaction.signatures).length;

	return required === alreadySigned;
};

export const isMember = (senderWallet, account, transaction) => {
	let mandatoryKeys: string[] = [];
	let optionalKeys: string[] = [];

	if (transaction.moduleAssetId === "4:0") {
		mandatoryKeys = transaction.asset.mandatoryKeys;
		optionalKeys = transaction.asset.optionalKeys;
	} else {
		mandatoryKeys = senderWallet.keys.mandatoryKeys;
		optionalKeys = senderWallet.keys.optionalKeys;
	}

	if (mandatoryKeys.includes(account.summary.publicKey)) {
		return true;
	}

	if (optionalKeys.includes(account.summary.publicKey)) {
		return true;
	}

	return false;
};

export const convertBuffer = (value: Buffer): string => value.toString("hex");
export const convertBufferList = (values: Buffer[]): string[] => values.map(convertBuffer);

export const convertString = (value: string): Buffer => Buffer.from(value, "hex");
export const convertStringList = (values: string[]): Buffer[] => values.map(convertString);
