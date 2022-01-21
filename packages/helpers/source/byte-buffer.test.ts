import { describe } from "@payvo/sdk-test";

import { ByteBuffer } from "./byte-buffer";

describe("ByteBuffer", async ({ assert, it }) => {
	it("should return valid result & result length", () => {
		const byteBuffer = new ByteBuffer(Buffer.alloc(1));

		assert.is(byteBuffer.getResultLength(), 0);
		assert.is(Buffer.alloc(0).compare(byteBuffer.getResult()), 0);

		byteBuffer.writeInt8(1);

		const comparisonBuffer = Buffer.alloc(1);
		comparisonBuffer.writeInt8(1);
		assert.is(byteBuffer.getResultLength(), 1);
		assert.is(comparisonBuffer.compare(byteBuffer.getResult()), 0);
	});

	it("should return valid remainders and remainder length", () => {
		const buffer = Buffer.alloc(1);
		buffer.writeInt8(1);
		const byteBuffer = new ByteBuffer(buffer);

		assert.is(byteBuffer.getRemainderLength(), 1);
		assert.is(buffer.compare(byteBuffer.getRemainder()), 0);

		byteBuffer.readInt8();

		assert.is(byteBuffer.getRemainderLength(), 0);
		assert.is(Buffer.alloc(0).compare(byteBuffer.getRemainder()), 0);
	});

	it("#jump should change current offset", () => {
		const byteBuffer = new ByteBuffer(Buffer.alloc(1));

		assert.is(byteBuffer.getResultLength(), 0);

		byteBuffer.jump(1);

		assert.is(byteBuffer.getResultLength(), 1);

		byteBuffer.jump(-1);

		assert.is(byteBuffer.getResultLength(), 0);
	});

	it("#jump throw error when jumping outside boundary", () => {
		const byteBuffer = new ByteBuffer(Buffer.alloc(1));

		assert.throws(() => byteBuffer.jump(2), "Jump over buffer boundary");
		assert.throws(() => byteBuffer.jump(-1), "Jump over buffer boundary");
	});
});

describe("ByteBuffer#Int8", ({ assert, each }) => {
	const bufferSize = 1;
	const min = -128;
	const max = 127;
	const validValues = [min, max];
	const invalidValues = [min - 1, max + 1];

	each(
		"should write and read value",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));
			byteBuffer.writeInt8(dataset);

			assert.is(byteBuffer.getResultLength(), bufferSize);

			byteBuffer.reset();

			assert.is(byteBuffer.readInt8(), dataset);
			assert.is(byteBuffer.getResultLength(), bufferSize);
		},
		validValues,
	);

	each(
		"should throw RangeError",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));

			assert.throws(
				() => byteBuffer.writeInt8(dataset),
				(err) => err instanceof RangeError,
			);
			assert.is(byteBuffer.getResultLength(), 0);
		},
		invalidValues,
	);
});

describe("ByteBuffer#UInt8", ({ assert, each }) => {
	const bufferSize = 1;
	const min = 0;
	const max = 255;
	const validValues = [min, max];
	const invalidValues = [min - 1, max + 1];

	each(
		"should write and read value",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));
			byteBuffer.writeUInt8(dataset);

			assert.is(byteBuffer.getResultLength(), bufferSize);

			byteBuffer.reset();

			assert.is(byteBuffer.readUInt8(), dataset);
			assert.is(byteBuffer.getResultLength(), bufferSize);
		},
		validValues,
	);

	each(
		"should throw RangeError",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));

			assert.throws(
				() => byteBuffer.writeUInt8(dataset),
				(err) => err instanceof RangeError,
			);
			assert.is(byteBuffer.getResultLength(), 0);
		},
		invalidValues,
	);
});

describe("ByteBuffer#Int16BE", ({ assert, each }) => {
	const bufferSize = 2;
	const min = -32768;
	const max = 32767;
	const validValues = [min, max];
	const invalidValues = [min - 1, max + 1];

	each(
		"should write and read value",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));
			byteBuffer.writeInt16BE(dataset);

			assert.is(byteBuffer.getResultLength(), bufferSize);

			byteBuffer.reset();

			assert.is(byteBuffer.readInt16BE(), dataset);
			assert.is(byteBuffer.getResultLength(), bufferSize);
		},
		validValues,
	);

	each(
		"should throw RangeError",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));

			assert.throws(
				() => byteBuffer.writeInt16BE(dataset),
				(err) => err instanceof RangeError,
			);
			assert.is(byteBuffer.getResultLength(), 0);
		},
		invalidValues,
	);
});

describe("ByteBuffer#UInt16BE", ({ assert, each }) => {
	const bufferSize = 2;
	const min = 0;
	const max = 65535;
	const validValues = [min, max];
	const invalidValues = [min - 1, max + 1];

	each(
		"should write and read value",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));
			byteBuffer.writeUInt16BE(dataset);

			assert.is(byteBuffer.getResultLength(), bufferSize);

			byteBuffer.reset();

			assert.is(byteBuffer.readUInt16BE(), dataset);
			assert.is(byteBuffer.getResultLength(), bufferSize);
		},
		validValues,
	);

	each(
		"should throw RangeError",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));

			assert.throws(
				() => byteBuffer.writeUInt16BE(dataset),
				(err) => err instanceof RangeError,
			);
			assert.is(byteBuffer.getResultLength(), 0);
		},
		invalidValues,
	);
});

