import { PBKDF2 } from "@payvo/sdk-cryptography";

import { IReadWriteWallet, IWalletImportFormat, WalletData } from "./contracts";

// @TODO: rename to something better
export class WalletImportFormat implements IWalletImportFormat {
	readonly #wallet: IReadWriteWallet;
	readonly #key: string;

	public constructor(wallet: IReadWriteWallet, key: string) {
		this.#wallet = wallet;
		this.#key = key;
	}

	/** {@inheritDoc IWalletImportFormat.get} */
	public get(password: string): string {
		const encryptedKey: string | undefined = this.#wallet.data().get(this.#key);

		if (encryptedKey === undefined) {
			throw new Error("This wallet does not use PBKDF2 encryption.");
		}

		return PBKDF2.decrypt(encryptedKey, password);
	}

	/** {@inheritDoc IWalletImportFormat.set} */
	public set(value: string, password: string): void {
		this.#wallet.data().set(this.#key, PBKDF2.encrypt(value, password));

		this.#wallet.profile().status().markAsDirty();
	}

	/** {@inheritDoc IWalletImportFormat.exists} */
	public exists(): boolean {
		return this.#wallet.data().has(this.#key);
	}

	public forget(password: string): void {
		if (!this.exists()) {
			throw new Error("This wallet does not use PBKDF2 encryption.");
		}

		this.#wallet.data().forget(this.#key);

		this.#wallet.profile().status().markAsDirty();
	}
}
