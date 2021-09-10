type TransactionData = Record<string, any>;

const isLegacy = (data: Record<string, unknown>): boolean => data.moduleAssetName === undefined;

export class TransactionTypeService {
	public static isTransfer(data: TransactionData): boolean {
		if (isLegacy(data)) {
			return parseInt(data.type) === 0;
		}

		return data.moduleAssetName === "token:transfer";
	}

	public static isSecondSignature(data: TransactionData): boolean {
		if (isLegacy(data)) {
			return parseInt(data.type) === 1;
		}

		return false;
	}

	public static isDelegateRegistration(data: TransactionData): boolean {
		if (isLegacy(data)) {
			return parseInt(data.type) === 2;
		}

		return data.moduleAssetName === "dpos:registerDelegate";
	}

	public static isVoteCombination(data: TransactionData): boolean {
		return this.isVote(data) && this.isUnvote(data);
	}

	public static isVote(data: TransactionData): boolean {
		if (isLegacy(data)) {
			if (parseInt(data.type) !== 3) {
				return false;
			}

			return data.asset.votes.some((vote) => vote.startsWith("+"));
		}

		if (data.moduleAssetName !== "dpos:voteDelegate") {
			return false;
		}

		return data.asset.votes.some(({ amount }) => !amount.startsWith("-"));
	}

	public static isUnvote(data: TransactionData): boolean {
		if (isLegacy(data)) {
			if (parseInt(data.type) !== 3) {
				return false;
			}

			return data.asset.votes.some((vote) => vote.startsWith("-"));
		}

		if (data.moduleAssetName !== "dpos:voteDelegate") {
			return false;
		}

		return data.asset.votes.some(({ amount }) => amount.startsWith("-"));
	}

	public static isMultiSignatureRegistration(data: TransactionData): boolean {
		if (isLegacy(data)) {
			return parseInt(data.type) === 4;
		}

		return data.moduleAssetName === "keys:registerMultisignatureGroup";
	}
}
