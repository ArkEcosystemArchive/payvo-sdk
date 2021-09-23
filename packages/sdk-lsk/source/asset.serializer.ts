import { getAddressFromBase32Address, getBase32AddressFromAddress } from "@liskhq/lisk-cryptography";
import { convertStringList } from "@payvo/helpers";
import { IoC, Services } from "@payvo/sdk";
import { isDelegateRegistration, isMultiSignatureRegistration, isTransfer, isUnlockToken, isVote } from "./helpers";

@IoC.injectable()
export class AssetSerializer {
	@IoC.inject(IoC.BindingType.BigNumberService)
	protected readonly bigNumberService!: Services.BigNumberService;

	public toMachine(moduleID: string, assetID: string, asset: Record<string, any>): Record<string, unknown> {
		if (isTransfer({ assetID, moduleID })) {
			return {
				amount: BigInt(this.bigNumberService.make(asset.amount).toSatoshi().toString()),
				recipientAddress: getAddressFromBase32Address(asset.recipientAddress),
				data: asset.data ?? "",
			};
		}

		if (isMultiSignatureRegistration({ assetID, moduleID })) {
			return {
				numberOfSignatures: asset.numberOfSignatures,
				mandatoryKeys: convertStringList(asset.mandatoryKeys),
				optionalKeys: convertStringList(asset.optionalKeys),
			};
		}

		if (isDelegateRegistration({ assetID, moduleID })) {
			return {
				username: asset.username,
			};
		}

		if (isVote({ assetID, moduleID })) {
			return {
				votes: asset.votes.map(({ delegateAddress, amount }: { delegateAddress: string; amount: number }) => ({
					delegateAddress: getAddressFromBase32Address(delegateAddress),
					amount: this.#normaliseVoteAmount(amount),
				})),
			};
		}

		if (isUnlockToken({ assetID, moduleID })) {
			return {
				unlockObjects: asset.unlockObjects.map(({ delegateAddress, amount, unvoteHeight }) => ({
					delegateAddress: getAddressFromBase32Address(delegateAddress),
					amount: BigInt(amount.toString()),
					unvoteHeight: Number(unvoteHeight),
				})),
			};
		}

		throw new Error("Failed to determine transaction type for asset serialization.");
	}

	#normaliseVoteAmount(value: number): BigInt {
		if (value % 10 === 0) {
			return BigInt(this.bigNumberService.make(value).toSatoshi().toString());
		}

		throw new Error(`The value [${value}] is not a multiple of 10.`);
	}
}
