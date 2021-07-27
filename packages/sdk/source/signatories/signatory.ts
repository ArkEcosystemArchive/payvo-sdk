/* istanbul ignore file */

import { ForbiddenMethodCallException } from "../exceptions";
import { MultiSignatureAsset } from "../services";
import { AbstractDoubleSignatory } from "./abstract-double-signatory";
import { AbstractSignatory } from "./abstract-signatory";
import { ConfirmationMnemonicSignatory } from "./confirmation-mnemonic";
import { ConfirmationWIFSignatory } from "./confirmation-wif";
import { LedgerSignatory } from "./ledger";
import { MnemonicSignatory } from "./mnemonic";
import { MultiSignatureSignatory } from "./multi-signature";
import { PrivateKeySignatory } from "./private-key";
import { SecretSignatory } from "./secret";
import { WIFSignatory } from "./wif";

type SignatoryType =
	| ConfirmationMnemonicSignatory
	| ConfirmationWIFSignatory
	| LedgerSignatory
	| MnemonicSignatory
	| PrivateKeySignatory
	| SecretSignatory
	| WIFSignatory;

export class Signatory {
	readonly #signatory: SignatoryType;
	readonly #multiSignature: MultiSignatureAsset | undefined;

	public constructor(signatory: SignatoryType, multiSignature?: MultiSignatureAsset) {
		this.#signatory = signatory;
		this.#multiSignature = multiSignature;
	}

	public signingKey(): string {
		if (this.#signatory instanceof MultiSignatureSignatory) {
			throw new ForbiddenMethodCallException(this.constructor.name, this.signingKey.name);
		}

		return this.#signatory.signingKey();
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

	public address(): string {
		// @TODO: deduplicate this
		if (this.#signatory instanceof AbstractSignatory) {
			return this.#signatory.address();
		}

		if (this.#signatory instanceof AbstractDoubleSignatory) {
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

	public signingList(): MultiSignatureAsset {
		if (this.#signatory instanceof MultiSignatureSignatory) {
			return this.#signatory.signingList();
		}

		throw new ForbiddenMethodCallException(this.constructor.name, this.signingList.name);
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

	public actsWithConfirmationMnemonic(): boolean {
		return this.#signatory instanceof ConfirmationMnemonicSignatory;
	}

	public actsWithWIF(): boolean {
		return this.#signatory instanceof WIFSignatory;
	}

	public actsWithConfirmationWIF(): boolean {
		return this.#signatory instanceof ConfirmationWIFSignatory;
	}

	public actsWithPrivateKey(): boolean {
		return this.#signatory instanceof PrivateKeySignatory;
	}

	public actsWithMultiSignature(): boolean {
		return this.#signatory instanceof MultiSignatureSignatory;
	}

	public actsWithLedger(): boolean {
		return this.#signatory instanceof LedgerSignatory;
	}

	public actsWithSecret(): boolean {
		return this.#signatory instanceof SecretSignatory;
	}
}
