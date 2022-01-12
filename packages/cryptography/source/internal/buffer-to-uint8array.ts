export const toArrayBuffer = (value: Buffer | string): Uint8Array => {
	if (value instanceof Buffer) {
		const buffer = new ArrayBuffer(value.length);
		const result = new Uint8Array(buffer);

		for (const [index, element] of value.entries()) {
			result[index] = element;
		}

		return result;
	}

	return new TextEncoder().encode(value);
};

export const toArrayBufferList = (values: Buffer[]): Uint8Array[] =>
	values.map((value: Buffer) => toArrayBuffer(value));
