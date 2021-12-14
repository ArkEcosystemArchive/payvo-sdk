import { LedgerAccount } from './ledger.account.js';
import { getCrc16 } from "./ledger.helpers.js";
import { ITransport } from './ledger.transport.contracts.js';

/**
 * Communication Protocol class.
 * @example
 * ```javascript
 *
 * import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
 * import { LiskLedger, LedgerAccount } from '@hirishh/lisk-ledger.js';
 *
 * const account = new LedgerAccount();
 * TransportNodeHid.create()
 *   .then((transport) => new LiskLedger(transport))
 *   .then((instance) => instance.getPubKey(account));
 *   .then(({publicKey}) => console.log(`pubKey: ${publicKey}`);
 * ```
 */
export class LiskLedger {
	/**
	 * @param {ITransport} transport transport class.
	 * @param {number} chunkSize lets you specify the chunkSize for each communication.<br/>
	 * <strong>DO not</strong> change if you don't know what you're doing.
	 */
	constructor(private transport: ITransport, private chunkSize: number = 240) {
		if (chunkSize > 240) {
			throw new Error('Chunk size cannot exceed 240');
		}

		if (chunkSize < 1) {
			throw new Error('Chunk size cannot be less than 1');
		}

		if (transport === null || typeof(transport) === 'undefined') {
			throw new Error('Transport cannot be empty');
		}

		transport.setScrambleKey('scramblekey'); // @TODO review
	}

	/**
	 * Retrieves a publicKey associated to an account
	 * @param {LedgerAccount|Buffer} account or bip32 buffer
	 * @param {boolean} showOnLedger ask ledger to show the address.
	 * @returns {Promise<{publicKey: string, account:string, lisk32: string}>}
	 * @example
	 * ```javascript
	 *
	 * instance.getPubKey(account)
	 *   .then((resp) => {
	 *     console.log(resp.publicKey);
	 *     console.log(resp.address);
	 *     console.log(resp.lisk32);
	 *   });
	 * ```
	 */
	public async getPubKey(account: LedgerAccount | Buffer, showOnLedger: boolean = false):
		Promise<{ publicKey: string, address: string, lisk32: string }> {
		const pathBuf = Buffer.isBuffer(account) ? account : account.derivePath();
		const resp    = await this.exchange([
			0x04,
			showOnLedger ? 0x1 : 0x0,
			(pathBuf.length / 4),
			pathBuf,
		]);

		const [publicKey, address, lisk32] = resp;

		return {
			address  : address.toString('hex'),
			lisk32   : lisk32.toString('utf8'),
			publicKey: publicKey.toString('hex'),
		};
	}

	/**
	 * Signs a transaction. Transaction must be provided as a buffer using getBytes.
	 * @see https://lisk.com/documentation/lisk-sdk/references/lisk-elements/transactions.html#getsigningbytes
	 * @param {LedgerAccount | Buffer} account or raw bip32 buffer
	 * @param {Buffer} buff buffer containing the bytes of a transaction
	 * @returns {Promise<Buffer>} signature.
	 * @example
	 * ```javascript
	 *
	 * instance.signTX(account, transaction.getBytes(), false)
	 *   .then((signature) => {
	 *     console.log('Signature is: ', signature.toString('hex'));
	 *   });
	 * ```
	 */
	public signTX(account: LedgerAccount | Buffer, buff: Buffer): Promise<Buffer> {
		return this.sign(0x05, account, buff);
	}

	/**
	 * Signs a message. The message can be passed as a string or buffer.
	 * Note that if buffer contains "non-printable" characters, then the ledger will probably have some issues
	 * Displaying the message to the user.
	 * @param {LedgerAccount | Buffer} account or raw bip32 buffer
	 * @param {string | Buffer} what the message to sign
	 * @returns {Promise<Buffer>} the "non-detached" signature.
	 * Signature goodness can be verified using sodium. See tests.
	 * @example
	 * ```javascript
	 *
	 * instance.signMSG(account, 'message string', false)
	 *   .then((signature) => {
	 *     console.log('Signature is: ', signature.toString('hex'));
	 *   });
	 * ```
	 */
	public async signMSG(account: LedgerAccount | Buffer, what: string | Buffer): Promise<Buffer> {
		const buffer: Buffer = typeof(what) === 'string' ? Buffer.from(what, 'utf8') : what;
		return this.sign(0x06, account, buffer);
	}

	/**
	 * Gets Ledger App Version
	 * @returns {Promise<object>} see example
	 * @example
	 * ```javascript
	 *
	 * instance.version()
	 *   .then((resp) => {
	 *     console.log('CoinID is: ', resp.coinID);
	 *     console.log('Version is: ', resp.version);
	 *   });
	 * ```
	 */
	public async version(): Promise<{ version: string, coinID: string }> {
		const [version, coinID] = await this.exchange(0x09);
		return {
			coinID : coinID.toString('ascii'),
			version: version.toString('ascii'),
		};
	}

