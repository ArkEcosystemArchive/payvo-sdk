/* istanbul ignore file */

import { ForbiddenMethodCallException } from "../exceptions";
import { MultiSignatureAsset } from "../services";
import { AbstractDoubleSignatory } from "./abstract-double-signatory";
import { AbstractSignatory } from "./abstract-signatory";
import { AbstractValueSignatory } from "./abstract-value-signatory";
import { LedgerSignatory } from "./ledger";
import { MnemonicSignatory } from "./mnemonic";
import { MultiMnemonicSignatory } from "./multi-mnemonic";
import { MultiSignatureSignatory } from "./multi-signature";
import { PrivateKeySignatory } from "./private-key";
import { PrivateMultiSignatureSignatory } from "./private-multi-signature";
import { ConfirmationMnemonicSignatory } from "./confirmation-mnemonic";
import { ConfirmationWIFSignatory } from "./confirmation-wif";
import { SecretSignatory } from "./secret";
import { SenderPublicKeySignatory } from "./sender-public-key";
import { WIFSignatory } from "./wif";

type SignatoryType =
	| ConfirmationMnemonicSignatory
	| ConfirmationWIFSignatory
	| LedgerSignatory
	| MnemonicSignatory
	| MultiMnemonicSignatory
	| MultiSignatureSignatory
	| PrivateKeySignatory
	| PrivateMultiSignatureSignatory
	| SecretSignatory
	| SenderPublicKeySignatory
	| WIFSignatory;

export class Signatory {
	readonly #signatory: SignatoryType;
	readonly #multiSignature: MultiSignatureAsset | undefined;

	public constructor(signatory: SignatoryType, multiSignature?: MultiSignatureAsset) {
		this.#signatory = signatory;
		this.#multiSignature = multiSignature;
	}

	public signingKey(): string {
		// @TODO: deduplicate this
		if (this.#signatory instanceof MultiMnemonicSignatory) {
			throw new ForbiddenMethodCallException(this.constructor.name, this.signingKey.name);
		}

		if (this.#signatory instanceof MultiSignatureSignatory) {
			throw new ForbiddenMethodCallException(this.constructor.name, this.signingKey.name);
		}

		return this.#signatory.signingKey();
	}

	public signingKeys(): string[] {
		// @TODO: deduplicate this
		if (this.#signatory instanceof MultiMnemonicSignatory) {
			return this.#signatory.signingKeys();
		}

		if (this.#signatory instanceof PrivateMultiSignatureSignatory) {
			return this.#signatory.signingKeys();
		}

		throw new ForbiddenMethodCallException(this.constructor.name, this.signingKeys.name);
	}

	public signingList(): MultiSignatureAsset {
		if (this.#signatory instanceof MultiSignatureSignatory) {
			return this.#signatory.signingList();
		}

		throw new ForbiddenMethodCallException(this.constructor.name, this.signingList.name);
	}

	public confirmKey(): string {
		// @TODO: deduplicate this
		if (this.#signatory instanceof ConfirmationMnemonicSignatory) {
			return this.#signatory.confirmKey();
		}

		if (this.#signatory instanceof ConfirmationWIFSignatory) {
			return this.#signatory.confirmKey();
		}

		throw new ForbiddenMethodCallException(this.constructor.name, this.confirmKey.name);
	}

	public identifier(): string {
		if (this.#signatory instanceof MultiSignatureSignatory) {
			return this.#signatory.identifier()!;
		}

		throw new ForbiddenMethodCallException(this.constructor.name, this.identifier.name);
	}

	public identifiers(): string[] {
		if (!(this.#signatory instanceof MultiMnemonicSignatory)) {
			throw new ForbiddenMethodCallException(this.constructor.name, this.identifiers.name);
		}

		return this.#signatory.identifiers();
	}

	public address(): string {
		// @TODO: deduplicate this
		if (this.#signatory instanceof AbstractSignatory) {
			return this.#signatory.address();
		}

		if (this.#signatory instanceof AbstractDoubleSignatory) {
			return this.#signatory.address();
		}

		if (this.#signatory instanceof AbstractValueSignatory) {
			return this.#signatory.address();
		}

		if (this.#signatory instanceof PrivateKeySignatory) {
			return this.#signatory.address();
		}

		throw new ForbiddenMethodCallException(this.constructor.name, this.address.name);
	}

	public publicKey(): string {
		// @TODO: deduplicate this
		if (this.#signatory instanceof AbstractSignatory) {
			return this.#signatory.publicKey();
		}

		if (this.#signatory instanceof AbstractDoubleSignatory) {
			return this.#signatory.publicKey();
		}

		if (this.#signatory instanceof AbstractValueSignatory) {
			return this.#signatory.publicKey();
		}

		throw new ForbiddenMethodCallException(this.constructor.name, this.publicKey.name);
	}

	public privateKey(): string {
		// @TODO: deduplicate this
		if (this.#signatory instanceof AbstractSignatory) {
			return this.#signatory.privateKey();
		}

		if (this.#signatory instanceof AbstractDoubleSignatory) {
			return this.#signatory.privateKey();
		}

		if (this.#signatory instanceof PrivateKeySignatory) {
			return this.#signatory.privateKey();
		}

		throw new ForbiddenMethodCallException(this.constructor.name, this.privateKey.name);
	}

	public path(): string {
		if (this.#signatory instanceof LedgerSignatory) {
			return this.#signatory.signingKey();
		}

		throw new ForbiddenMethodCallException(this.constructor.name, this.path.name);
	}

	public multiSignature(): MultiSignatureAsset | undefined {
		return this.#multiSignature;
	}

	public hasMultiSignature(): boolean {
		return this.#multiSignature !== undefined;
	}

	public actsWithMnemonic(): boolean {
		return this.#signatory instanceof MnemonicSignatory;
	}

	public actsWithMultiMnemonic(): boolean {
		return this.#signatory instanceof MultiMnemonicSignatory;
	}

	public actsWithConfirmationMnemonic(): boolean {
		return this.#signatory instanceof ConfirmationMnemonicSignatory;
	}

	public actsWithWif(): boolean {
		return this.#signatory instanceof WIFSignatory;
	}

	public actsWithConfirmationWif(): boolean {
		return this.#signatory instanceof ConfirmationWIFSignatory;
	}

	public actsWithPrivateKey(): boolean {
		return this.#signatory instanceof PrivateKeySignatory;
	}

	public actsWithSenderPublicKey(): boolean {
		return this.#signatory instanceof SenderPublicKeySignatory;
	}

	public actsWithMultiSignature(): boolean {
		return this.#signatory instanceof MultiSignatureSignatory;
	}

	public actsWithPrivateMultiSignature(): boolean {
		return this.#signatory instanceof PrivateMultiSignatureSignatory;
	}

	public actsWithLedger(): boolean {
		return this.#signatory instanceof LedgerSignatory;
	}

	public actsWithSecret(): boolean {
		return this.#signatory instanceof SecretSignatory;
	}
}