describe("ByteBuffer#Int16LE", ({ assert, each }) => {
	const bufferSize = 2;
	const min = -32768;
	const max = 32767;
	const validValues = [min, max];
	const invalidValues = [min - 1, max + 1];

	each(
		"should write and read value",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));
			byteBuffer.writeInt16LE(dataset);

			assert.is(byteBuffer.getResultLength(), bufferSize);

			byteBuffer.reset();

			assert.is(byteBuffer.readInt16LE(), dataset);
			assert.is(byteBuffer.getResultLength(), bufferSize);
		},
		validValues,
	);

	each(
		"should throw RangeError",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));

			assert.throws(
				() => byteBuffer.writeInt16LE(dataset),
				(err) => err instanceof RangeError,
			);
			assert.is(byteBuffer.getResultLength(), 0);
		},
		invalidValues,
	);
});

describe("ByteBuffer#UInt16LE", ({ assert, each }) => {
	const bufferSize = 2;
	const min = 0;
	const max = 65535;
	const validValues = [min, max];
	const invalidValues = [min - 1, max + 1];

	each(
		"should write and read value",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));
			byteBuffer.writeUInt16LE(dataset);

			assert.is(byteBuffer.getResultLength(), bufferSize);

			byteBuffer.reset();

			assert.is(byteBuffer.readUInt16LE(), dataset);
			assert.is(byteBuffer.getResultLength(), bufferSize);
		},
		validValues,
	);

	each(
		"should throw RangeError",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));

			assert.throws(
				() => byteBuffer.writeUInt16LE(dataset),
				(err) => err instanceof RangeError,
			);
			assert.is(byteBuffer.getResultLength(), 0);
		},
		invalidValues,
	);
});

describe("ByteBuffer#Int32BE", ({ assert, each }) => {
	const bufferSize = 4;
	const min = -2147483648;
	const max = 2147483647;
	const validValues = [min, max];
	const invalidValues = [min - 1, max + 1];

	each(
		"should write and read value",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));
			byteBuffer.writeInt32BE(dataset);

			assert.is(byteBuffer.getResultLength(), bufferSize);

			byteBuffer.reset();

			assert.is(byteBuffer.readInt32BE(), dataset);
			assert.is(byteBuffer.getResultLength(), bufferSize);
		},
		validValues,
	);

	each(
		"should throw RangeError",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));

			assert.throws(
				() => byteBuffer.writeInt32BE(dataset),
				(err) => err instanceof RangeError,
			);
			assert.is(byteBuffer.getResultLength(), 0);
		},
		invalidValues,
	);
});

describe("ByteBuffer#UInt32BE", ({ assert, each }) => {
	const bufferSize = 4;
	const min = 0;
	const max = 4294967295;
	const validValues = [min, max];
	const invalidValues = [min - 1, max + 1];

	each(
		"should write and read value",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));
			byteBuffer.writeUInt32BE(dataset);

			assert.is(byteBuffer.getResultLength(), bufferSize);

			byteBuffer.reset();

			assert.is(byteBuffer.readUInt32BE(), dataset);
			assert.is(byteBuffer.getResultLength(), bufferSize);
		},
		validValues,
	);

	each(
		"should throw RangeError",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));

			assert.throws(
				() => byteBuffer.writeUInt32BE(dataset),
				(err) => err instanceof RangeError,
			);
			assert.is(byteBuffer.getResultLength(), 0);
		},
		invalidValues,
	);
});

describe("ByteBuffer#Int32LE", ({ assert, each }) => {
	const bufferSize = 4;
	const min = -2147483648;
	const max = 2147483647;
	const validValues = [min, max];
	const invalidValues = [min - 1, max + 1];

	each(
		"should write and read value",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));
			byteBuffer.writeInt32LE(dataset);

			assert.is(byteBuffer.getResultLength(), bufferSize);

			byteBuffer.reset();

			assert.is(byteBuffer.readInt32LE(), dataset);
			assert.is(byteBuffer.getResultLength(), bufferSize);
		},
		validValues,
	);

	each(
		"should throw RangeError",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));

			assert.throws(
				() => byteBuffer.writeInt32LE(dataset),
				(err) => err instanceof RangeError,
			);
			assert.is(byteBuffer.getResultLength(), 0);
		},
		invalidValues,
	);
});

describe("ByteBuffer#UInt32LE", ({ assert, each }) => {
	const bufferSize = 4;
	const min = 0;
	const max = 4294967295;
	const validValues = [min, max];
	const invalidValues = [min - 1, max + 1];

	each(
		"should write and read value",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));
			byteBuffer.writeUInt32LE(dataset);

			assert.is(byteBuffer.getResultLength(), bufferSize);

			byteBuffer.reset();

			assert.is(byteBuffer.readUInt32LE(), dataset);
			assert.is(byteBuffer.getResultLength(), bufferSize);
		},
		validValues,
	);

	each(
		"should throw RangeError",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));

			assert.throws(
				() => byteBuffer.writeUInt32LE(dataset),
				(err) => err instanceof RangeError,
			);
			assert.is(byteBuffer.getResultLength(), 0);
		},
		invalidValues,
	);
});

