import { bech32 as base, Bech32Decoded } from "micro-base";

class Bech32 {
	public encode(prefix: string, words: number[]): string {
		return base.encode(prefix, words);
	}

	public decode(value: string, limit?: number | undefined): Bech32Decoded {
		return base.decode(value, limit);
	}

	public toWords(bytes: number[]): number[] {
		return base.toWords(new Uint8Array(bytes));
	}
}

export const bech32 = new Bech32();
