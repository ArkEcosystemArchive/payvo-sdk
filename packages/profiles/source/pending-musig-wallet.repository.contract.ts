import { IWalletData } from "./wallet.contract.js";

/**
 * Defines the implementation contract for the pending musig wallet repository.
 *
 * @export
 * @interface IPendingMusigWalletRepository
 */
export interface IPendingMusigWalletRepository {
	/**
	 * Create a new wallet instance ans store it using it's unique ID.
	 *
	 * @private
	 * @param {string} address
	 * @param {string} coin
	 * @param {string} network
	 * @returns {IReadWriteWallet}
	 * @memberof IPendingMusigWalletRepository
	 */
	add(address: string, coin: string, network: string): Promise<void>;

	/**
	 * Sync and move broadcasted wallets in profile main wallet repository.
	 *
	 * @returns {IReadWriteWallet}
	 * @memberof IPendingMusigWalletRepository
	 */
	sync(): Promise<void>;

	/**
	 * Turn pending musig wallets into a normalised object.
	 *
	 * @returns {Record<string, IWalletData>}
	 * @memberof IPendingMusigWalletRepository
	 */
	toObject(): Record<string, IWalletData>;

	/**
	 * Fill the storage with wallet data.
	 *
	 * @param {Record<string, IWalletData>} struct
	 * @returns {Promise<void>}
	 * @memberof IPendingMusigWalletRepository
	 */
	fill(struct: Record<string, IWalletData>): Promise<void>;
}
