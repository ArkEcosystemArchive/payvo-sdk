import { MultiSignatureAsset, MultiSignatureTransaction } from "./multi-signature.contract.js";
import * as bitcoin from "bitcoinjs-lib";
import { isMultiSignatureRegistration } from "./multi-signature.domain.js";
import { BIP32 } from "@payvo/sdk-cryptography";
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
			return this.#transaction.multiSignature.publicKeys.find((pk) => pk === publicKey) === undefined;
		}

		const accountKey = BIP32.fromBase58(
			changeVersionBytes(publicKey, this.#network === bitcoin.networks.bitcoin ? "xpub" : "tpub"),
			this.#network,
		);

		const psbt = bitcoin.Psbt.fromBase64(this.#transaction.psbt!, { network: this.#network });
		const firstInput = psbt.data.inputs[0];

		const signer = firstInput.bip32Derivation!.find((bip32Derivation) =>
			bip32Derivation.masterFingerprint.equals(accountKey.fingerprint),
		);

		if (!signer) {
			// This extended public key is not required to sign the transaction
			return false;
		}

		return (
			(firstInput.partialSig || []).find((partialSig) => partialSig.pubkey.equals(signer.pubkey)) === undefined
		);
	}

	public needsFinalSignature(): boolean {
		return false;
	}

	public remainingSignatureCount(): number {
		if (this.isMultiSignatureRegistration()) {
			return this.#multiSignature.numberOfSignatures - this.#transaction.signatures.length;
		}

		const psbt = bitcoin.Psbt.fromBase64(this.#transaction.psbt!, { network: this.#network });
		const firstInput = psbt.data.inputs[0];

		return Math.max(this.#multiSignature.min - (firstInput.partialSig || []).length, 0);
	}
}
