export const toArrayBuffer = (value: Buffer): Uint8Array => {
	const buffer = new ArrayBuffer(value.length);
	const result = new Uint8Array(buffer);

	for (const [index, element] of value.entries()) {
		result[index] = element;
	}

	return result;
};

export const toArrayBufferList = (values: Buffer[]): Uint8Array[] =>
	values.map((value: Buffer) => toArrayBuffer(value));