describe("ByteBuffer#BigInt64BE", ({ assert, each }) => {
	const bufferSize = 8;
	const min = -9223372036854775808n;
	const max = 9223372036854775807n;
	const validValues = [min, max];
	const invalidValues = [min - 1n, max + 1n];

	each(
		"should write and read value",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));
			byteBuffer.writeBigInt64BE(dataset);

			assert.is(byteBuffer.getResultLength(), bufferSize);

			byteBuffer.reset();

			assert.is(byteBuffer.readBigInt64BE(), dataset);
			assert.is(byteBuffer.getResultLength(), bufferSize);
		},
		validValues,
	);

	each(
		"should throw RangeError",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));

			assert.throws(
				() => byteBuffer.writeBigInt64BE(dataset),
				(err) => err instanceof RangeError,
			);
			assert.is(byteBuffer.getResultLength(), 0);
		},
		invalidValues,
	);
});

describe("ByteBuffer#BigUInt64BE", ({ assert, each }) => {
	const bufferSize = 8;
	const min = 0n;
	const max = 18_446_744_073_709_551_615n;
	const validValues = [min, max];
	const invalidValues = [min - 1n, max + 1n];

	each(
		"should write and read value",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));
			byteBuffer.writeBigUInt64BE(dataset);

			assert.is(byteBuffer.getResultLength(), bufferSize);

			byteBuffer.reset();

			assert.is(byteBuffer.readBigUInt64BE(), dataset);
			assert.is(byteBuffer.getResultLength(), bufferSize);
		},
		validValues,
	);

	each(
		"should throw RangeError",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));

			assert.throws(
				() => byteBuffer.writeBigUInt64BE(dataset),
				(err) => err instanceof RangeError,
			);
			assert.is(byteBuffer.getResultLength(), 0);
		},
		invalidValues,
	);
});

describe("ByteBuffer#BigInt64LE", ({ assert, each }) => {
	const bufferSize = 8;
	const min = -9223372036854775808n;
	const max = 9223372036854775807n;
	const validValues = [min, max];
	const invalidValues = [min - 1n, max + 1n];

	each(
		"should write and read value",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));
			byteBuffer.writeBigInt64LE(dataset);

			assert.is(byteBuffer.getResultLength(), bufferSize);

			byteBuffer.reset();

			assert.is(byteBuffer.readBigInt64LE(), dataset);
			assert.is(byteBuffer.getResultLength(), bufferSize);
		},
		validValues,
	);

	each(
		"should throw RangeError",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));

			assert.throws(
				() => byteBuffer.writeBigInt64LE(dataset),
				(err) => err instanceof RangeError,
			);
			assert.is(byteBuffer.getResultLength(), 0);
		},
		invalidValues,
	);
});

describe("ByteBuffer#BigUInt64LE", ({ assert, each }) => {
	const bufferSize = 8;
	const min = 0n;
	const max = 18_446_744_073_709_551_615n;
	const validValues = [min, max];
	const invalidValues = [min - 1n, max + 1n];

	each(
		"should write and read value",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));
			byteBuffer.writeBigUInt64LE(dataset);

			assert.is(byteBuffer.getResultLength(), bufferSize);

			byteBuffer.reset();

			assert.is(byteBuffer.readBigUInt64LE(), dataset);
			assert.is(byteBuffer.getResultLength(), bufferSize);
		},
		validValues,
	);

	each(
		"should throw RangeError",
		({ dataset }) => {
			const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));

			assert.throws(
				() => byteBuffer.writeBigUInt64LE(dataset),
				(err) => err instanceof RangeError,
			);
			assert.is(byteBuffer.getResultLength(), 0);
		},
		invalidValues,
	);
});

describe("ByteBuffer#buffer", ({ assert, it }) => {
	it("should return valid result & result length", () => {
		const bufferSize = 5;
		const bufferToCompare = Buffer.alloc(bufferSize).fill(1);

		const byteBuffer = new ByteBuffer(Buffer.alloc(bufferSize));
		byteBuffer.writeBuffer(bufferToCompare);

		assert.is(byteBuffer.getResultLength(), bufferSize);

		byteBuffer.reset();

		assert.is(bufferToCompare.compare(byteBuffer.readBuffer(bufferSize)), 0);
		assert.is(byteBuffer.getResultLength(), bufferSize);
	});

	it("should throw when writing over boundary", () => {
		const buffer = Buffer.alloc(5);
		const byteBuffer = new ByteBuffer(buffer);

		assert.throws(() => byteBuffer.writeBuffer(Buffer.alloc(6)), "Write over buffer boundary");
	});

	it("should throw reading writing over boundary", () => {
		const buffer = Buffer.alloc(5);
		const byteBuffer = new ByteBuffer(buffer);

		assert.throws(() => byteBuffer.readBuffer(6), "Read over buffer boundary");
	});
});
