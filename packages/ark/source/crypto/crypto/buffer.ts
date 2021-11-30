import { SmartBuffer } from 'smart-buffer';

export class ByteBuffer {
	#buffer: SmartBuffer;

	public constructor(size: number) {
		this.#buffer = SmartBuffer.fromSize(size);
	}

	public get offset(): number {
		return this.#buffer.readOffset || this.#buffer.writeOffset;
	}

	public get limit(): number {
		return this.#buffer.length;
	}

	public append(data: Buffer | string, encoding?: BufferEncoding): void {
		this.#buffer = SmartBuffer.fromBuffer(
			Buffer.concat([this.#buffer.toBuffer(), data instanceof Buffer ? data : Buffer.from(data, encoding)])
		);
	}

	public reset(): void {
		this.#buffer.clear();
	}

	public remaining(): number {
		return this.#buffer.remaining();
	}

	public readString(length: number): string {
		return this.#buffer.readString(length);
	}

	public readBytes(length: number): ByteBuffer {
		return this;
	}

	public readUint8(): number {
		return this.#buffer.readUInt8();
	}

	public readUint16(): number {
		return this.#buffer.readUInt16LE();
	}

	public readUint32(): number {
		return this.#buffer.readUInt32LE();
	}

	public readUint64(): bigint {
		return this.#buffer.readBigUInt64LE();
	}

	public writeByte(value: number): void {
		//
	}

	public writeUint8(value: number): void {
		this.#buffer.writeUInt8(value);
	}

	public writeUint16(value: number): void {
		this.#buffer.writeUInt16LE(value);
	}

	public writeUint32(value: number): void {
		this.#buffer.writeUInt32LE(value);
	}

	public writeUint64(value: string): void {
		this.#buffer.writeBigUInt64LE(BigInt(value));
	}

	public mark(): ByteBuffer {
		return this;
	}

	public skip(length: number): ByteBuffer {
		this.#buffer.readString(length);

		return this;
	}

	public flip(): ByteBuffer {
		this.#buffer = SmartBuffer.fromBuffer(this.toBuffer().reverse());

		return this;
	}

	public toString(encoding?: BufferEncoding): string {
		return this.#buffer.toString(encoding);
	}

	public toBuffer(): Buffer {
		return this.#buffer.toBuffer();
	}
}
