export const Uint8 = {
	from: (value: Uint8Array | number[]) =>
		[...value].reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), ""),
	toHex: (value: string) => new Uint8Array((value.match(/.{1,2}/g) ?? []).map((byte) => parseInt(byte, 16))),
};
