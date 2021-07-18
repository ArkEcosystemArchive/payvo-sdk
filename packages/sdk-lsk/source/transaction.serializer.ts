import { getAddressFromBase32Address, getLisk32AddressFromAddress } from "@liskhq/lisk-cryptography";
import { getBytes } from "@liskhq/lisk-transactions-beta";
import { Coins, Contracts, IoC } from "@payvo/sdk";
import { isDelegateRegistration, isMultiSignatureRegistration, isTransfer, isVote } from "./helpers";
import {
	convertBuffer,
	convertBufferList,
	convertString,
	convertStringList,
	joinModuleAndAssetIds,
} from "./multi-signature.domain";

@IoC.injectable()
export class TransactionSerializer {
	@IoC.inject(IoC.BindingType.ConfigRepository)
	protected readonly configRepository!: Coins.ConfigRepository;

	public toMachine(transaction: Contracts.RawTransactionData): Record<string, unknown> {
		const mutated = {
			...transaction,
			fee: BigInt(transaction.fee),
			id: convertString(transaction.id),
			nonce: BigInt(transaction.nonce),
			senderPublicKey: convertString(transaction.senderPublicKey),
			signatures: convertStringList(transaction.signatures),
		};

		if (isTransfer(mutated)) {
			mutated.asset.amount = BigInt(mutated.asset.amount);
			mutated.asset.recipientAddress = getAddressFromBase32Address(mutated.asset.recipientAddress);
			mutated.asset.data = convertString(mutated.asset.data ?? "");
		}

		if (isMultiSignatureRegistration(mutated)) {
			mutated.asset.numberOfSignatures = mutated.asset.numberOfSignatures;
			mutated.asset.mandatoryKeys = convertBufferList(mutated.asset.mandatoryKeys);
			mutated.asset.optionalKeys = convertBufferList(mutated.asset.optionalKeys);
		}

		if (isDelegateRegistration(mutated)) {
			mutated.asset.username = mutated.asset.username;
		}

		if (isVote(mutated)) {
			mutated.asset.votes = mutated.asset.votes.map(({ delegateAddress, amount }) => ({
				delegateAddress: getAddressFromBase32Address(delegateAddress),
				amount: amount.toString(),
			}));
		}

		if (mutated.multiSignature) {
			delete mutated.multiSignature;
		}

		return mutated;
	}

	public toHuman(
		transaction: Contracts.RawTransactionData,
		keys?: Record<string, string[]>,
	): Record<string, unknown> {
		const mutated = {
			...transaction,
			fee: transaction.fee.toString(),
			id: convertBuffer(transaction.id),
			nonce: transaction.nonce.toString(),
			senderPublicKey: convertBuffer(transaction.senderPublicKey),
			signatures: convertBufferList(transaction.signatures),
		};

		if (isTransfer(mutated)) {
			mutated.asset.amount = mutated.asset.amount.toString();
			mutated.asset.recipientAddress = getLisk32AddressFromAddress(mutated.asset.recipientAddress);
			mutated.asset.data = convertBuffer(mutated.asset.data ?? "");
		}

		if (isMultiSignatureRegistration(mutated)) {
			mutated.asset.numberOfSignatures = mutated.asset.numberOfSignatures;
			mutated.asset.mandatoryKeys = convertBufferList(keys?.mandatoryKeys ?? mutated.asset.mandatoryKeys);
			mutated.asset.optionalKeys = convertBufferList(keys?.optionalKeys ?? mutated.asset.optionalKeys);
		}

		if (isDelegateRegistration(mutated)) {
			mutated.asset.username = mutated.asset.username;
		}

		if (isVote(mutated)) {
			mutated.asset.votes = mutated.asset.votes.map(({ delegateAddress, amount }) => ({
				delegateAddress: getLisk32AddressFromAddress(delegateAddress),
				amount: amount.toString(),
			}));
		}

		return mutated;
	}

	public toString(transaction: Contracts.RawTransactionData): string {
		const assetKey = {
			"2:0": "token:transfer",
			"4:0": "keys:registerMultisignatureGroup",
			"5:0": "dpos:registerDelegate",
			"5:1": "dpos:voteDelegate",
			"5:2": "dpos:unlockToken",
			"5:3": "dpos:reportDelegateMisbehavior",
			"1000:0": "legacyAccount:reclaimLSK",
		}[joinModuleAndAssetIds(transaction)];

		if (!assetKey) {
			throw new Error("Failed to determine the transaction type.");
		}

		return getBytes(
			this.configRepository.get<object>("network.meta.assets")[assetKey].assetSchema,
			this.toMachine(transaction),
		).toString("hex");
	}
}
