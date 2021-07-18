import { getLisk32AddressFromAddress } from "@liskhq/lisk-cryptography";
import { getBytes } from "@liskhq/lisk-transactions-beta";
import { Coins, Contracts, IoC } from "@payvo/sdk";
import { convertBufferList, convertString, convertStringList, joinModuleAndAssetIds } from "./multi-signature.domain";

@IoC.injectable()
export class BroadcastSerializer {
	@IoC.inject(IoC.BindingType.ConfigRepository)
	protected readonly configRepository!: Coins.ConfigRepository;

	public serialize(transaction: Contracts.RawTransactionData): string {
		const assetKey = {
			"2:0": "token:transfer",
			"4:0": "keys:registerMultisignatureGroup",
			"5:0": "dpos:registerDelegate",
			"5:1": "dpos:voteDelegate",
			"5:2": "dpos:unlockToken",
			"5:3": "dpos:reportDelegateMisbehavior",
			"1000:0": "legacyAccount:reclaimLSK",
		}[joinModuleAndAssetIds(transaction.data())];

		if (!assetKey) {
			throw new Error("Failed to determine the transaction type.");
		}

		const { assetSchema } = this.configRepository.get<object>("network.meta.assets")[assetKey];

		const mutated = {
			...transaction,
			fee: BigInt(transaction.fee),
			id: convertString(transaction.id),
			nonce: BigInt(transaction.nonce),
			senderPublicKey: convertString(transaction.senderPublicKey),
			signatures: convertStringList(transaction.signatures),
		};

		// Transfer
		if (mutated.moduleID === 2 && mutated.assetID === 0) {
			mutated.asset.amount = BigInt(mutated.asset.amount);
			mutated.asset.recipientAddress = getLisk32AddressFromAddress(mutated.asset.recipientAddress);
		}

		// MuSig Registration
		if (mutated.moduleID === 4 && mutated.assetID === 0) {
			mutated.asset.numberOfSignatures = mutated.asset.numberOfSignatures;
			mutated.asset.mandatoryKeys = convertBufferList(mutated.asset.mandatoryKeys);
			mutated.asset.optionalKeys = convertBufferList(mutated.asset.optionalKeys);
		}

		// Delegate Registration
		if (mutated.moduleID === 5 && mutated.assetID === 0) {
			mutated.asset.username = mutated.asset.username;
		}

		// Vote
		if (mutated.moduleID === 5 && mutated.assetID === 1) {
			mutated.asset.votes = mutated.asset.votes.map(({ delegateAddress, amount }) => ({
				delegateAddress: getLisk32AddressFromAddress(delegateAddress),
				amount: amount.toString(),
			}));
		}

		delete mutated.multiSignature;

		return getBytes(assetSchema, mutated).toString("hex");
	}
}
