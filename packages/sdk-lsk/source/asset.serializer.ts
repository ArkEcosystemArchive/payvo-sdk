import { getAddressFromBase32Address } from "@liskhq/lisk-cryptography";
import { IoC, Services } from "@payvo/sdk";
import { isDelegateRegistration, isMultiSignatureRegistration, isTransfer, isVote } from "./helpers";
import { convertStringList } from "./multi-signature.domain";

@IoC.injectable()
export class AssetSerializer {
	@IoC.inject(IoC.BindingType.BigNumberService)
	protected readonly bigNumberService!: Services.BigNumberService;

	public toMachine(moduleID: string, assetID: string, asset: Record<string, any>): Record<string, unknown> {
		if (isTransfer({ assetID, moduleID })) {
			return {
				amount: BigInt(`${asset.amount}`),
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
				votes: asset.votes.map(({ delegateAddress, amount }) => ({
					delegateAddress: getAddressFromBase32Address(delegateAddress),
					amount: this.#normaliseVoteAmount(amount),
				})),
			};
		}

		throw new Error("Failed to determine transaction type for asset serialization.");
	}

	#normaliseVoteAmount(value: number): BigInt {
		const human: number = this.bigNumberService.make(value).denominated().toNumber();

		if (typeof human === "number" && !isNaN(human)) {
			if (Number.isInteger(human)) {
				if (human % 10 === 0) {
					return BigInt(this.bigNumberService.make(value).toSatoshi().toString());
				}
			}
		}

		throw new Error(`The value [${human}] is not a multiple of 10.`);
	}
}