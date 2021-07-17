import { MultiSignatureTransaction } from "./multi-signature.contract";
import { convertStringList } from "./multi-signature.domain";

export class PendingMultiSignatureTransaction {
	readonly #transaction: MultiSignatureTransaction;

	public constructor(transaction: MultiSignatureTransaction) {
		this.#transaction = transaction;
	}

	public isMultiSignature(): boolean {
		if (this.isMultiSignatureRegistration()) {
			return false;
		}

		return Array.isArray(this.#transaction.signatures);
	}

	public isMultiSignatureRegistration(): boolean {
		return this.#transaction.moduleID === 4 && this.#transaction.assetID === 0;
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
		if (!this.isMultiSignature()) {
			return false;
		}

		if (this.isMultiSignatureRegistration()) {
			return this.needsAllSignatures();
		}

		return this.getValidMultiSignatures().length < this.#transaction.multiSignature.numberOfSignatures;
	}

	public needsAllSignatures(): boolean {
		return this.getValidMultiSignatures().length < this.#transaction.multiSignature.mandatoryKeys.length;
	}

	public needsWalletSignature(publicKey: string): boolean {
		if (!this.needsSignatures() && !this.needsFinalSignature()) {
			return false;
		}

		if (this.isMultiSignatureRegistration() && this.isMultiSignatureReady({ excludeFinal: true })) {
			return this.#transaction.senderPublicKey === publicKey && this.needsFinalSignature();
		}

		if (!this.isMultiSignature()) {
			return false;
		}

		const index: number = [
			...this.#transaction.multiSignature.mandatoryKeys,
			...this.#transaction.multiSignature.optionalKeys,
		].indexOf(publicKey);

		if (index === -1) {
			return false;
		}

		if (!this.#transaction.signatures) {
			return true;
		}

		return !this.#transaction.signatures.find(
			(signature: string) => parseInt(signature.substring(0, 2), 16) === index,
		);
	}

	public needsFinalSignature(): boolean {
		if (this.isMultiSignature() && !this.isMultiSignatureRegistration()) {
			return false;
		}

		return (
			this.#transaction.signatures.filter(
				(element: string, index: number, array: string[]) => array.indexOf(element) !== index,
			).length < 2
		);
	}

	public getValidMultiSignatures(): string[] {
		if (!this.isMultiSignature()) {
			return [];
		}

		if (!this.#transaction.signatures || !this.#transaction.signatures.length) {
			return [];
		}

		// Convert and sort the participant keys
		const mandatoryKeys: Buffer[] = convertStringList(this.#transaction.multiSignature.mandatoryKeys);
		mandatoryKeys.sort((a: Buffer, b: Buffer) => a.compare(b));

		const optionalKeys: Buffer[] = convertStringList(this.#transaction.multiSignature.optionalKeys);
		optionalKeys.sort((a: Buffer, b: Buffer) => a.compare(b));

		// Iterate over all participant keys and check who has a signature set already
		const result: string[] = [];

		for (const participant of [
			...this.#transaction.multiSignature.mandatoryKeys,
			...this.#transaction.multiSignature.optionalKeys,
		]) {
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

		return result;
	}

	public remainingSignatureCount(): number {
		let numberOfSignatures: number = this.#transaction.multiSignature.numberOfSignatures;

		if (this.isMultiSignatureRegistration()) {
			numberOfSignatures =
				this.#transaction.multiSignature.mandatoryKeys.length +
				this.#transaction.multiSignature.optionalKeys.length +
				1;
		}

		return numberOfSignatures - this.#transaction.signatures.length;
	}
}
