type TransactionData = Record<string, any>;

const isTest = (data: Record<string, unknown>): boolean => data.moduleAssetName !== undefined;

export class TransactionTypeService {
	public static isTransfer(data: TransactionData): boolean {
		if (isTest(data)) {
			return data.moduleAssetName === "token:transfer";
		}

		return parseInt(data.type) === 0;
	}

	public static isSecondSignature(data: TransactionData): boolean {
		if (isTest(data)) {
			return false;
		}

		return parseInt(data.type) === 1;
	}

	public static isDelegateRegistration(data: TransactionData): boolean {
		if (isTest(data)) {
			return data.moduleAssetName === "dpos:registerDelegate";
		}

		return parseInt(data.type) === 2;
	}

	public static isVoteCombination(data: TransactionData): boolean {
		return this.isVote(data) && this.isUnvote(data);
	}

	public static isVote(data: TransactionData): boolean {
		if (isTest(data)) {
			if (data.moduleAssetName !== "dpos:voteDelegate") {
				return false;
			}

			return data.asset.votes.some(({ amount }) => amount.startsWith("+"));
		}

		if (parseInt(data.type) !== 3) {
			return false;
		}

		return data.asset.votes.some((vote) => vote.startsWith("+"));
	}

	public static isUnvote(data: TransactionData): boolean {
		if (isTest(data)) {
			if (data.moduleAssetName !== "dpos:voteDelegate") {
				return false;
			}

			return data.asset.votes.some(({ amount }) => amount.startsWith("-"));
		}

		if (parseInt(data.type) !== 3) {
			return false;
		}

		return data.asset.votes.some((vote) => vote.startsWith("-"));
	}

	public static isMultiSignatureRegistration(data: TransactionData): boolean {
		if (isTest(data)) {
			return data.moduleAssetName === "keys:registerMultisignatureGroup";
		}

		return parseInt(data.type) === 4;
	}
}
