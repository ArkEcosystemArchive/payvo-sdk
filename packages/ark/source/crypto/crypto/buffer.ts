export class ByteBuffer {
	#buffer: Buffer;
	#offset: number = 0;
	#markedOffset: number = 0;

	public constructor(size: number) {
		this.#buffer = Buffer.alloc(size);
	}

	public get offset(): number {
		return this.#buffer.byteOffset;
	}

	public get limit(): number {
		return this.#buffer.length;
	}

	public readString(length: number): string {
		const value = this.readBytes(length).toString();
		this.#offset += length;
		return value;
	}

	public readBytes(length: number): Buffer {
		const value = this.#buffer.slice(this.#offset, this.#offset + length);
		this.#offset += length;
		return value;
	}

	public readUint8(): number {
		const value = this.#buffer.readUInt8(this.#offset);
		this.#offset += 1;
		return value;
	}

	public readUint16(): number {
		const value = this.#buffer.readUInt16LE(this.#offset);
		this.#offset += 2;
		return value;
	}

	public readUint32(): number {
		const value = this.#buffer.readUInt32LE(this.#offset);
		this.#offset += 4;
		return value;
	}

	public readUint64(): bigint {
		const value = this.#buffer.readBigUInt64LE(this.#offset);
		this.#offset += 8;
		return value;
	}

	public writeByte(value: number): void {
		// https://github.com/protobufjs/bytebuffer.js/blob/4144951c7f583d9394d18487ff0b2b7474b1e775/src/types/ints/int8.js#L28-L36
		// @TODO: This should be writeInt8 if we would copy bytebuffer.js but then node throws
		// "The value of "value" is out of range. It must be >= -128 and <= 127. Received 255"
		this.#offset = this.#buffer.writeInt8(value, this.#offset);
	}

	public writeUint8(value: number): void {
		this.#offset = this.#buffer.writeUInt8(value, this.#offset);
	}

	public writeUint16(value: number): void {
		this.#offset = this.#buffer.writeUInt16LE(value, this.#offset);
	}

	public writeUint32(value: number): void {
		this.#offset = this.#buffer.writeUInt32LE(value, this.#offset);
	}

	public writeUint64(value: string): void {
		this.#offset = this.#buffer.writeBigUInt64LE(BigInt(value), this.#offset);
	}

	// https://github.com/protobufjs/bytebuffer.js/blob/master/src/methods/append.js
	public append(data: Buffer | string, encoding?: BufferEncoding): void {
		const contents: Buffer = data instanceof Buffer ? data : Buffer.from(data, encoding);

		this.#buffer = Buffer.concat([this.#buffer, contents]);
		this.#offset += contents.length;
	}

	// https://github.com/protobufjs/bytebuffer.js/blob/master/src/methods/reset.js
	public reset(): void {
		if (this.#markedOffset >= 0) {
			this.#offset = this.#markedOffset;
			this.#markedOffset = -1;
		} else {
			this.#offset = 0;
		}
	}

	public remaining(): number {
		return this.#buffer.length - this.#offset;
	}

	// https://github.com/protobufjs/bytebuffer.js/blob/master/src/methods/mark.js
	public mark(): ByteBuffer {
		this.#markedOffset = this.#offset;

		return this;
	}

	public skip(length: number): ByteBuffer {
		this.#offset += length;

		return this;
	}

	// https://github.com/protobufjs/bytebuffer.js/blob/master/src/methods/flip.js
	// @TODO: when bytebuffer.js flips it also sets a "limit" parameter to 0, which we don't have.
	public flip(): ByteBuffer {
		// this.#buffer = this.#buffer.reverse();
		// this.#limit = this.offset;
		this.#offset = 0;

		return this;
	}

	public toString(encoding?: BufferEncoding): string {
		return this.#buffer.toString(encoding);
	}

	public toBuffer(): Buffer {
		return this.#buffer;
	}
}
