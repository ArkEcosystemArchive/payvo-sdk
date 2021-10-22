import { MultiSignatureAsset, MultiSignatureTransaction } from "./multi-signature.contract";
import * as bitcoin from "bitcoinjs-lib";
import { isMultiSignatureRegistration } from "./multi-signature.domain";

export class PendingMultiSignatureTransaction {
	readonly #transaction: MultiSignatureTransaction;
	readonly #multiSignature: MultiSignatureAsset;
	readonly #network: bitcoin.networks.Network;

	public constructor(transaction: MultiSignatureTransaction, network: bitcoin.networks.Network) {
		this.#transaction = { ...transaction };
		this.#multiSignature = { ...transaction.multiSignature };
		this.#network = network;
	}

	public isMultiSignatureRegistration(): boolean {
		return isMultiSignatureRegistration(this.#transaction);
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
			return this.#transaction.signatures.length < this.#multiSignature.numberOfSignatures;
		}

		return true;
		const psbt = bitcoin.Psbt.fromBase64(this.#transaction.psbt!, { network: this.#network });
		console.log(psbt.data.globalMap);
		console.log(JSON.stringify(psbt, null, 2));
		console.log(psbt.toHex());
		console.log(psbt.toBase64());
		return psbt.validateSignaturesOfAllInputs();
		// return this.getValidMultiSignatures().length < this.#multiSignature.numberOfSignatures;
	}

	public needsAllSignatures(): boolean {
		if (this.isMultiSignatureRegistration()) {
			return this.#transaction.signatures.length === 0;
		}

		const psbt = bitcoin.Psbt.fromBase64(this.#transaction.psbt!, { network: this.#network });
		return psbt.validateSignaturesOfAllInputs();
		// return this.getValidMultiSignatures().length < this.#multiSignature.publicKeys.length;
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

		// return this.#transaction.signatures[index] === undefined;
		return true;
	}

	public needsFinalSignature(): boolean {
		return false;
	}

	// public getValidMultiSignatures(): string[] {
	// 	if (!this.#transaction.signatures || !this.#transaction.signatures.length) {
	// 		return [];
	// 	}
	//
	// 	if (!isMultiSignatureRegistration(this.#transaction)) {
	// 		const psbt = bitcoin.Psbt.fromBase64(this.#transaction.psbt!, {
	// 			network: this.#network,
	// 		});
	// 		// return psbt.validateSignaturesOfAllInputs();
	// 	}
	//
	// 	// // Convert and sort the participant keys
	// 	// const mandatoryKeys: Buffer[] = convertStringList(this.#multiSignature.mandatoryKeys);
	// 	// mandatoryKeys.sort((a: Buffer, b: Buffer) => a.compare(b));
	// 	//
	// 	// const optionalKeys: Buffer[] = convertStringList(this.#multiSignature.optionalKeys);
	// 	// optionalKeys.sort((a: Buffer, b: Buffer) => a.compare(b));
	//
	// 	// Iterate over all participant keys and check who has a signature set already
	// 	const result: Buffer[] = [];
	//
	// 	// for (const participant of convertStringList([
	// 	// 	...this.#multiSignature.mandatoryKeys,
	// 	// 	...this.#multiSignature.optionalKeys,
	// 	// ])) {
	// 	// 	const mandatoryKeyIndex: number = mandatoryKeys.findIndex((publicKey: Buffer) =>
	// 	// 		publicKey.equals(participant),
	// 	// 	);
	// 	// 	const optionalKeyIndex: number = optionalKeys.findIndex((publicKey: Buffer) =>
	// 	// 		publicKey.equals(participant),
	// 	// 	);
	// 	// 	const signatureOffset: number = this.isMultiSignatureRegistration() ? 1 : 0;
	// 	//
	// 	// 	if (mandatoryKeyIndex !== -1) {
	// 	// 		if (this.#transaction.signatures[mandatoryKeyIndex + signatureOffset]) {
	// 	// 			result.push(participant);
	// 	// 		}
	// 	// 	}
	// 	//
	// 	// 	if (optionalKeyIndex !== -1) {
	// 	// 		if (this.#transaction.signatures[mandatoryKeys.length + optionalKeyIndex + signatureOffset]) {
	// 	// 			result.push(participant);
	// 	// 		}
	// 	// 	}
	// 	// }
	//
	// 	return convertBufferList(result);
	// }

	public remainingSignatureCount(): number {
		let numberOfSignatures = this.isMultiSignatureRegistration()
			? this.#multiSignature.numberOfSignatures - this.#transaction.signatures.length
			: this.#multiSignature.min;

		return numberOfSignatures; // - this.#transaction.signatures.filter(Boolean).length;
	}
}