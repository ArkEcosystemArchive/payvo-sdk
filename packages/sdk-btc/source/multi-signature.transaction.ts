import { MultiSignatureAsset, MultiSignatureTransaction } from "./multi-signature.contract";
import * as bitcoin from "bitcoinjs-lib";
import { isMultiSignatureRegistration } from "./multi-signature.domain";
import { BIP32 } from "@payvo/cryptography";
import changeVersionBytes from "xpub-converter";

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

	public isMultiSignatureReady(): boolean {
		return !this.needsSignatures();
	}

	public needsSignatures(): boolean {
		if (this.isMultiSignatureRegistration()) {
			return this.#transaction.signatures.length < this.#multiSignature.numberOfSignatures;
		}

		const psbt = bitcoin.Psbt.fromBase64(this.#transaction.psbt!, { network: this.#network });
		const alreadySignedBy = psbt.data.inputs[0].partialSig?.length || 0;

		return alreadySignedBy < this.#multiSignature.min;
	}

	public needsAllSignatures(): boolean {
		return this.isMultiSignatureRegistration();
	}

	public needsWalletSignature(publicKey: string): boolean {
		if (!this.needsSignatures()) {
			return false;
		}

		if (this.isMultiSignatureRegistration()) {
			return this.#transaction.multiSignature.publicKeys.find(pk => pk === publicKey) === undefined;
		}

		const accountKey = BIP32.fromBase58(changeVersionBytes(publicKey, this.#network === bitcoin.networks.bitcoin ? "xpub" : "tpub"), this.#network);

		const psbt = bitcoin.Psbt.fromBase64(this.#transaction.psbt!, { network: this.#network });
		const firstInput = psbt.data.inputs[0];

		const signer = firstInput.bip32Derivation!.find(bip32Derivation => bip32Derivation.masterFingerprint.equals(accountKey.fingerprint));

		if (!signer) {
			// This extended public key is not required to sign the transaction
			return false;
		}

		return (firstInput.partialSig || []).find(partialSig => partialSig.pubkey.equals(signer.pubkey)) === undefined;
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
