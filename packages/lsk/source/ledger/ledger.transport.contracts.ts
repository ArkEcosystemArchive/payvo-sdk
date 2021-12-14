/**
 * Transport mechanism.
 * @see https://github.com/LedgerHQ/ledgerjs for all transport Available
 */
export interface ITransport {
	/**
	 * Used in U2F to avoid different web apps to communicate with different ledger implementations
	 * @param {string} key
	 */
	setScrambleKey(key: string): void;

	/**
	 * sends data to Ledger
	 * @param {number} cla
	 * @param {number} ins
	 * @param {number} p1
	 * @param {number} p2
	 * @param {Buffer} data
	 * @param {number[]} statusList Allowed status list.
	 * @returns {Promise<Buffer>}
	 */
	send(cla: number, ins: number, p1: number, p2: number, data?: Buffer, statusList?: number[]): Promise<Buffer>;

	close(): void;
}
