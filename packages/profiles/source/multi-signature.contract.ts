import { Contracts } from "@payvo/sdk";

import { IReadOnlyWallet } from "./contracts";

export interface IMultiSignature {
	/**
	 * Get the multi signature data.
	 *
	 * @return {Contracts.WalletMultiSignature}
	 * @memberof IReadWriteWallet
	 */
	all(): Contracts.WalletMultiSignature;

	/**
	 * Get the multi signature participants.
	 *
	 * @return {IReadOnlyWallet[]}
	 * @memberof IReadWriteWallet
	 */
	participants(): IReadOnlyWallet[];

	/**
	 * Get the public keys of the multi signature participants.
	 *
	 * @return {string[]}
	 * @memberof IReadWriteWallet
	 */
	publicKeys(): string[];
}
