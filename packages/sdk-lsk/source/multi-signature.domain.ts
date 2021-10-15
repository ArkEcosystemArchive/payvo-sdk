export const joinModuleAndAssetIds = ({ moduleID, assetID }) => [moduleID, assetID].join(":");

export const getKeys = ({ senderWallet, transaction, isMultiSignatureRegistration }) => {
	if (isMultiSignatureRegistration) {
		return transaction.asset;
	}

	return senderWallet.multiSignature();
};
