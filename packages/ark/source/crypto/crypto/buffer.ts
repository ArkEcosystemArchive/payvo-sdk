export class ByteBuffer {
	#buffer: Buffer;
	#offset: number = 0;

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
		return this.readBytes(length).toString();
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
		// @TODO: this should be writeInt8
		this.#offset = this.#buffer.writeUInt8(value, this.#offset);
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

	public append(data: Buffer | string, encoding?: BufferEncoding): void {
		this.#buffer = Buffer.concat([this.#buffer, data instanceof Buffer ? data : Buffer.from(data, encoding)]);
	}

	public reset(): void {
		this.#offset = 0;
	}

	public remaining(): number {
		return this.#buffer.length - this.#offset;
	}

	public mark(): ByteBuffer {
		this.#offset = this.#offset;

		return this;
	}

	public skip(length: number): ByteBuffer {
		this.#offset += length;

		return this;
	}

	public flip(): ByteBuffer {
		this.#buffer = this.#buffer.reverse();

		return this;
	}

	public toString(encoding?: BufferEncoding): string {
		return this.#buffer.toString(encoding);
	}

	public toBuffer(): Buffer {
		return this.#buffer;
	}
}
