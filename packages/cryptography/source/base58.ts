import { base58 } from "micro-base";

const normalise = (value: string | Buffer): Buffer => (value instanceof Buffer ? value : Buffer.from(value));

export class Base58 {
	public static encode(value: string | Buffer): string {
		return base58.encode(normalise(value));
	}

	public static decode(value: string): Uint8Array {
		return base58.decode(value);
	}

	public static validate(value: string): boolean {
		try {
			base58.decode(value);

			return true;
		} catch {
			return false;
		}
	}
}
