import { BIP39 } from "@payvo/sdk-cryptography";
import { Services } from "@payvo/sdk";

import { IReadWriteWallet, IWalletMutator, WalletData, WalletImportMethod, WalletSetting } from "./contracts";
import { Avatar } from "./helpers";

export class WalletMutator implements IWalletMutator {
	readonly #wallet: IReadWriteWallet;

	public constructor(wallet: IReadWriteWallet) {
		this.#wallet = wallet;
	}

	/** {@inheritDoc IWalletMutator.coin} */
	public async coin(coin: string, network: string, options: { sync: boolean } = { sync: true }): Promise<void> {
		try {
			// Ensure that we set the coin & network IDs
			this.#wallet.data().set(WalletData.Coin, coin);
			this.#wallet.data().set(WalletData.Network, network);

			// Ensure that we set the coin instance. This only exists in-memory for the lifetime of the client.
			const instance = this.#wallet.profile().coins().set(coin, network);
			this.#wallet.getAttributes().set("coin", instance);

			/**
			 * If we fail to construct the coin it means we are having networking
			 * issues or there is a bug in the coin package. This could also mean
			 * bad error handling inside the coin package which needs fixing asap.
			 */
			if (instance.hasBeenSynchronized()) {
				this.#wallet.markAsFullyRestored();
			} else {
				if (options.sync) {
					await instance.__construct();

					this.#wallet.markAsFullyRestored();
				} else {
					this.#wallet.markAsPartiallyRestored();
				}
			}

			this.#wallet.profile().status().markAsDirty();
		} catch {
			this.#wallet.markAsPartiallyRestored();
		}
	}

	/** {@inheritDoc IWalletMutator.identity} */
	public async identity(mnemonic: string, options?: Services.IdentityOptions): Promise<void> {
		const { type, address, path } = await this.#wallet.coin().address().fromMnemonic(mnemonic, options);

		/* istanbul ignore next */
		if (type) {
			this.#wallet.data().set(WalletData.DerivationType, type);
		}

		if (path) {
			this.#wallet.data().set(WalletData.DerivationPath, path);
		}

		if (type === "bip39") {
			this.#wallet.data().set(WalletData.ImportMethod, WalletImportMethod.BIP39.MNEMONIC);
		}

		if (type === "bip44") {
			this.#wallet.data().set(WalletData.ImportMethod, WalletImportMethod.BIP44.MNEMONIC);
		}

		if (type === "bip49") {
			this.#wallet.data().set(WalletData.ImportMethod, WalletImportMethod.BIP49.MNEMONIC);
		}

		if (type === "bip84") {
			this.#wallet.data().set(WalletData.ImportMethod, WalletImportMethod.BIP84.MNEMONIC);
		}

		const value = this.#wallet.network().usesExtendedPublicKey()
			? await this.#wallet.coin().extendedPublicKey().fromMnemonic(mnemonic, options)
			: (await this.#wallet.coin().publicKey().fromMnemonic(mnemonic, options)).publicKey;

		this.#wallet.data().set(WalletData.PublicKey, value);

		return this.address({ type, address, path });
	}

	/** {@inheritDoc IWalletMutator.address} */
	public async address({ address, path, type }: Partial<Services.AddressDataTransferObject>): Promise<void> {
		if (type) {
			this.#wallet.data().set(WalletData.DerivationType, type);
		}

		if (path) {
			this.#wallet.data().set(WalletData.DerivationPath, path);
		}

		this.#wallet.data().set(WalletData.Address, address);

		this.avatar(this.#wallet.address());

		await this.#wallet.synchroniser().identity();
	}

	/** {@inheritDoc IWalletMutator.avatar} */
	public avatar(value: string): void {
		const avatar: string = Avatar.make(value);

		this.#wallet.getAttributes().set("avatar", avatar);

		this.#wallet.settings().set(WalletSetting.Avatar, avatar);
	}

	/** {@inheritDoc IWalletMutator.alias} */
	public alias(alias: string): void {
		this.#wallet.settings().set(WalletSetting.Alias, alias);
	}

	public async removeEncryption(password: string): Promise<void> {
		const importMethod = this.#wallet.importMethod();

		if (
			![WalletImportMethod.BIP39.MNEMONIC_WITH_ENCRYPTION, WalletImportMethod.SECRET_WITH_ENCRYPTION].includes(
				importMethod,
			)
		) {
			throw new Error(`Import method [${importMethod}] is not supported.`);
		}

		const isValid = await this.#verifyPassword(password);

		if (!isValid) {
			throw new Error("The provided password does not match the wallet.");
		}

		this.#wallet.signingKey().forget(password);

		if (this.#wallet.isSecondSignature()) {
			this.#wallet.confirmKey().forget(password);
		}

		if (importMethod === WalletImportMethod.BIP39.MNEMONIC_WITH_ENCRYPTION) {
			return this.#wallet.data().set(WalletData.ImportMethod, WalletImportMethod.BIP39.MNEMONIC);
		}

		this.#wallet.data().set(WalletData.ImportMethod, WalletImportMethod.SECRET);
	}

	async #verifyPassword(password: string): Promise<boolean> {
		try {
			const wif = this.#wallet.signingKey().get(password);

			let publicKey: string;

			if (BIP39.validate(wif)) {
				publicKey = (await this.#wallet.coin().publicKey().fromMnemonic(wif)).publicKey;
			} else {
				publicKey = (await this.#wallet.coin().publicKey().fromSecret(wif)).publicKey;
			}

			return this.#wallet.publicKey() === publicKey;
		} catch {
			/* istanbul ignore next */
			return false;
		}
	}
}
