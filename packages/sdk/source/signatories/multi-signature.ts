import { MultiSignatureAsset } from "../services";

export class MultiSignatureSignatory {
	readonly #signature: MultiSignatureAsset;
	readonly #address: string;

	public constructor(signature: MultiSignatureAsset, address: string) {
		this.#signature = signature;
		this.#address = address;
	}

	public signingList(): MultiSignatureAsset {
		return this.#signature;
	}

	public address(): string {
		return this.#address;
	}
}
