import { picasso } from "@vechain/picasso";

const memory: Record<string, string> = {};

export class Avatar {
	public static make(seed: string): string {
		if (memory[seed] === undefined) {
			memory[seed] = picasso(seed);
		}

		return memory[seed];
	}
}
