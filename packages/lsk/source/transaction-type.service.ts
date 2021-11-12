type TransactionData = Record<string, any>;

export class TransactionTypeService {
	public static isTransfer(data: TransactionData): boolean {
		return data.moduleAssetName === "token:transfer";
	}

	public static isSecondSignature(data: TransactionData): boolean {
		return false;
	}

	public static isDelegateRegistration(data: TransactionData): boolean {
		return data.moduleAssetName === "dpos:registerDelegate";
	}

	public static isVoteCombination(data: TransactionData): boolean {
		return this.isVote(data) && this.isUnvote(data);
	}

	public static isVote(data: TransactionData): boolean {
		if (data.moduleAssetName !== "dpos:voteDelegate") {
			return false;
		}

		return data.asset.votes.some(({ amount }) => !amount.startsWith("-"));
	}

	public static isUnvote(data: TransactionData): boolean {
		if (data.moduleAssetName !== "dpos:voteDelegate") {
			return false;
		}

		return data.asset.votes.some(({ amount }) => amount.startsWith("-"));
	}

	public static isMultiSignatureRegistration(data: TransactionData): boolean {
		return data.moduleAssetName === "keys:registerMultisignatureGroup";
	}

	public static isUnlockToken(data: TransactionData): boolean {
		return data.moduleAssetName === "dpos:unlockToken";
	}
}
