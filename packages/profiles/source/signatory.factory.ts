import { Services, Signatories } from "@payvo/sdk";

import { IReadWriteWallet, WalletData } from "./contracts";
import { ISignatoryFactory, SignatoryInput } from "./signatory.factory.contract";

export class SignatoryFactory implements ISignatoryFactory {
	readonly #wallet: IReadWriteWallet;

	public constructor(wallet: IReadWriteWallet) {
		this.#wallet = wallet;
	}

	public make({
		encryptionPassword,
		mnemonic,
		secondMnemonic,
		secret,
		secondSecret,
		wif,
		privateKey,
	}: SignatoryInput): Promise<Signatories.Signatory> {
		if (mnemonic && secondMnemonic) {
			return this.#wallet.signatory().confirmationMnemonic(mnemonic, secondMnemonic);
		}

		if (mnemonic) {
			return this.#wallet.signatory().mnemonic(mnemonic);
		}

		if (encryptionPassword) {
			if (this.#wallet.isSecondSignature()) {
				if (this.#wallet.actsWithSecretWithEncryption()) {
					return this.#wallet
						.signatory()
						.confirmationSecret(
							this.#wallet.signingKey().get(encryptionPassword),
							this.#wallet.confirmKey().get(encryptionPassword),
						);
				}

				return this.#wallet
					.signatory()
					.confirmationMnemonic(
						this.#wallet.signingKey().get(encryptionPassword),
						this.#wallet.confirmKey().get(encryptionPassword),
					);
			}

			if (this.#wallet.actsWithSecretWithEncryption()) {
				return this.#wallet.signatory().secret(this.#wallet.signingKey().get(encryptionPassword));
			}

			return this.#wallet.signatory().mnemonic(this.#wallet.signingKey().get(encryptionPassword));
		}

		if (this.#wallet.isMultiSignature()) {
			return this.#wallet
				.signatory()
				.multiSignature(this.#wallet.multiSignature().all() as Services.MultiSignatureAsset);
		}

		if (this.#wallet.isLedger()) {
			const derivationPath = this.#wallet.data().get(WalletData.DerivationPath);

			if (typeof derivationPath !== "string") {
				throw new TypeError("[derivationPath] must be string.");
			}

			return this.#wallet.signatory().ledger(derivationPath);
		}

		if (wif) {
			return this.#wallet.signatory().wif(wif);
		}

		if (privateKey) {
			return this.#wallet.signatory().privateKey(privateKey);
		}

		if (secret && secondSecret) {
			return this.#wallet.signatory().confirmationSecret(secret, secondSecret);
		}

		if (secret) {
			return this.#wallet.signatory().secret(secret);
		}

		throw new Error("No signing key provided.");
	}
}