// Based on https://github.com/vekexasia/dpos-ledger-api

import { Services } from "@payvo/sdk";

import { crc16 } from "./crc16.js";

export class LedgerTransport {
	readonly #transport: Services.LedgerTransport;
	readonly #chunkSize: number;

	public constructor(transport: Services.LedgerTransport, chunkSize = 240) {
		if (chunkSize > 240) {
			throw new Error("Chunk size cannot exceed 240");
		}

		if (chunkSize < 1) {
			throw new Error("Chunk size cannot be less than 1");
		}

		this.#transport = transport;
		this.#chunkSize = chunkSize;

		transport.setScrambleKey("payvo"); // @TODO review
	}

	public async getPubKey(account: Buffer, showOnLedger = false): Promise<{ publicKey: string; address: string }> {
		const [publicKey, address] = await this.#exchange([
			0x04,
			showOnLedger ? 0x1 : 0x0,
			account.length / 4,
			account,
		]);

		return {
			address: address.toString("utf8"),
			publicKey: publicKey.toString("hex"),
		};
	}

	public signTX(account: Buffer, buff: Buffer): Promise<Buffer> {
		return this.#sign(0x05, account, buff);
	}

	public async signMSG(account: Buffer, what: string | Buffer): Promise<Buffer> {
		return this.#sign(0x06, account, typeof what === "string" ? Buffer.from(what, "utf8") : what);
	}

	public async version(): Promise<{ version: string; coinID: string }> {
		const [version, coinID] = await this.#exchange(0x09);

		return {
			coinID: coinID.toString("ascii"),
			version: version.toString("ascii"),
		};
	}

	async #exchange(hexData: string | Buffer | number | Array<string | Buffer | number>): Promise<Buffer[]> {
		let inputBuffer: Buffer;
		if (Array.isArray(hexData)) {
			inputBuffer = Buffer.concat(
				hexData.map((item) => {
					if (typeof item === "string") {
						return Buffer.from(item, "hex");
					} else if (typeof item === "number") {
						return Buffer.alloc(1).fill(item);
					}
					return item;
				}),
			);
		} else if (typeof hexData === "string") {
			inputBuffer = Buffer.from(hexData, "hex");
		} else if (typeof hexData === "number") {
			inputBuffer = Buffer.alloc(1).fill(hexData);
		} else {
			inputBuffer = hexData;
		}

		// Send start comm packet
		const startCommBuff = this.#prepareStartCommBufferContent(inputBuffer);
		await this.#transport.send(0xe0, 89, 0, 0, startCommBuff);

		// Calculate number of chunks to send.
		const chunkDataSize = this.#chunkSize;
		const nChunks = Math.ceil(inputBuffer.length / chunkDataSize);

		let previousCRC = 0;
		for (let index = 0; index < nChunks; index++) {
			const dataSize = Math.min(inputBuffer.length, (index + 1) * chunkDataSize) - index * chunkDataSize;

			// copy chunk data
			const dataBuffer = inputBuffer.slice(index * chunkDataSize, index * chunkDataSize + dataSize);

			const [currentCRC, previousCRCLedger] = this.#decomposeResponse(
				await this.#transport.send(0xe0, 90, 0, 0, dataBuffer),
			);
			const crc = crc16(dataBuffer);
			const receivedCRC = currentCRC.readUInt16LE(0);

			if (crc !== receivedCRC) {
				throw new Error("Something went wrong during CRC validation");
			}

			if (previousCRCLedger.readUInt16LE(0) !== previousCRC) {
				throw new Error("Prev CRC is not valid");
			}

			previousCRC = crc;
		}

		return this.#decomposeResponse(await this.#transport.send(0xe0, 91, 0, 0));
	}

	async #sign(signType: number, account: Buffer, data: Buffer): Promise<Buffer> {
		const dataLength = Buffer.alloc(2);
		dataLength.writeUInt16BE(data.length, 0);

		const result = await this.#exchange([
			signType, // sign
			// Bip32
			account.length / 4,
			account,
			// headers
			dataLength,
			0x00, // Old hasRequesterPubKey
			// data
			data,
		]);

		return result[0];
	}

	#prepareStartCommBufferContent(inputBuffer: Buffer) {
		const result = Buffer.alloc(2);
		result.writeUInt16BE(inputBuffer.length, 0);

		return result;
	}

	#decomposeResponse(response: Buffer): Buffer[] {
		const totalElements = response.readInt8(0);
		const toReturnValue: Buffer[] = [];
		let index = 1; // 1 read uint8_t

		for (let index_ = 0; index_ < totalElements; index_++) {
			const elementLength = response.readInt16LE(index);
			index += 2;
			toReturnValue.push(response.slice(index, index + elementLength));
			index += elementLength;
		}

		return toReturnValue;
	}
}
