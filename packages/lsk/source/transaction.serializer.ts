import { getAddressFromBase32Address, getLisk32AddressFromAddress } from "@liskhq/lisk-cryptography";
import { getBytes } from "@liskhq/lisk-transactions";
import { convertBuffer, convertBufferList, convertString, convertStringList } from "@payvo/sdk-helpers";
import { Coins, Contracts, IoC, Services } from "@payvo/sdk";
import { isDelegateRegistration, isMultiSignatureRegistration, isTransfer, isUnlockToken, isVote } from "./helpers.js";
import { joinModuleAndAssetIds } from "./multi-signature.domain.js";

export class TransactionSerializer {
	readonly #configRepository!: Coins.ConfigRepository;
	readonly #bigNumberService!: Services.BigNumberService;

	public constructor(container: IoC.IContainer) {
		this.#configRepository = container.get(IoC.BindingType.ConfigRepository);
		this.#bigNumberService = container.get(IoC.BindingType.BigNumberService);
	}

	public toMachine(transaction: Contracts.RawTransactionData): Record<string, unknown> {
		const mutated = {
			...transaction,
			fee: BigInt(transaction.fee ?? 0),
			nonce: BigInt(transaction.nonce),
			senderPublicKey: convertString(transaction.senderPublicKey),
		};

		if (transaction.id) {
			mutated.id = convertString(transaction.id);
		}

		if (transaction.signatures) {
			mutated.signatures = convertStringList(transaction.signatures);
		}

		if (isTransfer(transaction)) {
			mutated.asset.amount = BigInt(transaction.asset.amount);
			mutated.asset.recipientAddress = getAddressFromBase32Address(transaction.asset.recipientAddress);
			mutated.asset.data = transaction.asset.data ?? "";
		}

		if (isMultiSignatureRegistration(transaction)) {
			mutated.asset.numberOfSignatures = transaction.asset.numberOfSignatures;
			mutated.asset.mandatoryKeys = convertStringList(transaction.asset.mandatoryKeys);
			mutated.asset.optionalKeys = convertStringList(transaction.asset.optionalKeys);
		}

		if (isDelegateRegistration(transaction)) {
			mutated.asset.username = transaction.asset.username;
		}

		if (isVote(transaction)) {
			mutated.asset.votes = transaction.asset.votes.map(({ delegateAddress, amount }) => ({
				delegateAddress: getAddressFromBase32Address(delegateAddress),
				amount: this.#normaliseVoteAmount(amount),
			}));
		}

		if (isUnlockToken(transaction)) {
			mutated.asset.unlockObjects = transaction.asset.unlockObjects.map(
				({ delegateAddress, amount, unvoteHeight }) => ({
					delegateAddress: getAddressFromBase32Address(delegateAddress),
					amount: BigInt(amount),
					unvoteHeight: Number(unvoteHeight),
				}),
			);
		}

		if (transaction.multiSignature) {
			delete mutated.multiSignature;
		}

		return mutated;
	}

	public toHuman(
		transaction: Contracts.RawTransactionData,
		keys?: Record<string, Buffer[]>,
	): Record<string, unknown> {
		const mutated = {
			...transaction,
			fee: transaction.fee.toString(),
			nonce: transaction.nonce.toString(),
			senderPublicKey: convertBuffer(transaction.senderPublicKey),
		};

		if (transaction.id) {
			mutated.id = convertBuffer(transaction.id);
		}

		if (transaction.signatures) {
			mutated.signatures = convertBufferList(transaction.signatures);
		}

		if (isTransfer(transaction)) {
			mutated.asset.amount = transaction.asset.amount.toString();
			mutated.asset.recipientAddress = this.#convertAddress(transaction.asset.recipientAddress);
			mutated.asset.data = convertBuffer(transaction.asset.data ?? "");
		}

		if (isMultiSignatureRegistration(transaction)) {
			mutated.asset.numberOfSignatures = transaction.asset.numberOfSignatures;
			mutated.asset.mandatoryKeys = convertBufferList(keys?.mandatoryKeys ?? transaction.asset.mandatoryKeys);
			mutated.asset.optionalKeys = convertBufferList(keys?.optionalKeys ?? transaction.asset.optionalKeys);
		}

		if (isDelegateRegistration(transaction)) {
			mutated.asset.username = transaction.asset.username;
		}

		if (isVote(transaction)) {
			mutated.asset.votes = transaction.asset.votes.map(({ delegateAddress, amount }) => ({
				delegateAddress: this.#convertAddress(delegateAddress),
				amount: amount.toString(),
			}));
		}

		if (isUnlockToken(mutated)) {
			mutated.asset.unlockObjects = mutated.asset.unlockObjects.map(
				({ delegateAddress, amount, unvoteHeight }) => ({
					delegateAddress: this.#convertAddress(delegateAddress),
					amount: amount.toString(),
					unvoteHeight: Number(unvoteHeight),
				}),
			);
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
			this.#configRepository.get<object>("network.meta.assets")[assetKey].assetSchema,
			this.toMachine(this.toHuman(transaction)),
		).toString("hex");
	}

	#convertAddress(address: string | Buffer): string {
		if (Buffer.isBuffer(address)) {
			return getLisk32AddressFromAddress(address);
		}

		return getLisk32AddressFromAddress(getAddressFromBase32Address(address));
	}

	#normaliseVoteAmount(value: string): BigInt {
		if (this.#bigNumberService.make(value).denominated().toNumber() % 10 === 0) {
			return BigInt(value);
		}

		throw new Error(`The value [${value}] is not a multiple of 10.`);
	}
}
