import { convertBufferList, convertStringList } from "@payvo/helpers";
import {
	MultiSignatureAsset,
	MultiSignatureRegistrationTransaction,
	MultiSignatureTransaction,
} from "./multi-signature.contract";
import * as bitcoin from "bitcoinjs-lib";

export class PendingMultiSignatureTransaction {
	readonly #transaction: MultiSignatureTransaction;
	readonly #multiSignature: MultiSignatureAsset;

	public constructor(transaction: MultiSignatureTransaction) {
		this.#transaction = transaction;
		this.#multiSignature = transaction.multiSignature;
	}

	public isMultiSignatureRegistration(): boolean {
		return "signatures" in this.#transaction;
	}

	public isMultiSignatureReady({ excludeFinal }: { excludeFinal?: boolean }): boolean {
		if (this.needsSignatures()) {
			return false;
		}

		if (!excludeFinal && this.isMultiSignatureRegistration() && this.needsFinalSignature()) {
			return false;
		}

		return true;
	}

	public needsSignatures(): boolean {
		if (this.isMultiSignatureRegistration()) {
			return this.needsAllSignatures();
		}

		return this.getValidMultiSignatures().length < this.#multiSignature.numberOfSignatures;
	}

	public needsAllSignatures(): boolean {
		return this.getValidMultiSignatures().length < this.#multiSignature.publicKeys.length;
	}

	public needsWalletSignature(publicKey: string): boolean {
		if (!this.needsSignatures() && !this.needsFinalSignature()) {
			return false;
		}

		if (this.isMultiSignatureRegistration() && this.isMultiSignatureReady({ excludeFinal: true })) {
			return this.#transaction.senderPublicKey === publicKey && this.needsFinalSignature();
		}

		// const index: number = [...this.#multiSignature.mandatoryKeys, ...this.#multiSignature.optionalKeys].indexOf(
		// 	publicKey,
		// );
		//
		// if (index === -1) {
		// 	return false;
		// }

		return this.#transaction.signatures[index] === undefined;
	}

	public needsFinalSignature(): boolean {
		return false;
	}

	public getValidMultiSignatures(): string[] {
		if (
			"signatures" in this.#transaction &&
			(!this.#transaction.signatures || !this.#transaction.signatures.length)
		) {
			return [];
		}

		if ("psbt" in this.#transaction && this.#transaction.psbt !== undefined) {
			const psbt = bitcoin.Psbt.fromBase64(this.#transaction.psbt, {
				// network:
			});
			// return psbt.validateSignaturesOfAllInputs();
		}

		// // Convert and sort the participant keys
		// const mandatoryKeys: Buffer[] = convertStringList(this.#multiSignature.mandatoryKeys);
		// mandatoryKeys.sort((a: Buffer, b: Buffer) => a.compare(b));
		//
		// const optionalKeys: Buffer[] = convertStringList(this.#multiSignature.optionalKeys);
		// optionalKeys.sort((a: Buffer, b: Buffer) => a.compare(b));

		// Iterate over all participant keys and check who has a signature set already
		const result: Buffer[] = [];

		// for (const participant of convertStringList([
		// 	...this.#multiSignature.mandatoryKeys,
		// 	...this.#multiSignature.optionalKeys,
		// ])) {
		// 	const mandatoryKeyIndex: number = mandatoryKeys.findIndex((publicKey: Buffer) =>
		// 		publicKey.equals(participant),
		// 	);
		// 	const optionalKeyIndex: number = optionalKeys.findIndex((publicKey: Buffer) =>
		// 		publicKey.equals(participant),
		// 	);
		// 	const signatureOffset: number = this.isMultiSignatureRegistration() ? 1 : 0;
		//
		// 	if (mandatoryKeyIndex !== -1) {
		// 		if (this.#transaction.signatures[mandatoryKeyIndex + signatureOffset]) {
		// 			result.push(participant);
		// 		}
		// 	}
		//
		// 	if (optionalKeyIndex !== -1) {
		// 		if (this.#transaction.signatures[mandatoryKeys.length + optionalKeyIndex + signatureOffset]) {
		// 			result.push(participant);
		// 		}
		// 	}
		// }

		return convertBufferList(result);
	}

	public remainingSignatureCount(): number {
		let numberOfSignatures = this.isMultiSignatureRegistration()
			? this.#multiSignature.numberOfSignatures
			: this.#multiSignature.min;

		return numberOfSignatures - this.#transaction.signatures.filter(Boolean).length;
	}
}
