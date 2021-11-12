import { convertBufferList, convertStringList } from "@payvo/sdk-helpers";
import { MultiSignatureAsset, MultiSignatureTransaction } from "./multi-signature.contract";

export class PendingMultiSignatureTransaction {
	readonly #transaction: MultiSignatureTransaction;
	readonly #multiSignature: MultiSignatureAsset;

	public constructor(transaction: MultiSignatureTransaction) {
		this.#transaction = transaction;
		this.#multiSignature = transaction.multiSignature;
	}

	public isMultiSignature(): boolean {
		return Array.isArray(this.#transaction.signatures);
	}

	public isMultiSignatureRegistration(): boolean {
		return this.#transaction.moduleID === 4 && this.#transaction.assetID === 0;
	}

	public isMultiSignatureReady({ excludeFinal }: { excludeFinal?: boolean }): boolean {
		if (this.isMultiSignatureRegistration()) {
			return (
				this.#transaction.signatures.filter(Boolean).length ===
				this.#multiSignature.numberOfSignatures + (excludeFinal ? 0 : 1)
			);
		}

		if (this.needsSignatures()) {
			return false;
		}

		return true;
	}

	public needsSignatures(): boolean {
		if (!this.isMultiSignature()) {
			return false;
		}

		if (this.isMultiSignatureRegistration()) {
			return this.needsAllSignatures();
		}

		return this.#getValidMultiSignatures().length < this.#multiSignature.numberOfSignatures;
	}

	public needsAllSignatures(): boolean {
		if (this.isMultiSignatureRegistration()) {
			return this.#getValidMultiSignatures().length < this.#publicKeys().length;
		}

		return this.#getValidMultiSignatures().length < this.#multiSignature.mandatoryKeys.length;
	}

	public needsWalletSignature(publicKey: string): boolean {
		if (!this.isMultiSignature()) {
			return false;
		}

		if (!this.needsSignatures() && !this.needsFinalSignature()) {
			return false;
		}

		if (!this.#publicKeys().includes(publicKey)) {
			return false;
		}

		return !this.#getValidMultiSignatures().includes(publicKey);
	}

	public needsFinalSignature(): boolean {
		if (!this.isMultiSignature()) {
			return false;
		}

		if (this.isMultiSignatureRegistration()) {
			return this.#getValidMultiSignatures().length < this.#publicKeys().length;
		}

		return this.#getValidMultiSignatures().length < this.#multiSignature.numberOfSignatures;
	}

	public remainingSignatureCount(): number {
		let numberOfSignatures: number = this.#multiSignature.numberOfSignatures;

		if (this.isMultiSignatureRegistration()) {
			numberOfSignatures =
				this.#multiSignature.mandatoryKeys.length + this.#multiSignature.optionalKeys.length + 1;
		}

		return numberOfSignatures - this.#transaction.signatures.filter(Boolean).length;
	}

	#getValidMultiSignatures(): string[] {
		if (!this.isMultiSignature()) {
			return [];
		}

		if (!this.#transaction.signatures.length) {
			return [];
		}

		// Convert and sort the participant keys
		const mandatoryKeys: Buffer[] = convertStringList(this.#multiSignature.mandatoryKeys);
		mandatoryKeys.sort((a: Buffer, b: Buffer) => a.compare(b));

		const optionalKeys: Buffer[] = convertStringList(this.#multiSignature.optionalKeys);
		optionalKeys.sort((a: Buffer, b: Buffer) => a.compare(b));

		// Iterate over all participant keys and check who has a signature set already
		const result: Buffer[] = [];

		for (const participant of convertStringList([
			...this.#multiSignature.mandatoryKeys,
			...this.#multiSignature.optionalKeys,
		])) {
			const mandatoryKeyIndex: number = mandatoryKeys.findIndex((publicKey: Buffer) =>
				publicKey.equals(participant),
			);
			const optionalKeyIndex: number = optionalKeys.findIndex((publicKey: Buffer) =>
				publicKey.equals(participant),
			);
			const signatureOffset: number = this.isMultiSignatureRegistration() ? 1 : 0;

			if (mandatoryKeyIndex !== -1) {
				if (this.#transaction.signatures[mandatoryKeyIndex + signatureOffset]) {
					result.push(participant);
				}
			}

			if (optionalKeyIndex !== -1) {
				if (this.#transaction.signatures[mandatoryKeys.length + optionalKeyIndex + signatureOffset]) {
					result.push(participant);
				}
			}
		}

		return convertBufferList(result);
	}

	#publicKeys(): string[] {
		return [...this.#multiSignature.mandatoryKeys, ...this.#multiSignature.optionalKeys];
	}
}
