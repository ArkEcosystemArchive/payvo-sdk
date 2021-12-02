import { bech32 as base, Decoded } from "bech32";

class Bech32 {
	public encode(prefix: string, words: ArrayLike<number>): string {
		return base.encode(prefix, words);
	}

	public decode(value: string, limit?: number | undefined): Decoded {
		return base.decode(value, limit);
	}

	public toWords(bytes: ArrayLike<number>): number[] {
		return base.toWords(bytes);
	}
}

export const bech32 = new Bech32();