	/**
	 * Simple ping utility. It won't throw if ping suceeded.
	 * @returns {Promise<void>}
	 */
	public async ping(): Promise<void> {
		const [res] = await this.exchange(0x08);
		if (res.toString('ascii') !== 'PONG') {
			throw new Error('Didnt receive PONG');
		}
	}

	/**
	 * Raw exchange protocol handling. It's exposed but it is meant for internal usage only.
	 * @param {string | Buffer} hexData
	 * @returns {Promise<Buffer[]>} Raw response buffers.
	 */
	public async exchange(hexData: string | Buffer | number | Array<(string | Buffer | number)>): Promise<Buffer[]> {
		let inputBuffer: Buffer;
		if (Array.isArray(hexData)) {
			inputBuffer = Buffer.concat(hexData.map((item) => {
				if (typeof(item) === 'string') {
					return Buffer.from(item, 'hex');
				} else if (typeof(item) === 'number') {
					return Buffer.alloc(1).fill(item);
				}
				return item;
			}));
		} else if (typeof(hexData) === 'string') {
			inputBuffer = Buffer.from(hexData, 'hex');
		} else if (typeof(hexData) === 'number') {
			inputBuffer = Buffer.alloc(1).fill(hexData);
		} else {
			inputBuffer = hexData;
		}

		// Send start comm packet
		const startCommBuffer = Buffer.alloc(2);
		startCommBuffer.writeUInt16BE(inputBuffer.length, 0);

		await this.transport.send(0xe0, 89, 0, 0, startCommBuffer);

		// Calculate number of chunks to send.
		const chunkDataSize = this.chunkSize;
		const nChunks       = Math.ceil(inputBuffer.length / chunkDataSize);

		let prevCRC = 0;
		for (let i = 0; i < nChunks; i++) {
			const dataSize = Math.min(inputBuffer.length, (i + 1) * chunkDataSize) - i * chunkDataSize;

			// copy chunk data
			const dataBuffer = inputBuffer.slice(i * chunkDataSize, i * chunkDataSize + dataSize);

			let resBuffer;
			try {
				resBuffer = await this.transport.send(
					0xe0,
					90,
					0,
					0,
					dataBuffer
				)
			} catch (error) {
				if (error.message.includes('0x6867')) {
					throw new Error('Payload too big for Lisk Ledger implementation');
				} else {
					throw error;
				}
			}
			const [curCRC, prevCRCLedger] = this.decomposeResponse(resBuffer);
			const crc = getCrc16(dataBuffer);
			const receivedCRC = curCRC.readUInt16LE(0);

			if (crc !== receivedCRC) {
				throw new Error('Something went wrong during CRC validation');
			}

			if (prevCRCLedger.readUInt16LE(0) !== prevCRC) {
				throw new Error('Prev CRC is not valid');
			}

			prevCRC = crc;
		}
		// Close comm flow.
		const resBuf = await this.transport.send(0xe0, 91, 0, 0);

		return this.decomposeResponse(resBuf);
	}

	/**
	 * Raw sign protocol utility. It will handle signature of both msg and txs.
	 * @param {number} signType type of signature. 0x05 for txs, 0x06 for messages.
	 * @param {LedgerAccount|Buffer} account acount or bip32 buffer
	 * @param {Buffer} buff buffer to sign
	 * @param {boolean} hasRequesterPKey if it has a requesterpublickey (used only in tx signing mode)
	 * @returns {Promise<Buffer>} the signature
	 */
	private async sign(
		signType: number,
		account: LedgerAccount | Buffer,
		buff: Buffer): Promise<Buffer> {

		const pathBuf    = Buffer.isBuffer(account) ? account : account.derivePath();
		const buffLength = Buffer.alloc(2);
		buffLength.writeUInt16BE(buff.length, 0);
		const args = await this.exchange([
			signType, // sign
			// Bip32
			(pathBuf.length / 4),
			pathBuf,
			// headers
			buffLength,
			// data
			buff,
		]);
		const [signature] = args;
		return signature;
	}

	/**
	 * Internal utility to decompose the ledger response as protocol definition.
	 * @param {Buffer} resBuf response from ledger
	 * @returns {Array<Buffer>} decomposed response.
	 */
	private decomposeResponse(resBuf: Buffer): Buffer[] {
		const totalElements   = resBuf.readInt8(0);
		const toRet: Buffer[] = [];
		let index             = 1; // 1 read uint8_t

		for (let i = 0; i < totalElements; i++) {
			const elLength = resBuf.readInt16LE(index);
			index += 2;
			toRet.push(resBuf.slice(index, index + elLength));
			index += elLength;
		}

		return toRet;
	}
}
