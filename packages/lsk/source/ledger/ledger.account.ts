import { getPathArray } from "./ledger.helpers.js";

/**
 * Defines an Account to be used when communicating with ledger.
 */
export class LedgerAccount {
	#account = 0;
	#coinIndex = 134; // @TODO get slip44 from manifest

	/**
	 * Specify the account number.
	 * @param {number} newAccount
	 * @returns {this}
	 */
	public account(newAccount: number): this {
		this.#assertValidPath(newAccount);
		this.#account = newAccount;
		return this;
	}

	/**
	 * Derive the path using hardened entries.
	 * @returns {Buffer} defines the path in buffer form.
	 */
	public derivePath(): Buffer {
		const pathArray = getPathArray(`44'/${this.#coinIndex}'/${this.#account}'`);
		const buffer = Buffer.alloc(pathArray.length * 4);

		pathArray.forEach((r, index) => buffer.writeUInt32BE(r, index * 4));

		return buffer;
	}

	/**
	 * Asserts that the given param is a valid path (integer > 0)
	 */
	#assertValidPath(value: number) {
		if (!Number.isInteger(value)) {
			throw new TypeError('Param must be an integer');
		}

		if (value < 0) {
			throw new Error('Param must be greater than zero');
		}
	}
}
